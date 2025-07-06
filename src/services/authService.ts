import { createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export async function registerUser(email: string, password: string, firstName: string, lastName: string) {
  // Rejestracja użytkownika w Firebase Auth
  const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Każdy nowy użytkownik ma rolę 'user'
  const role = 'user';

  // Dodaj użytkownika do Firestore z rolą
  await setDoc(doc(db, 'users', user.uid), {
    id: user.uid,
    email,
    username: email,
    firstName,
    lastName,
    role,
    createdAt: new Date(),
  });

  return { user, role };
}

export async function loginUser(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
} 