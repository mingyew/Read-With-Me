import { getStorage } from "firebase/storage";
import { getFirestore, collection } from "firebase/firestore";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const app = firebase.initializeApp({
//env stuff
});

export const auth = app.auth();
export const storage = getStorage(app);

export const db = getFirestore();
export const storiesRef = collection(db, "savedstories");
export const commentsRef = collection(db, "comments");
