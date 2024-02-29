import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import styles from '/src/components/Navbar.module.css';

const Navbar = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();
  const [profilePicture, setProfilePicture] = useState('');
  const [loading, setLoading] = useState(true);
  const db = getFirestore();
  useEffect(() => {
      
      const cachedProfile = localStorage.getItem('profilePicture');
      
      if (cachedProfile) {
     
        setProfilePicture(cachedProfile);
      }
  
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const uid = user.uid;
          const userDocRef = doc(db, 'users', uid);
  
          try {
            const docSnap = await getDoc(userDocRef);
  
            if (docSnap.exists()) {
              const fetchedData = docSnap.data();
              
              setProfilePicture(fetchedData.profilePicture);
            
          
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
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Navigate to home page or login page after logout
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <ul className={styles.ul}>
       
          <li>
            <Link to="/explore">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12,2C6.486,2,2,6.486,2,12s4.486,10,10,10s10-4.486,10-10S17.514,2,12,2z M4,12c0-0.899,0.156-1.762,0.431-2.569L6,11l2,2 v2l2,2l1,1v1.931C7.061,19.436,4,16.072,4,12z M18.33,16.873C17.677,16.347,16.687,16,16,16v-1c0-1.104-0.896-2-2-2h-4v-2v-1 c1.104,0,2-0.896,2-2V7h1c1.104,0,2-0.896,2-2V4.589C17.928,5.778,20,8.65,20,12C20,13.835,19.373,15.522,18.33,16.873z"></path>
              </svg>
              
            </Link>
          </li>
       
          <li>
            <Link to="/Search">
              
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 14v8H4a8 8 0 0 1 8-8zm0-1c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm9.446 7.032l1.504 1.504-1.414 1.414-1.504-1.504a4 4 0 1 1 1.414-1.414zM18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path></g></svg>
            </Link>
          </li>
       
        <li>
          <Link to="/create">
           
    
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16 8A8 8 0 110 8a8 8 0 0116 0zM8.5 4a.5.5 0 00-1 0v3.5H4a.5.5 0 000 1h3.5V12a.5.5 0 001 0V8.5H12a.5.5 0 000-1H8.5V4z" clipRule="evenodd"></path></svg>
          </Link>
        </li>

        <li>
          <Link to="/userhome">
          {profilePicture ? <img className={styles.profile} src={profilePicture} alt="Profile" /> : <p>No Profile Pic</p>}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;