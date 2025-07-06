const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, setDoc, doc } = require('firebase/firestore');

// Konfiguracja Firebase (skopiowana z firebaseConfig.ts)
const firebaseConfig = {
  apiKey: "AIzaSyBrHUGZrWwtrfIOMwxyi9AzaYVcKDSaGV0",
  authDomain: "projekt-zaliczeniowy-rea-ebd2d.firebaseapp.com",
  projectId: "projekt-zaliczeniowy-rea-ebd2d",
  storageBucket: "projekt-zaliczeniowy-rea-ebd2d.appspot.com",
  messagingSenderId: "645394904322",
  appId: "1:645394904322:web:7efa40607f6279515abe1b",
  measurementId: "G-MHWY61XDD7"
};

// Inicjalizacja Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdminAccount() {
  try {
    const email = 'admin@admin.com';
    const password = 'admin123';
    const firstName = 'Admin';
    const lastName = 'User';

    console.log('Tworzenie konta admina...');
    
    // Utworzenie użytkownika w Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('Użytkownik utworzony w Firebase Auth:', user.uid);

    // Dodanie danych użytkownika do Firestore
    await setDoc(doc(db, 'users', user.uid), {
      id: user.uid,
      email,
      username: email,
      firstName,
      lastName,
      role: 'admin',
      createdAt: new Date(),
    });

    console.log('✅ Konto admina zostało utworzone pomyślnie!');
    console.log('Email: admin@admin.com');
    console.log('Hasło: admin123');
    console.log('Rola: admin');
    
    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('❌ Konto admina już istnieje!');
      console.log('Email: admin@admin.com');
      console.log('Hasło: admin123');
    } else {
      console.error('❌ Błąd podczas tworzenia konta admina:', error.message);
    }
    process.exit(1);
  }
}

createAdminAccount(); 