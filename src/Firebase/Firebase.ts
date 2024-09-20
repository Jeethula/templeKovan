import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB2nVzB7vhTo9MiIXDBpTnO4NNWJcodJ1U",
  authDomain: "kovan-testing.firebaseapp.com",
  projectId: "kovan-testing",
  storageBucket: "kovan-testing.appspot.com",
  messagingSenderId: "1036213205810",
  appId: "1:1036213205810:web:1d7cf90073cc94f1f6b52b",
  measurementId: "G-3EYH4N9CKL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };