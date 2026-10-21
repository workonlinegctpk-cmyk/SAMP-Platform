import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  onSnapshot, 
  getDocFromServer,
  Unsubscribe 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { 
  UserProfile, 
  SocialAccount, 
  ScheduledPost, 
  RssFeedAutomation, 
  EvergreenQueue, 
  InboxMessage 
} from '../types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore with dedicated Database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// ==============================================================================
// ERROR HANDLING (Strictly conforms to FirestoreErrorInfo)
// ==============================================================================
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((p) => ({
        providerId: p.providerId,
        email: p.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ==============================================================================
// CONNECTION VALIDATION TEST
// ==============================================================================
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('✅ Firestore connection verified successfully');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

// Run connection verification probe on boot
testConnection();

// ==============================================================================
// GOOGLE AUTHENTICATION HELPERS
// ==============================================================================
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export async function signInWithGoogle(): Promise<UserProfile> {
  try {
    const credential = await signInWithPopup(auth, googleProvider);
    const user = credential.user;
    return await syncUserProfile(user);
  } catch (error: any) {
    console.error('Google Sign-in error:', error);
    throw new Error(error.message || 'Google authentication failed');
  }
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

// User Profile synchronization in Firestore /users/{userId}
export async function syncUserProfile(firebaseUser: User, customData?: Partial<UserProfile>): Promise<UserProfile> {
  const userRef = doc(db, 'users', firebaseUser.uid);
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const existingData = snap.data() as UserProfile;
      const updated: UserProfile = {
        ...existingData,
        name: firebaseUser.displayName || existingData.name || 'SAMP User',
        email: firebaseUser.email || existingData.email,
        avatarUrl: firebaseUser.photoURL || existingData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        ...customData,
      };
      await setDoc(userRef, updated, { merge: true });
      return updated;
    } else {
      const initialProfile: UserProfile = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'SAMP Team Member',
        email: firebaseUser.email || 'user@example.com',
        role: 'owner',
        company: 'SAMP Global Agency',
        workspaceName: 'Primary Production Workspace',
        avatarUrl: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        createdAt: new Date().toISOString(),
        ...customData,
      };
      await setDoc(userRef, initialProfile);
      return initialProfile;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${firebaseUser.uid}`);
    throw error;
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${uid}`);
    return null;
  }
}

// ==============================================================================
// SOCIAL ACCOUNTS (FIRESTORE)
// ==============================================================================
export async function getAccountsFromFirestore(userId: string): Promise<SocialAccount[]> {
  try {
    const q = query(collection(db, 'accounts'), where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as SocialAccount);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'accounts');
    return [];
  }
}

export function subscribeAccounts(userId: string, callback: (accounts: SocialAccount[]) => void): Unsubscribe {
  const q = query(collection(db, 'accounts'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snap) => {
      const accs = snap.docs.map((d) => d.data() as SocialAccount);
      callback(accs);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'accounts');
    }
  );
}

export async function saveAccountToFirestore(account: SocialAccount): Promise<SocialAccount> {
  const docRef = doc(db, 'accounts', account.id);
  try {
    await setDoc(docRef, account);
    return account;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `accounts/${account.id}`);
    throw error;
  }
}

export async function deleteAccountFromFirestore(accountId: string): Promise<void> {
  const docRef = doc(db, 'accounts', accountId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `accounts/${accountId}`);
    throw error;
  }
}

// ==============================================================================
// POSTS (FIRESTORE)
// ==============================================================================
export async function getPostsFromFirestore(userId: string): Promise<ScheduledPost[]> {
  try {
    const q = query(collection(db, 'posts'), where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as ScheduledPost);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'posts');
    return [];
  }
}

export function subscribePosts(userId: string, callback: (posts: ScheduledPost[]) => void): Unsubscribe {
  const q = query(collection(db, 'posts'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snap) => {
      const posts = snap.docs.map((d) => d.data() as ScheduledPost);
      // Sort newest first
      posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(posts);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'posts');
    }
  );
}

