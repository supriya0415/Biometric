
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbqyilRUS2wc9HXQsAiaEeIKo4Q5w7jt8",
  authDomain: "get-feedback-781ae.firebaseapp.com",
  projectId: "get-feedback-781ae",
  storageBucket: "get-feedback-781ae.firebasestorage.app",
  messagingSenderId: "50037107467",
  appId: "1:50037107467:web:ed12d602274321ad28900e",
  measurementId: "G-CBVKJSZV5G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Authentication functions
export const registerUser = async (email: string, password: string) => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    console.error("Firebase auth error:", error.code, error.message);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    console.error("Firebase login error:", error.code, error.message);
    throw error;
  }
};

export const logoutUser = () => {
  return signOut(auth);
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Face authentication functions
export const saveFaceData = async (userId: string, faceData: string) => {
  try {
    // Save to Firebase Storage
    const storageRef = ref(storage, `faces/${userId}`);
    await uploadString(storageRef, faceData, 'data_url');
    
    // Save reference in Firestore
    await setDoc(doc(db, "users", userId), {
      hasFacialAuth: true,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error("Error saving face data:", error);
    throw error;
  }
};

export const getFaceData = async (userId: string) => {
  try {
    // Check if user has facial auth enabled
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists() || !userDoc.data().hasFacialAuth) {
      return null;
    }
    
    // Get face data from storage
    const storageRef = ref(storage, `faces/${userId}`);
    const faceDataUrl = await getDownloadURL(storageRef);
    return faceDataUrl;
  } catch (error) {
    console.error("Error fetching face data:", error);
    return null;
  }
};

export const verifyFaceData = async (userId: string, currentFaceData: string) => {
  try {
    // In a real application, we would use a proper face recognition API
    // For this demo, we'll just check if face data exists for the user
    const userDoc = await getDoc(doc(db, "users", userId));
    return userDoc.exists() && userDoc.data().hasFacialAuth;
  } catch (error) {
    console.error("Error verifying face data:", error);
    return false;
  }
};

export { auth, db, storage };
