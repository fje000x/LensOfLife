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
     
      <h3 className={styles.color}>{username}</h3>
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