export async function savePostToFirestore(post: ScheduledPost): Promise<ScheduledPost> {
  const docRef = doc(db, 'posts', post.id);
  try {
    await setDoc(docRef, post);
    return post;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `posts/${post.id}`);
    throw error;
  }
}

export async function updatePostInFirestore(id: string, updates: Partial<ScheduledPost>): Promise<void> {
  const docRef = doc(db, 'posts', id);
  try {
    await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `posts/${id}`);
    throw error;
  }
}

export async function deletePostFromFirestore(postId: string): Promise<void> {
  const docRef = doc(db, 'posts', postId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `posts/${postId}`);
    throw error;
  }
}

// ==============================================================================
// RSS AUTOMATIONS (FIRESTORE)
// ==============================================================================
export async function getRssFromFirestore(userId: string): Promise<RssFeedAutomation[]> {
  try {
    const q = query(collection(db, 'rssAutomations'), where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as RssFeedAutomation);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'rssAutomations');
    return [];
  }
}

export function subscribeRss(userId: string, callback: (rss: RssFeedAutomation[]) => void): Unsubscribe {
  const q = query(collection(db, 'rssAutomations'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snap) => {
      callback(snap.docs.map((d) => d.data() as RssFeedAutomation));
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'rssAutomations');
    }
  );
}

export async function saveRssToFirestore(item: RssFeedAutomation): Promise<RssFeedAutomation> {
  const docRef = doc(db, 'rssAutomations', item.id);
  try {
    await setDoc(docRef, item);
    return item;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `rssAutomations/${item.id}`);
    throw error;
  }
}

export async function deleteRssFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, 'rssAutomations', id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `rssAutomations/${id}`);
    throw error;
  }
}

// ==============================================================================
// EVERGREEN QUEUES (FIRESTORE)
// ==============================================================================
export async function getQueuesFromFirestore(userId: string): Promise<EvergreenQueue[]> {
  try {
    const q = query(collection(db, 'evergreenQueues'), where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as EvergreenQueue);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'evergreenQueues');
    return [];
  }
}

export function subscribeQueues(userId: string, callback: (queues: EvergreenQueue[]) => void): Unsubscribe {
  const q = query(collection(db, 'evergreenQueues'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snap) => {
      callback(snap.docs.map((d) => d.data() as EvergreenQueue));
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'evergreenQueues');
    }
  );
}

export async function saveQueueToFirestore(queue: EvergreenQueue): Promise<EvergreenQueue> {
  const docRef = doc(db, 'evergreenQueues', queue.id);
  try {
    await setDoc(docRef, queue);
    return queue;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `evergreenQueues/${queue.id}`);
    throw error;
  }
}

export async function deleteQueueFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, 'evergreenQueues', id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `evergreenQueues/${id}`);
    throw error;
  }
}

// ==============================================================================
// SOCIAL INBOX (FIRESTORE)
// ==============================================================================
export async function getInboxFromFirestore(userId: string): Promise<InboxMessage[]> {
  try {
    const q = query(collection(db, 'inboxMessages'), where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as InboxMessage);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'inboxMessages');
    return [];
  }
}

export function subscribeInbox(userId: string, callback: (messages: InboxMessage[]) => void): Unsubscribe {
  const q = query(collection(db, 'inboxMessages'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snap) => {
      callback(snap.docs.map((d) => d.data() as InboxMessage));
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'inboxMessages');
    }
  );
}

export async function saveInboxToFirestore(msg: InboxMessage): Promise<InboxMessage> {
  const docRef = doc(db, 'inboxMessages', msg.id);
  try {
    await setDoc(docRef, msg);
    return msg;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `inboxMessages/${msg.id}`);
    throw error;
  }
}

export async function deleteInboxFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, 'inboxMessages', id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `inboxMessages/${id}`);
    throw error;
  }
}
