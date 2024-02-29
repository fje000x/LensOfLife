import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import styles from '/src/components/FriendsList.module.css';

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchFriends = async (userId) => {
      const friendsRef = collection(db, 'users', userId, 'friends');
      const q = query(friendsRef); // Adjust this query as needed
      const querySnapshot = await getDocs(q);
      const friendsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFriends(friendsList);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchFriends(user.uid);
      } else {
        console.log('User is not signed in.');
        setFriends([]); // Clear friends list if user is not signed in
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  return (
    <div className={styles.container}>
      <h2>Friends</h2>
      <ul className={styles.friendsList}>
        {friends.map(friend => (
          <li key={friend.id} className={styles.friendItem}>
            {friend.username} 
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendList
