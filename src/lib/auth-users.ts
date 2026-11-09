import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { getD1Database } from "@/lib/cf-env";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  provider: "credentials" | "google";
  image?: string;
  phone?: string;
  rigSpecs?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicUserProfile {
  id: string;
  name: string;
  email: string;
  provider: "credentials" | "google";
  image?: string;
  phone?: string;
  rigSpecs?: string;
  createdAt: string;
}

export interface AdminUserRecord extends PublicUserProfile {
  updatedAt: string;
}

export interface AdminUsersListResult {
  users: AdminUserRecord[];
  storage: "d1" | "local";
}

interface D1UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string | null;
  provider: string;
  image: string | null;
  phone: string | null;
  rig_specs: string | null;
  created_at: string;
  updated_at: string;
}

type D1AdminUserRow = Omit<D1UserRow, "password_hash">;

// Track initialized D1 instances in this isolate
const initializedDatabases = new WeakSet<object>();

// In-memory mirror & fallback if neither D1 nor writable filesystem is available
let memoryUsers: StoredUser[] | null = null;
let ioQueue: Promise<unknown> = Promise.resolve();

function serializeTask<T>(fn: () => Promise<T>): Promise<T> {
  const next = ioQueue.then(fn, fn);
  ioQueue = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function toPublicProfile(user: StoredUser): PublicUserProfile {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    provider: user.provider,
    image: user.image,
    phone: user.phone,
    rigSpecs: user.rigSpecs,
    createdAt: user.createdAt,
  };
}

function toAdminUserRecord(user: StoredUser): AdminUserRecord {
  return {
    ...toPublicProfile(user),
    updatedAt: user.updatedAt,
  };
}

function d1RowToStoredUser(row: D1UserRow): StoredUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash ?? undefined,
    provider: row.provider === "google" ? "google" : "credentials",
    image: row.image ?? undefined,
    phone: row.phone ?? undefined,
    rigSpecs: row.rig_specs ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function ensureD1Schema(db: D1Database): Promise<void> {
  if (initializedDatabases.has(db)) return;

  await db
    .prepare(
      "CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password_hash TEXT, provider TEXT NOT NULL DEFAULT 'credentials', image TEXT, phone TEXT, rig_specs TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)"
    )
    .run();

  await db
    .prepare("CREATE INDEX IF NOT EXISTS idx_users_email ON users (email)")
    .run();

  initializedDatabases.add(db);
}

function getLocalStoragePaths() {
  const dataDir = path.join(process.cwd(), ".data");
  return {
    dataDir,
    usersFile: path.join(dataDir, "users.json"),
  };
}

async function readLocalUsers(): Promise<StoredUser[]> {
  try {
    const { usersFile } = getLocalStoragePaths();
    const raw = await fs.readFile(usersFile, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      memoryUsers = parsed;
      return parsed;
    }
  } catch {
    // File does not exist yet or filesystem is read-only
  }
  if (memoryUsers) return memoryUsers;
  memoryUsers = [];
  return memoryUsers;
}

async function writeLocalUsers(users: StoredUser[]): Promise<void> {
  memoryUsers = users;
  try {
    const { dataDir, usersFile } = getLocalStoragePaths();
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(usersFile, JSON.stringify(users, null, 2), "utf8");
  } catch {
    // Keep memory store functional if filesystem writes are unavailable
  }
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(":");
  if (parts.length !== 2) return false;
  const [salt, keyHex] = parts;
  if (!salt || !keyHex) return false;

  const derived = scryptSync(password, salt, 64);
  const storedKey = Buffer.from(keyHex, "hex");
  if (derived.length !== storedKey.length) return false;
  return timingSafeEqual(derived, storedKey);
}

