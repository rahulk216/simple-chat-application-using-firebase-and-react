import React from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import './App.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
	apiKey: 'AIzaSyBxef-nRnGJEDXPUbJ8CkQRpzYEMPbMqhs',
	authDomain: 'socialitis-46829.firebaseapp.com',
	databaseURL: 'https://socialitis-46829.firebaseio.com',
	projectId: 'socialitis-46829',
	storageBucket: 'socialitis-46829.appspot.com',
	messagingSenderId: '27361418325',
	appId: '1:27361418325:web:15c4347a91a35d3197c8dc',
	measurementId: 'G-0BWH68YJ6K',
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
	const [user] = useAuthState(auth);
	return (
		<div>
			<Header />
			{user ? <Chatroom /> : <Signin />}
		</div>
	);
}

function Header() {
	const [user] = useAuthState(auth);
	return (
		<div className='header'>
			{user ? (
				<button className='signout' onClick={() => auth.signOut()}>
					Sign Out
				</button>
			) : (
				<div class='heading'>Whatsapp Dummy</div>
			)}
		</div>
	);
}

function Chatroom() {
	const mref = firestore.collection('messages');
	const query = mref.orderBy('createdAt');
	const [messages] = useCollectionData(query, { idField: 'id' });
	const [newMsg, setNewMsg] = React.useState('');
	const [user] = useAuthState(auth);
	const scrollDown = React.useRef();
	const sendMsg = async () => {
		if (newMsg.length > 0) {
			const mg = {
				text: newMsg,
				createdAt: firebase.firestore.FieldValue.serverTimestamp(),
				uid: user._delegate.uid,
				photoURL: user._delegate.photoURL,
			};
			setNewMsg(null);
			await mref.add(mg);
			
			scrollDown.current.scrollIntoView({ behavior: 'smooth' });
		}
	};
	return (
		<div className='chatroom'>
			<div className='textbox'>
				{messages &&
					messages.map((msg) => <Chat key={msg.id} message={msg} />)}
				<div ref={scrollDown} style={{ height: '2rem' }}></div>
			</div>
			<div className='chatbox'>
				<input
					className='userinput'
					type='text'
					placeholder='Type something'
					onChange={(e) => setNewMsg(e.target.value)}
				/>
				<button className='send' onClick={sendMsg}>
					<i className='fa fa-paper-plane' aria-hidden='true'></i>
				</button>
			</div>
		</div>
	);
}
function Chat(props) {
	const [user] = useAuthState(auth);
	const messageclass =
		props.message.uid === user._delegate.uid ? 'messageright' : 'messageleft';
	const colorchange =
		props.message.uid === user._delegate.uid ? 'colorright' : 'colorleft';
	console.log(props);
	return (
		<div class={`message ${messageclass}`}>
			<img className='userimg' src={props.message.photoURL} alt='img' />
			<p className={`usertext ${colorchange}`}>{props.message.text}</p>
		</div>
	);
}
function Signin() {
	const signInWithGoogle = () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		auth.signInWithPopup(provider);
	};
	return (
		<div className='signin'>
			<button className='btn' onClick={signInWithGoogle}>
				Sign-in
			</button>
		</div>
	);
}

export default App;
