import React,{ useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'; 

import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'

//initialize the firebase in our code....

firebase.initializeApp({
  //I need to add configuration

  //connecting with firebase(database)

  apiKey: "AIzaSyBmv0uN2Js8QJNCLUe-Mhq-OW2u_4gJ2oY",
  authDomain: "react-chat-app-f07f0.firebaseapp.com",
  projectId: "react-chat-app-f07f0",
  databaseURL: "https://react-chat-app-f07f0.firebaseio.com",
  storageBucket: "react-chat-app-f07f0.appspot.com",
  messagingSenderId: "340618265497",
  appId: "1:340618265497:web:9b0c7fedf4e691ac594908",
  measurementId: "G-R7SM1L0GY6"

})

const auth = firebase.auth();

const firestore = firebase.firestore();

function App() {

  const[user] = useAuthState(auth);

  return (
    <div className='App'>
         
        <header>
          <h1>React chat app ⚛️🔥</h1>
          <SignOut />
        </header>

        <section>
          {user ? <ChatRoom /> : <SignIn />}
        </section>

    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () =>{

    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);

  }

   return(
    <>
     <button className='sign-in' onClick={signInWithGoogle}>Sign in with Google</button>
    </>
   )
}

function SignOut(){

  return auth.currentUser && (
      <button className='sign-out' onClick={() => auth.signOut()}>Sign out</button>
    )
  }

  function ChatRoom() {
    
    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25);
  
    const [messages] = useCollectionData(query, { idField: 'id' });
  
    const [formValue, setFormValue] = useState('');
  
  
    const sendMessage = async (e) => {
      e.preventDefault();
  
      const { uid, photoURL } = auth.currentUser;
  
      await messagesRef.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL
      })
  
      setFormValue('');
    }
  
    return (<>
      <main>
  
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
  
      </main>
  
      <form onSubmit={sendMessage}>
  
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />
  
        <button type="submit" disabled={!formValue}>Send message</button>
  
      </form>
    </>)
  }

function ChatMessage(props) {

   const { text, uid, photoURL } = props.message;

   const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

   return(
    <>
      <div className={`message ${messageClass}`}>
        
        <img src={photoURL || 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50'} alt='img not available' />
        <p>{text}</p>
      </div>
    </>
   )
}
export default App;
