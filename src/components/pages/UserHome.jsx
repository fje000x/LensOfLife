import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

import styles from '/src/components/pages/UserHome.module.css';
import {Link} from "react-router-dom"
const Loading = () => <div>Loading...</div>;

function UserHome() {
  const auth = getAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  useEffect(() => {
    const cachedUsername = localStorage.getItem('username');
    const cachedProfile = localStorage.getItem('profilePicture');
    const cachedEmail = localStorage.getItem('email');
    if (cachedUsername && cachedProfile && cachedEmail) {
      setUsername(cachedUsername);
      setProfilePicture(cachedProfile);
      setEmail(cachedEmail);
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const userDocRef = doc(db, 'users', uid);

        try {
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const fetchedData = docSnap.data();
            setUsername(fetchedData.username);
            setProfilePicture(fetchedData.profilePicture);
            setEmail(fetchedData.email);
            localStorage.setItem('username', fetchedData.username);
            localStorage.setItem('email', fetchedData.email);
            localStorage.setItem('profilePicture', fetchedData.profilePicture);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error getting document:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('User is signed out');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.wrapper}>
    <div className={styles.container}>
     <div className={styles.imgContainer}>
      <img className= {styles.profileImg} src={profilePicture} alt="Profile" />
      </div>
     
      <h3 className={styles.color}><svg className={styles.icons} stroke="currentColor" fill="currentColor" stroke-width="0" version="1.2" baseProfile="tiny" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 6c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3m0-2c-2.764 0-5 2.238-5 5s2.236 5 5 5 5-2.238 5-5-2.236-5-5-5zM12 17c2.021 0 3.301.771 3.783 1.445-.683.26-1.969.555-3.783.555-1.984 0-3.206-.305-3.818-.542.459-.715 1.777-1.458 3.818-1.458m0-2c-3.75 0-6 2-6 4 0 1 2.25 2 6 2 3.518 0 6-1 6-2 0-2-2.354-4-6-4z"></path></svg> {username}</h3>
      <Link to="/edit">
      <button className={styles.editbtn}>Edit Profile</button>
    </Link>
    <div className={styles.info}>
     <p>Friends</p>
     <p>Posts</p>
    </div>
    </div>
    <div classname={styles.imageContainer}>

    </div>
    </div>
  );
}

export default UserHome;