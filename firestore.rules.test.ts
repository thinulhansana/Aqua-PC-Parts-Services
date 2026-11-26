/**
 * Security rules verification specification for Aqua PC Solutions Firestore rules.
 * Validates the 12 adversarial "Dirty Dozen" payloads against firestore.rules.
 */
export interface DirtyDozenTestCase {
  id: number;
  name: string;
  operation: "get" | "list" | "create" | "update" | "delete";
  path: string;
  auth: { uid: string; email?: string; email_verified?: boolean } | null;
  payload?: Record<string, unknown>;
  expected: "PERMISSION_DENIED";
}

export const DIRTY_DOZEN_CASES: DirtyDozenTestCase[] = [
  {
    id: 1,
    name: "Unauthenticated PII Read",
    operation: "get",
    path: "/users/userA",
    auth: null,
    expected: "PERMISSION_DENIED",
  },
  {
    id: 2,
    name: "Cross-User PII Read",
    operation: "get",
    path: "/users/userA",
    auth: { uid: "userB", email: "b@example.com", email_verified: true },
    expected: "PERMISSION_DENIED",
  },
  {
    id: 3,
    name: "Unverified Admin Email Spoof",
    operation: "get",
    path: "/users/userA",
    auth: {
      uid: "spoofUid",
      email: "thinulhansana0411@gmail.com",
      email_verified: false,
    },
    expected: "PERMISSION_DENIED",
  },
  {
    id: 4,
    name: "Shadow Role Injection on Profile Create",
    operation: "create",
    path: "/users/userA",
    auth: { uid: "userA", email: "a@example.com", email_verified: true },
    payload: {
      uid: "userA",
      displayName: "User A",
      email: "a@example.com",
      isAdmin: true,
    },
    expected: "PERMISSION_DENIED",
  },
  {
    id: 5,
    name: "Self-Assigned Admin Document Write",
    operation: "create",
    path: "/admins/userA",
    auth: { uid: "userA", email: "a@example.com", email_verified: true },
    payload: { uid: "userA", email: "a@example.com" },
    expected: "PERMISSION_DENIED",
  },
  {
    id: 6,
    name: "Owner Spoofing on Build Create",
    operation: "create",
    path: "/users/userA/builds/build1",
    auth: { uid: "userA", email: "a@example.com", email_verified: true },
    payload: {
      ownerId: "userB",
      name: "Spoof Rig",
      cpu: "Ryzen 9 9950X",
      gpu: "RTX 5090",
      coolingMode: "liquid",
      caseFinish: "obsidian",
      rgbColor: "#4cd7f6",
      explodedLevel: 0,
    },
    expected: "PERMISSION_DENIED",
  },
  {
    id: 7,
    name: "Orphaned Build Without Parent Profile",
    operation: "create",
    path: "/users/orphanUser/builds/build1",
    auth: { uid: "orphanUser", email: "o@example.com", email_verified: true },
    payload: {
      ownerId: "orphanUser",
      name: "Orphan Rig",
      cpu: "Core i9",
      gpu: "RTX 4090",
      coolingMode: "liquid",
      caseFinish: "obsidian",
      rgbColor: "#4cd7f6",
      explodedLevel: 0,
    },
    expected: "PERMISSION_DENIED",
  },
  {
    id: 8,
    name: "Backdated Client Timestamp",
    operation: "create",
    path: "/users/userA/builds/build1",
    auth: { uid: "userA", email: "a@example.com", email_verified: true },
    payload: {
      ownerId: "userA",
      name: "Backdated Rig",
      cpu: "Core i7",
      gpu: "RTX 4070",
      coolingMode: "air",
      caseFinish: "frost",
      rgbColor: "#4cd7f6",
      explodedLevel: 0,
      createdAt: "2020-01-01T00:00:00.000Z",
      updatedAt: "2020-01-01T00:00:00.000Z",
    },
    expected: "PERMISSION_DENIED",
  },
  {
    id: 9,
    name: "Immutable Field Tampering on Update",
    operation: "update",
    path: "/users/userA/builds/build1",
    auth: { uid: "userA", email: "a@example.com", email_verified: true },
    payload: { ownerId: "userB" },
    expected: "PERMISSION_DENIED",
  },
  {
    id: 10,
    name: "Value Poisoning on Allowed Key",
    operation: "update",
    path: "/users/userA/builds/build1",
    auth: { uid: "userA", email: "a@example.com", email_verified: true },
    payload: { rgbColor: "invalid-color", explodedLevel: 999 },
    expected: "PERMISSION_DENIED",
  },
  {
    id: 11,
    name: "Resource Poisoning with Oversized ID",
    operation: "create",
    path: `/users/userA/chatMessages/${"x".repeat(200)}`,
    auth: { uid: "userA", email: "a@example.com", email_verified: true },
    payload: {
      ownerId: "userA",
      role: "user",
      text: "hello",
      model: "gemini-4-hydrogen",
      mode: "standard",
    },
    expected: "PERMISSION_DENIED",
  },
  {
    id: 12,
    name: "Blanket Collection Scrape by Non-Admin",
    operation: "list",
    path: "/users",
    auth: { uid: "userB", email: "b@example.com", email_verified: true },
    expected: "PERMISSION_DENIED",
  },
];
