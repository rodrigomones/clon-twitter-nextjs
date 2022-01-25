import * as firebase from "firebase/app";
import { getAuth, signInWithPopup, GithubAuthProvider } from "firebase/auth";
import {
  addDoc,
  collection,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA-IZWGa6mrYR5AVI9V5j0DFt4hlJmUf_o",
  authDomain: "devter-next-test.firebaseapp.com",
  projectId: "devter-next-test",
  storageBucket: "devter-next-test.appspot.com",
  messagingSenderId: "644921886374",
  appId: "1:644921886374:web:300f291ff20d92b1cf5667",
  measurementId: "G-S72M9EMS0G",
};

!firebase.getApps.lenght && firebase.initializeApp(firebaseConfig);

const db = getFirestore();

const mapUserFromFirebaseAuthToUser = (user) => {
  const { displayName, email, photoURL, uid } = user;
  console.log(user);

  return {
    avatar: photoURL,
    username: displayName,
    email,
    uid,
  };
};

const auth = getAuth();
export const onAuthStateChanged = (onChange) => {
  return auth.onAuthStateChanged((user) => {
    const normalizedUser = user ? mapUserFromFirebaseAuthToUser(user) : null;
    onChange(normalizedUser);
  });
};
export const loginWithGitHub = () => {
  const githubProvider = new GithubAuthProvider();
  return signInWithPopup(auth, githubProvider);
};

export const addDevit = ({ avatar, content, img, userId, userName }) => {
  return addDoc(collection(db, "devits"), {
    avatar,
    content,
    img,
    userId,
    userName,
    createdAt: new Date(),
    likesCount: 0,
    sharedCount: 0,
  });
};

const mapDevit = (doc) => {
  const data = doc.data();
  const id = doc.id;
  const { createdAt } = data;

  return {
    ...data,
    id,
    createdAt: createdAt.toDate(),
  };
};

export const listenLastestDevits = (callback) => {
  const devitsRef = collection(db, "devits");
  const q = query(devitsRef, orderBy("createdAt", "desc"), limit(20));

  onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(mapDevit));
  });
};

const storage = getStorage();
// export const uploadImage = (file) => {
//   const storageRef = ref(storage, `images/${file.name}`);
//   const task = uploadBytes(storageRef, file);
//   return task;
// };

export const uploadImage = (file) => {
  const sref = ref(storage, `images/${file.name}`);

  return uploadBytesResumable(sref, file);
};

export const downloadURL = (task) => {
  return getDownloadURL(task.snapshot.ref).then((downloadURL) => downloadURL);
};
