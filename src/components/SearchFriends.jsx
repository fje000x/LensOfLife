import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, query, collection, where, getDocs, doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import styles from "./SearchFriends.module.css"; // Adjust the path as necessary
import { Link } from "react-router-dom";

const SearchFriends = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searched, setSearched] = useState(false); // State to track if search has been performed
  const auth = getAuth();
  const db = getFirestore();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setCurrentUser(user);
      } else {
        console.log('User is not signed in.');
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const q = query(collection(db, "users"), where("username", "==", searchTerm));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.log('No matching users found.');
        setSearchResults([]);
      } else {
        const results = await Promise.all(querySnapshot.docs.map(async (doc) => {
          const userRef = doc.ref;
          const isAdded = await checkIfUserIsAdded(userRef);
          const profilePicture = await fetchProfilePicture(doc.id);
          return {
            uid: doc.id,
            ...doc.data(),
            isAdded,
            profilePicture, // Include profile picture in the result
          };
        }));
        setSearchResults(results);
      }
      setSearched(true); // Set searched to true after search is performed
    } catch (error) {
      console.error('Error searching for users:', error);
    }
  };

  const checkIfUserIsAdded = async (userRef) => {
    if (!currentUser) return false;
    const friendRef = doc(db, 'users', currentUser.uid, 'friends', userRef.id);
    const docSnap = await getDoc(friendRef);
    return docSnap.exists();
  };

  const fetchProfilePicture = async (userId) => {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.data().profilePicture || null;
  };

  const handleAddFriend = async (friendUid, friendUsername) => {
    if (!currentUser) {
      console.log('No authenticated user.');
      return;
    }
  
    try {
      await setDoc(doc(db, 'users', currentUser.uid, 'friends', friendUid), {
        uid: friendUid,
        username: friendUsername,
        addedOn: serverTimestamp(),
      });
      console.log('Friend added successfully!');
  
      const updatedResults = searchResults.map(user => 
        user.uid === friendUid ? { ...user, isAdded: true } : user
      );
      setSearchResults(updatedResults);
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };
  

  return (
    <div className={styles.container}>
      <h2 className={styles.h2}>Find Friends</h2>
      <input
        type="text"
        placeholder="Search by username..."
        value={searchTerm}
        onChange={handleChange}
        className={styles.searchInput}
      />
      <button onClick={handleSearch} className={styles.searchButton}>Search</button>
      <ul className={styles.userList}>
        {searched && searchResults.length === 0 && (
          <li className={styles.userItem}>No User Found</li>
        )}
        {searchResults.map((user) => (
          <li key={user.uid} className={styles.userItem}>
            <img src={user.profilePicture} alt={user.username} className={styles.profileImage} />
            <Link to={`/profile/${user.username}`}>
              <span className={styles.username}>{user.username}</span>
            </Link>
            {!user.isAdded ? (
              <button onClick={() => handleAddFriend(user.uid, user.username)} className={styles.addFriendButton}>
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M678.3 642.4c24.2-13 51.9-20.4 81.4-20.4h.1c3 0 4.4-3.6 2.2-5.6a371.67 371.67 0 0 0-103.7-65.8c-.4-.2-.8-.3-1.2-.5C719.2 505 759.6 431.7 759.6 349c0-137-110.8-248-247.5-248S264.7 212 264.7 349c0 82.7 40.4 156 102.6 201.1-.4.2-.8.3-1.2.5-44.7 18.9-84.8 46-119.3 80.6a373.42 373.42 0 0 0-80.4 119.5A373.6 373.6 0 0 0 137 888.8a8 8 0 0 0 8 8.2h59.9c4.3 0 7.9-3.5 8-7.8 2-77.2 32.9-149.5 87.6-204.3C357 628.2 432.2 597 512.2 597c56.7 0 111.1 15.7 158 45.1a8.1 8.1 0 0 0 8.1.3zM512.2 521c-45.8 0-88.9-17.9-121.4-50.4A171.2 171.2 0 0 1 340.5 349c0-45.9 17.9-89.1 50.3-121.6S466.3 177 512.2 177s88.9 17.9 121.4 50.4A171.2 171.2 0 0 1 683.9 349c0 45.9-17.9 89.1-50.3 121.6C601.1 503.1 558 521 512.2 521zM880 759h-84v-84c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v84h-84c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h84v84c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-84h84c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path></svg>
              </button>
            ) : (
              <span className={styles.added}><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M11 14s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002.002zM1.022 13h9.956a.274.274 0 00.014-.002l.008-.002c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664a1.05 1.05 0 00.022.004zm9.974.056v-.002.002zM6 7a2 2 0 100-4 2 2 0 000 4zm3-2a3 3 0 11-6 0 3 3 0 016 0zm6.854.146a.5.5 0 010 .708l-3 3a.5.5 0 01-.708 0l-1.5-1.5a.5.5 0 01.708-.708L12.5 7.793l2.646-2.647a.5.5 0 01.708 0z" clip-rule="evenodd"></path></svg></span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchFriends;
