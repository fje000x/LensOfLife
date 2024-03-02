import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import styles from '/src/components/FriendsList.module.css'; // Adjust the path as needed

const UserFriends = () => {
  const [friends, setFriends] = useState([]);
  const [friendsCount, setFriendsCount] = useState(0);
  const { username } = useParams(); // Assuming you're navigating to /profile/:username/friends
  const db = getFirestore();

  useEffect(() => {
    const fetchUserAndFriends = async () => {
      // Fetch the user ID based on the username
      const usersRef = collection(db, 'users');
      const userQuery = query(usersRef, where('username', '==', username));
      const userSnapshot = await getDocs(userQuery);
      if (!userSnapshot.empty) {
        const userId = userSnapshot.docs[0].id;

        // Fetch friends for the retrieved user ID
        const friendsRef = collection(db, 'users', userId, 'friends');
        const friendsQuery = query(friendsRef);
        const friendsSnapshot = await getDocs(friendsQuery);
        const fetchedFriends = friendsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setFriends(fetchedFriends);
        setFriendsCount(friendsSnapshot.docs.length); // Set the friends count
      } else {
        console.log('No user found with the username:', username);
        setFriends([]);
        setFriendsCount(0); // Reset count if no user is found
      }
    };

    if (username) {
      fetchUserAndFriends();
    }
  }, [username, db]);

  return (
    <div className={styles.container}>
      <h2>Friends ({friendsCount})</h2>
      <ul className={styles.friendsList}>
        {friends.map(friend => (
          <li key={friend.id} className={styles.friendItem}>
            {friend.username} {/* Adjust to match your data structure */}
          </li>
        ))}
        {friends.length === 0 && <li>No friends found.</li>}
      </ul>
    </div>
  );
};

export default UserFriends;
