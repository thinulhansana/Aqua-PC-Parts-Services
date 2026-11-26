# Firestore Security Specification — Aqua PC Solutions

## 1. Data Invariants
1. **Strict PII Ownership**: `/users/{userId}` holds customer email and phone PII; only the verified owner (`request.auth.uid == userId && request.auth.token.email_verified == true`) or a verified founder admin may read it.
2. **Master Gate Parent Existence**: Subcollection documents under `/users/{userId}/builds/{buildId}` and `/users/{userId}/chatMessages/{messageId}` cannot be created unless the parent `/users/{userId}` document exists and `ownerId == request.auth.uid == userId`.
3. **Immutable Ownership & Temporal Integrity**: `uid`, `ownerId`, and `createdAt` can never change after creation; `createdAt` on create and `updatedAt` on create/update must equal `request.time`.
4. **No Shadow Fields or Self-Assigned Roles**: Exact key allowlists (`hasAll`/`hasOnly`) reject ghost fields such as `isAdmin` or `role`. Client writes to `/admins/{userId}` are unconditionally denied.
5. **Bounded String & ID Hardening**: All document IDs match `^[a-zA-Z0-9_\-]+$` (`<= 128` chars), every string field has an explicit `.size()` bound, and hex colors match `^#[0-9a-fA-F]{6}$`.
6. **Rule-Enforced List Queries**: `allow list` strictly evaluates `resource.data.ownerId == request.auth.uid` without calling `get()` or `exists()`.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Unauthenticated PII Read**: `GET /users/userA` without auth -> `PERMISSION_DENIED`.
2. **Cross-User PII Read**: `GET /users/userA` signed in as `userB` -> `PERMISSION_DENIED`.
3. **Unverified Admin Email Spoof**: `GET /users/userA` with `email: "thinulhansana0411@gmail.com"` and `email_verified: false` -> `PERMISSION_DENIED`.
4. **Shadow Role Injection on Profile Create**: `CREATE /users/userA` with `{ uid: "userA", ..., isAdmin: true }` -> `PERMISSION_DENIED`.
5. **Self-Assigned Admin Document Write**: `CREATE /admins/userA` as `userA` -> `PERMISSION_DENIED`.
6. **Owner Spoofing on Build Create**: `CREATE /users/userA/builds/b1` as `userA` with `{ ownerId: "userB", ... }` -> `PERMISSION_DENIED`.
7. **Orphaned Build Without Parent Profile**: `CREATE /users/orphan/builds/b1` when `/users/orphan` does not exist -> `PERMISSION_DENIED`.
8. **Backdated Client Timestamp**: `CREATE /users/userA/builds/b1` with `createdAt: "2020-01-01T00:00:00Z"` instead of `serverTimestamp()` -> `PERMISSION_DENIED`.
9. **Immutable Field Tampering on Update**: `UPDATE /users/userA/builds/b1` attempting to modify `ownerId` or `createdAt` -> `PERMISSION_DENIED`.
10. **Value Poisoning on Allowed Key**: `UPDATE /users/userA/builds/b1` setting `rgbColor: "not-a-hex"` or `explodedLevel: 99` -> `PERMISSION_DENIED`.
11. **Resource Poisoning / Oversized ID or String**: `CREATE /users/userA/chatMessages/<200-char-id>` or `text` > 8000 chars -> `PERMISSION_DENIED`.
12. **Blanket Collection Scrape**: `LIST /users` as a non-admin user -> `PERMISSION_DENIED`.
