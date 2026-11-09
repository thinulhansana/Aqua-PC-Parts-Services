import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

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

const DATA_DIR = path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

// In-memory mirror & fallback if disk is read-only
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

async function readUsers(): Promise<StoredUser[]> {
  try {
    const raw = await fs.readFile(USERS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      memoryUsers = parsed;
      return parsed;
    }
  } catch {
    // File does not exist yet or cannot be read
  }
  if (memoryUsers) return memoryUsers;
  memoryUsers = [];
  return memoryUsers;
}

async function writeUsers(users: StoredUser[]): Promise<void> {
  memoryUsers = users;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
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
  return serializeTask(async () => {
    const users = await readUsers();
    const normalizedEmail = normalizeEmail(email);

    const existing = users.find((u) => u.email === normalizedEmail);
    if (existing) {
      const msg =
        existing.provider === "google"
          ? "An account with this email already exists via Google Sign-In. Please sign in with Google."
          : "An account with this email already exists.";
      throw new Error(`DUPLICATE_EMAIL:${msg}`);
    }

    const now = new Date().toISOString();
    const newUser: StoredUser = {
      id: randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      provider: "credentials",
      createdAt: now,
      updatedAt: now,
    };

    users.push(newUser);
    await writeUsers(users);
    return toPublicProfile(newUser);
  });
}

export async function verifyUserCredentials(
  email: string,
  password: string
): Promise<PublicUserProfile | null> {
  return serializeTask(async () => {
    const users = await readUsers();
    const normalizedEmail = normalizeEmail(email);
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
  return serializeTask(async () => {
    const users = await readUsers();
    const normalizedEmail = normalizeEmail(email);
    const now = new Date().toISOString();
    const existing = users.find((u) => u.email === normalizedEmail);

    if (existing) {
      existing.name = existing.name || name?.trim() || normalizedEmail.split("@")[0];
      existing.image = image || existing.image;
      existing.updatedAt = now;
      await writeUsers(users);
      return toPublicProfile(existing);
    }

    const created: StoredUser = {
      id: randomUUID(),
      name: name?.trim() || normalizedEmail.split("@")[0],
      email: normalizedEmail,
      provider,
      image: image || undefined,
      createdAt: now,
      updatedAt: now,
    };

    users.push(created);
    await writeUsers(users);
    return toPublicProfile(created);
  });
}

export async function getUserProfileByEmail(
  email: string
): Promise<PublicUserProfile | null> {
  return serializeTask(async () => {
    const users = await readUsers();
    const normalizedEmail = normalizeEmail(email);
    const user = users.find((u) => u.email === normalizedEmail);
    return user ? toPublicProfile(user) : null;
  });
}

export async function updateUserProfileByEmail(
  email: string,
  updates: { name?: string; phone?: string; rigSpecs?: string }
): Promise<PublicUserProfile | null> {
  return serializeTask(async () => {
    const users = await readUsers();
    const normalizedEmail = normalizeEmail(email);
    const user = users.find((u) => u.email === normalizedEmail);
    const now = new Date().toISOString();

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
      await writeUsers(users);
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
    await writeUsers(users);
    return toPublicProfile(user);
  });
}

