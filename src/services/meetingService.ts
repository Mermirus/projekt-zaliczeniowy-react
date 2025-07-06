import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import { Meeting } from '../models/Meeting';

const meetingsRef = collection(db, 'meetings');

export async function addMeeting(meeting: Omit<Meeting, 'id'>) {
  const docRef = await addDoc(meetingsRef, meeting);
  return docRef.id;
}

export async function getMeetings(userId: string, userEmail: string, isAdmin: boolean) {
  if (isAdmin) {
    const snapshot = await getDocs(meetingsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Meeting[];
  } else {
    // Pobierz spotkania utworzone przez użytkownika
    const createdByQ = query(meetingsRef, where('createdBy', '==', userId));
    const participantsQ = query(meetingsRef, where('participants', 'array-contains', userEmail));
    const [createdBySnap, participantsSnap] = await Promise.all([
      getDocs(createdByQ),
      getDocs(participantsQ)
    ]);
    // Połącz i usuń duplikaty
    const meetingsMap = new Map();
    createdBySnap.docs.forEach(doc => meetingsMap.set(doc.id, { id: doc.id, ...doc.data() }));
    participantsSnap.docs.forEach(doc => meetingsMap.set(doc.id, { id: doc.id, ...doc.data() }));
    return Array.from(meetingsMap.values()) as Meeting[];
  }
}

export function subscribeMeetings(userId: string, userEmail: string, isAdmin: boolean, callback: (meetings: Meeting[]) => void) {
  if (isAdmin) {
    return onSnapshot(meetingsRef, (snapshot) => {
      const meetings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Meeting[];
      callback(meetings);
    });
  } else {
    // Subskrybuj oba zapytania i łącz wyniki
    const createdByQ = query(meetingsRef, where('createdBy', '==', userId));
    const participantsQ = query(meetingsRef, where('participants', 'array-contains', userEmail));
    let meetingsMap = new Map();
    let unsub1 = onSnapshot(createdByQ, (snapshot) => {
      snapshot.docs.forEach(doc => meetingsMap.set(doc.id, { id: doc.id, ...doc.data() }));
      callback(Array.from(meetingsMap.values()) as Meeting[]);
    });
    let unsub2 = onSnapshot(participantsQ, (snapshot) => {
      snapshot.docs.forEach(doc => meetingsMap.set(doc.id, { id: doc.id, ...doc.data() }));
      callback(Array.from(meetingsMap.values()) as Meeting[]);
    });
    return () => { unsub1(); unsub2(); };
  }
}

export async function updateMeeting(id: string, data: Partial<Meeting>) {
  await updateDoc(doc(meetingsRef, id), data);
}

export async function deleteMeeting(id: string) {
  await deleteDoc(doc(meetingsRef, id));
} 