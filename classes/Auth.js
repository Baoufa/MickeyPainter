import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from 'https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js';

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js';
import {
  getDatabase,
  ref,
  set,
  onChildAdded,
  onChildRemoved,
  push,
  remove,
  update,
} from 'https://www.gstatic.com/firebasejs/9.6.11/firebase-database.js';

export default class Auth {
  constructor() {
    this._db = null;
    this._user = null;
    this._uid = null;
    this._userName = null;

    this.param();
    this._refMsg = null;
    this._isEntryCreated = false;
    this._refPathCreated = ref(this._db, 'canvas/created/');
    this._refPathDeleted = ref(this._db, 'canvas/deleted/');
    this._path;
  }

  get user() {
    return this._user;
  }

  get uid() {
    return this._uid;
  }

  get refPath() {
    return this._refPath;
  }

  param() {
    const firebaseConfig = {
      apiKey: 'AIzaSyDAqL7M_clRJNshY4kDzn02TGybAvj887w',
      authDomain: 'la-passerelle-1.firebaseapp.com',
      databaseURL:
        'https://la-passerelle-1-default-rtdb.europe-west1.firebasedatabase.app',
      projectId: 'la-passerelle-1',
      storageBucket: 'la-passerelle-1.appspot.com',
      messagingSenderId: '980185968696',
      appId: '1:980185968696:web:5410ccf9669e53172736cd',
    };

    const app = initializeApp(firebaseConfig);
    this._db = getDatabase(app);
  }

  auth() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    return signInWithPopup(auth, provider)
      .then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        this._user = result.user;
        this._uid = result.user.uid;
        this._userName = result.user.displayName;
        return this._userName;
      })
      .catch(error => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  sendPath(path) {
    let refPath = ref(this._db, 'canvas/created/' + path.timestamp);
    set(refPath, path);
    remove(this._refPathDeleted); // Clear deleter folder
  }

  sendUndoPath(path) {
    let refPathCreated = ref(this._db, 'canvas/created/' + path.timestamp);
    remove(refPathCreated);

    let refPathDeleted = ref(this._db, 'canvas/deleted/' + path.timestamp);
    set(refPathDeleted, path);
  }

  sendRedoPath(path) {
    let refPathCreated = ref(this._db, 'canvas/created/' + path.timestamp);
    set(refPathCreated, path);

    let refPathDeleted = ref(this._db, 'canvas/deleted/' + path.timestamp);
    remove(refPathDeleted);
  }

  initOnChildAdded(callback, callback2) {
    onChildAdded(this._refPathCreated, callback);
    onChildAdded(this._refPathDeleted, callback2);
  }

  initOnChildRemoved(callback, callback2) {
    onChildRemoved(this._refPathCreated, callback);
    onChildRemoved(this._refPathDeleted, callback2);
   }
}