export async function createCredentialsUser({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}): Promise<PublicUserProfile> {
  const normalizedEmail = normalizeEmail(email);
  const cleanName = name.trim();
  const passwordHash = hashPassword(password);
  const now = new Date().toISOString();

  const db = await getD1Database();
  if (db) {
    await ensureD1Schema(db);
    const existing = await db
      .prepare("SELECT provider FROM users WHERE email = ?")
      .bind(normalizedEmail)
      .first<{ provider: string }>();

    if (existing) {
      const msg =
        existing.provider === "google"
          ? "An account with this email already exists via Google Sign-In. Please sign in with Google."
          : "An account with this email already exists.";
      throw new Error(`DUPLICATE_EMAIL:${msg}`);
    }

    const created: StoredUser = {
      id: randomUUID(),
      name: cleanName,
      email: normalizedEmail,
      passwordHash,
      provider: "credentials",
      createdAt: now,
      updatedAt: now,
    };

    try {
      await db
        .prepare(
          "INSERT INTO users (id, name, email, password_hash, provider, image, phone, rig_specs, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NULL, NULL, NULL, ?, ?)"
        )
        .bind(
          created.id,
          created.name,
          created.email,
          created.passwordHash,
          created.provider,
          created.createdAt,
          created.updatedAt
        )
        .run();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "";
      if (msg.includes("UNIQUE")) {
        throw new Error(
          "DUPLICATE_EMAIL:An account with this email already exists."
        );
      }
      throw error;
    }

    return toPublicProfile(created);
  }

  return serializeTask(async () => {
    const users = await readLocalUsers();

    const existing = users.find((u) => u.email === normalizedEmail);
    if (existing) {
      const msg =
        existing.provider === "google"
          ? "An account with this email already exists via Google Sign-In. Please sign in with Google."
          : "An account with this email already exists.";
      throw new Error(`DUPLICATE_EMAIL:${msg}`);
    }

    const newUser: StoredUser = {
      id: randomUUID(),
      name: cleanName,
      email: normalizedEmail,
      passwordHash,
      provider: "credentials",
      createdAt: now,
      updatedAt: now,
    };

    users.push(newUser);
    await writeLocalUsers(users);
    return toPublicProfile(newUser);
  });
}

export async function verifyUserCredentials(
  email: string,
  password: string
): Promise<PublicUserProfile | null> {
  const normalizedEmail = normalizeEmail(email);

  const db = await getD1Database();
  if (db) {
    await ensureD1Schema(db);
    const row = await db
      .prepare("SELECT * FROM users WHERE email = ?")
      .bind(normalizedEmail)
      .first<D1UserRow>();

    if (!row || !row.password_hash) return null;
    if (!verifyPassword(password, row.password_hash)) return null;

    return toPublicProfile(d1RowToStoredUser(row));
  }

  return serializeTask(async () => {
    const users = await readLocalUsers();
    const user = users.find((u) => u.email === normalizedEmail);
    if (!user || !user.passwordHash) return null;

    const valid = verifyPassword(password, user.passwordHash);
    if (!valid) return null;

    return toPublicProfile(user);
  });
}

export async function upsertOAuthProfile({
  email,
  name,
  image,
  provider,
}: {
  email: string;
  name?: string | null;
  image?: string | null;
  provider: "google";
}): Promise<PublicUserProfile> {
  const normalizedEmail = normalizeEmail(email);
  const now = new Date().toISOString();
  const fallbackName = name?.trim() || normalizedEmail.split("@")[0];

  const db = await getD1Database();
  if (db) {
    await ensureD1Schema(db);
    const existingRow = await db
      .prepare("SELECT * FROM users WHERE email = ?")
      .bind(normalizedEmail)
      .first<D1UserRow>();

    if (existingRow) {
      const existing = d1RowToStoredUser(existingRow);
      const nextName = existing.name || fallbackName;
      const nextImage = image || existing.image || null;

      await db
        .prepare(
          "UPDATE users SET name = ?, image = ?, updated_at = ? WHERE email = ?"
        )
        .bind(nextName, nextImage, now, normalizedEmail)
        .run();

      return toPublicProfile({
        ...existing,
        name: nextName,
        image: nextImage ?? undefined,
        updatedAt: now,
      });
    }

    const created: StoredUser = {
      id: randomUUID(),
      name: fallbackName,
      email: normalizedEmail,
      provider,
      image: image || undefined,
      createdAt: now,
      updatedAt: now,
    };

    await db
      .prepare(
        "INSERT INTO users (id, name, email, password_hash, provider, image, phone, rig_specs, created_at, updated_at) VALUES (?, ?, ?, NULL, ?, ?, NULL, NULL, ?, ?)"
      )
      .bind(
        created.id,
        created.name,
        created.email,
        created.provider,
        created.image ?? null,
        created.createdAt,
        created.updatedAt
      )
      .run();

    return toPublicProfile(created);
  }

  return serializeTask(async () => {
    const users = await readLocalUsers();
    const existing = users.find((u) => u.email === normalizedEmail);

    if (existing) {
      existing.name = existing.name || fallbackName;
      existing.image = image || existing.image;
      existing.updatedAt = now;
      await writeLocalUsers(users);
      return toPublicProfile(existing);
    }

    const created: StoredUser = {
      id: randomUUID(),
      name: fallbackName,
      email: normalizedEmail,
      provider,
      image: image || undefined,
      createdAt: now,
      updatedAt: now,
    };

    users.push(created);
    await writeLocalUsers(users);
    return toPublicProfile(created);
  });
}

