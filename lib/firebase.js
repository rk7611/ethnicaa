import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBzd2dak1P1L6MpEtTVwuGZJMVn3tdJnVA",
  authDomain: "ethnicaa-fdf43.firebaseapp.com",
  projectId: "ethnicaa-fdf43",
  storageBucket: "ethnicaa-fdf43.firebasestorage.app",
  messagingSenderId: "661118662982",
  appId: "1:661118662982:web:c24ca44be0b13023b80d47"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const storage = getStorage(app);
