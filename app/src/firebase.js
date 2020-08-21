import firebase from 'firebase'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBY1oANbfsP9rxqiWzIaYEqVR94klCHlD0',
  authDomain: 'football-ccc28.firebaseapp.com',
  databaseURL: 'https://football-ccc28.firebaseio.com',
  projectId: 'football-ccc28',
  storageBucket: 'football-ccc28.appspot.com',
  messagingSenderId: '179036589712',
  appId: '1:179036589712:web:63ecc2cd4b2e6db5855215',
}

firebase.initializeApp(firebaseConfig)

export default firebase