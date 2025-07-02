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

export async function getMeetings(userId: string, isAdmin: boolean) {
  const q = isAdmin ? meetingsRef : query(meetingsRef, where('createdBy', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Meeting[];
}

export function subscribeMeetings(userId: string, isAdmin: boolean, callback: (meetings: Meeting[]) => void) {
  const q = isAdmin ? meetingsRef : query(meetingsRef, where('createdBy', '==', userId));
  return onSnapshot(q, (snapshot) => {
    const meetings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Meeting[];
    callback(meetings);
  });
}

export async function updateMeeting(id: string, data: Partial<Meeting>) {
  await updateDoc(doc(meetingsRef, id), data);
}

export async function deleteMeeting(id: string) {
  await deleteDoc(doc(meetingsRef, id));
} 