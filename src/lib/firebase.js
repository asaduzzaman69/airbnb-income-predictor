import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAkGnlVUAAc3CCstarcBNQSHmcM8U-c-9E",
    authDomain: "airbnb-prediction-f90b0.firebaseapp.com",
    projectId: "airbnb-prediction-f90b0",
    storageBucket: "airbnb-prediction-f90b0.appspot.com",
    messagingSenderId: "504397872427",
    appId: "1:504397872427:web:0c78c4e837735d10ce596e",
    measurementId: "G-KQFFNZMS95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);