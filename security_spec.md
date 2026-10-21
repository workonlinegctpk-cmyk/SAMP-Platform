# Security Specification: SAMP Platform Firestore Database

## 1. Data Invariants
- **Identity Isolation**: A user can only access and modify their own documents (`userId == request.auth.uid` or document ID equals UID for `/users/{userId}`).
- **Document ID Safety**: Path variables must conform to `isValidId` (`matches('^[a-zA-Z0-9_\\-]+$')` with size <= 128).
- **Immutable Keys**: Sensitive ownership fields (`userId`, `createdAt`, `id`) cannot be tampered with on update (`incoming().userId == existing().userId`).
- **Bounded Inputs**: All strings have explicit maximum lengths (`size() <= N`) and arrays are bounded to prevent resource exhaustion attacks.
- **Connection Test Guard**: The path `/test/{testId}` is open for connection verification probes only.

## 2. The "Dirty Dozen" Threat Vectors & Payloads
1. **Unauthenticated Write**: An unauthenticated request attempts to create `/accounts/acc_1`. (Rejected: `request.auth != null`).
2. **Identity Spoofing**: User `A` creates an account with `userId: 'user_B'`. (Rejected: `incoming().userId == request.auth.uid`).
3. **Malicious ID Injection**: A path containing `../` or excessive characters is sent. (Rejected: `isValidId(docId)`).
4. **Denial of Wallet String Injection**: An account name containing 5MB of string data is sent. (Rejected: `name.size() <= 150`).
5. **Cross-Tenant Post Deletion**: User `A` tries to delete a post owned by User `B`. (Rejected: `existing().userId == request.auth.uid`).
6. **Cross-Tenant List Scraping**: An authenticated user runs `collection('posts')` without scoping to their own UID. (Rejected: `resource.data.userId == request.auth.uid`).
7. **User Profile Hijacking**: User `A` attempts to write to `/users/{userB_UID}`. (Rejected: `request.auth.uid == userId`).
8. **Shadow Field Injection**: A user tries to inject unauthorized admin flags into their user profile. (Rejected: `isValidUser()` strictly checks schema keys and types).
9. **Post Status Corruption**: A user tries to set an invalid status like `"hacked"`. (Rejected: status must be in `['draft', 'queued', 'scheduled', 'publishing', 'published', 'failed']`).
10. **Platform Tampering**: A user sends a post with invalid target platform string. (Rejected: platforms bounded by allowlist).
11. **Immutable Key Modification**: A user updates a post and changes `userId` to someone else. (Rejected: `incoming().userId == existing().userId`).
12. **Catch-All Default Access**: Attempting to query non-existent or internal collections. (Rejected: `match /{document=**} { allow read, write: if false; }`).
