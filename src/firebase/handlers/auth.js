import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {auth, db} from "../firebase.js";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Reference to a document in the 'users' collection
        const userRef = doc(db, "users", user.uid);

        // Check if user exists in Firestore
        const docSnap = await getDoc(userRef);
        // If user doesn't exist, add them to Firestore
        if (!docSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                // Add other relevant user info
            });
        }
    } catch (error) {
        console.error("Error signing in with Google: ", error);
    }
};
