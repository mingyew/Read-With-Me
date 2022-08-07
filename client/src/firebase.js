import firebase from "firebase/compat/app";
import { getStorage } from "firebase/storage";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import "firebase/compat/auth";

const app = firebase.initializeApp({
  apiKey: "AIzaSyCvWiPewz4V-T_v8yr5Grc-EOUgWlTwZZo",
  authDomain: "read-with-me-354921.firebaseapp.com",
  projectId: "read-with-me-354921",
  storageBucket: "read-with-me-354921.appspot.com",
  messagingSenderId: "278789110828",
  appId: "1:278789110828:web:917962350e7aa9081a6589",
});

export const auth = app.auth();
export const storage = getStorage(app);

const db = getFirestore();
export const colRef = collection(db, "savedstories");

getDocs(colRef)
  .then((snapshot) => {
    let savedstories = [];
    savedstories.docs.forEach((doc) => {
      savedstories.push({ ...doc.data, id: doc.id });
    });
  })
  .catch((err) => {
    console.log(err);
  });

export default app;
