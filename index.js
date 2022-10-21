// Import stylesheets
import './style.css';
// Firebase App (the core Firebase SDK) is always required
import { initializeApp, firebase } from 'firebase/app';

// Add the Firebase products and methods that you want to use
import {
  getAuth,
  EmailAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

import {
  getFirestore,
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';

import * as firebaseui from 'firebaseui';

// Document elements
const startRsvpButton = document.getElementById('startRsvp');
const guestbookContainer = document.getElementById('guestbook-container');

const form = document.getElementById('leave-message');
const title = document.getElementById('title');
const body = document.getElementById('body');
const postSection = document.getElementById('postSection');

const buSignIn = document.getElementById('buSignIn');
const buSignOut = document.getElementById('buSignOut');
const buPost = document.getElementById('buPost');
const buManageAccount = document.getElementById('buManageAccount');
const buSubmit = document.getElementById('buSubmit');

let rsvpListener = null;
let guestbookListener = null;

let db, auth;

async function main() {
  // Add Firebase project configuration object here
  const firebaseConfig = {
    apiKey: 'AIzaSyD1M3cwjvRdl-JpC4RoR8JStjKOOi7kdkE',
    authDomain: 'pluto22-gkw.firebaseapp.com',
    databaseURL: 'https://pluto22-gkw-default-rtdb.firebaseio.com',
    projectId: 'pluto22-gkw',
    storageBucket: 'pluto22-gkw.appspot.com',
    messagingSenderId: '84704125590',
    appId: '1:84704125590:web:0eafedfc271c4c86db98b7',
  };

  initializeApp(firebaseConfig);

  auth = getAuth();
  db = getFirestore();

  // FirebaseUI config
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      // Email / Password Provider.
      EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        // Handle sign-in.
        // Return false to avoid redirect.
        return false;
      },
    },
  };

  const ui = new firebaseui.auth.AuthUI(auth);

  // Event Listener for Buttons

  buSignIn.addEventListener('click', () => {
    if (auth.currentUser) {
      // User is signed in; allows user to sign out
      signOut(auth);
    } else {
      // No user is signed in; allows user to sign in
      ui.start('#firebaseui-auth-container', uiConfig);
    }
  });

  buSignOut.addEventListener('click', () => {
    if (auth.currentUser) {
      // User is signed in; allows user to sign out
      signOut(auth);
    } else {
      // No user is signed in; allows user to sign in
      ui.start('#firebaseui-auth-container', uiConfig);
    }
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('onAuthStateChanged: User present');
      buSignOut.style.display = 'block';
      buSignIn.style.display = 'none';
      buManageAccount.style.display = 'block';
    } else {
      console.log('onAuthStateChanged: No user present');
      buSignOut.style.display = 'none';
      buSignIn.style.display = 'block';
      buManageAccount.style.display = 'none';
    }
  });

  // Listen to the form submission
  form.addEventListener('submit', async (e) => {
    // Prevent the default form redirect
    e.preventDefault();
    // Write a new message to the database collection "guestbook"
    console.log('Writing to db');
    addDoc(collection(db, 'posts'), {
      author: auth.currentUser.email,
      title: title.value,
      body: body.value,
      createdAt: new Date(), //firebase.firestore.FieldValue.serverTimestamp(),
      source: 'Web',
      uid: auth.currentUser.uid,
    })
      .then(() => {
        console.log('Successfzlly written.');
      })
      .catch((error) => {
        console.log('Adding doc failed: ', error);
      });

    return false;
  });

  // Create query for messages
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
  onSnapshot(q, (snaps) => {
    // Reset page
    postSection.innerHTML = '';
    // Loop through documents in database
    snaps.forEach((doc) => {
      const entry = document.createElement('div');
      entry.className = 'entry';

      const line1 = document.createElement('div');
      line1.textContent = doc.data().title;
      line1.className = 'title';
      entry.appendChild(line1);

      const line2 = document.createElement('div');
      line2.textContent = doc.data().body;
      line2.className = 'body';
      entry.appendChild(line2);

      postSection.appendChild(entry);
    });
  });
}

main();
title.value = 'Hans';
body.value = 'Lore Ipsum se...';
