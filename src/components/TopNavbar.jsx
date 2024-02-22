
import styles from '/src/components/TopNavbar.module.css';
import React from 'react';
import {useNavigate,  } from 'react-router-dom'; // Added useLocation
import { getAuth, signOut, } from 'firebase/auth';



function TopNavbar(){
  const auth = getAuth();
  const navigate=useNavigate()
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
            <li className={styles.logoItem}>Lens Of Life</li>
            <li onClick={handleLogout} className={styles.items}>Logout</li>
          </ul>
        </nav>
    )
}

export default TopNavbar