export async function getUserProfileByEmail(
  email: string
): Promise<PublicUserProfile | null> {
  const normalizedEmail = normalizeEmail(email);

  const db = await getD1Database();
  if (db) {
    await ensureD1Schema(db);
    const row = await db
      .prepare("SELECT * FROM users WHERE email = ?")
      .bind(normalizedEmail)
      .first<D1UserRow>();
    return row ? toPublicProfile(d1RowToStoredUser(row)) : null;
  }

  return serializeTask(async () => {
    const users = await readLocalUsers();
    const user = users.find((u) => u.email === normalizedEmail);
    return user ? toPublicProfile(user) : null;
  });
}

export async function updateUserProfileByEmail(
  email: string,
  updates: { name?: string; phone?: string; rigSpecs?: string }
): Promise<PublicUserProfile | null> {
  const normalizedEmail = normalizeEmail(email);
  const now = new Date().toISOString();

  const db = await getD1Database();
  if (db) {
    await ensureD1Schema(db);
    const existingRow = await db
      .prepare("SELECT * FROM users WHERE email = ?")
      .bind(normalizedEmail)
      .first<D1UserRow>();

    if (!existingRow) {
      const created: StoredUser = {
        id: randomUUID(),
        name: updates.name?.trim() || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        provider: "google",
        phone: updates.phone?.trim() || undefined,
        rigSpecs: updates.rigSpecs?.trim() || undefined,
        createdAt: now,
        updatedAt: now,
      };

      await db
        .prepare(
          "INSERT INTO users (id, name, email, password_hash, provider, image, phone, rig_specs, created_at, updated_at) VALUES (?, ?, ?, NULL, ?, NULL, ?, ?, ?, ?)"
        )
        .bind(
          created.id,
          created.name,
          created.email,
          created.provider,
          created.phone ?? null,
          created.rigSpecs ?? null,
          created.createdAt,
          created.updatedAt
        )
        .run();

      return toPublicProfile(created);
    }

    const user = d1RowToStoredUser(existingRow);
    const nextName =
      typeof updates.name === "string" && updates.name.trim()
        ? updates.name.trim()
        : user.name;
    const nextPhone =
      typeof updates.phone === "string" ? updates.phone.trim() : user.phone;
    const nextSpecs =
      typeof updates.rigSpecs === "string"
        ? updates.rigSpecs.trim()
        : user.rigSpecs;

    await db
      .prepare(
        "UPDATE users SET name = ?, phone = ?, rig_specs = ?, updated_at = ? WHERE email = ?"
      )
      .bind(
        nextName,
        nextPhone ?? null,
        nextSpecs ?? null,
        now,
        normalizedEmail
      )
      .run();

    return toPublicProfile({
      ...user,
      name: nextName,
      phone: nextPhone,
      rigSpecs: nextSpecs,
      updatedAt: now,
    });
  }

  return serializeTask(async () => {
    const users = await readLocalUsers();
    const user = users.find((u) => u.email === normalizedEmail);

    if (!user) {
      const created: StoredUser = {
        id: randomUUID(),
        name: updates.name?.trim() || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        provider: "google",
        phone: updates.phone?.trim() || undefined,
        rigSpecs: updates.rigSpecs?.trim() || undefined,
        createdAt: now,
        updatedAt: now,
      };
      users.push(created);
      await writeLocalUsers(users);
      return toPublicProfile(created);
    }

    if (typeof updates.name === "string" && updates.name.trim()) {
      user.name = updates.name.trim();
    }
    if (typeof updates.phone === "string") {
      user.phone = updates.phone.trim();
    }
    if (typeof updates.rigSpecs === "string") {
      user.rigSpecs = updates.rigSpecs.trim();
    }
    user.updatedAt = now;
    await writeLocalUsers(users);
    return toPublicProfile(user);
  });
}

export async function listAllUsers(): Promise<AdminUsersListResult> {
  const db = await getD1Database();
  if (db) {
    await ensureD1Schema(db);
    const result = await db
      .prepare(
        "SELECT id, name, email, provider, image, phone, rig_specs, created_at, updated_at FROM users ORDER BY created_at DESC"
      )
      .all<D1AdminUserRow>();

    const rows = Array.isArray(result?.results) ? result.results : [];
    const users: AdminUserRecord[] = rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      provider: row.provider === "google" ? "google" : "credentials",
      image: row.image ?? undefined,
      phone: row.phone ?? undefined,
      rigSpecs: row.rig_specs ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return { users, storage: "d1" };
  }

  return serializeTask(async () => {
    const users = await readLocalUsers();
    const sorted = [...users].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return (Number.isFinite(timeB) ? timeB : 0) - (Number.isFinite(timeA) ? timeA : 0);
    });

    return {
      users: sorted.map(toAdminUserRecord),
      storage: "local",
    };
  });
}
