import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import styles from './UserProfile.module.css';
import { Link } from 'react-router-dom';
const Loading = () => <div className={styles.loading}>Loading...</div>;

const UserProfile = () => {
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userQuery = query(collection(db, 'users'), where('username', '==', username));
        const userSnapshot = await getDocs(userQuery);
        if (!userSnapshot.empty) {
          // Assuming username is unique, so there should be only one user
          const userData = userSnapshot.docs[0].data();
          const userId = userSnapshot.docs[0].id;
          const friendsQuery = query(collection(db, 'users', userId, 'friends'));
          const friendsSnapshot = await getDocs(friendsQuery);
          const friendsCount = friendsSnapshot.size;
          const postsQuery = query(collection(db, 'posts'), where('uid', '==', userId));
          const postsSnapshot = await getDocs(postsQuery);
          const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const postsCount = posts.length;
          setUserProfile({ ...userData, friendsCount, postsCount, posts });
        } else {
          console.log('User not found.');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [db, username]);

  if (loading) {
    return <Loading />;
  }

  if (!userProfile) {
    return <div className={styles.error}>User not found.</div>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.imgContainer}>
          <img className={styles.profileImg} src={userProfile.profilePicture} alt="Profile" />
        </div>
        <h3 className={styles.color}>{userProfile.username}</h3>
        <p className={styles.bio}>{userProfile.bio}</p>
        <div className={styles.info}>
            
        <Link to="/friends" className={styles.link}>
            <p>{userProfile.friendsCount || 0} Friends </p>
          </Link>
          <p>{userProfile.postsCount || 0} Posts </p>
        </div>
      </div>
      <div className={styles.imageContainer}>
        {userProfile.postsCount > 0 ? (
          userProfile.posts.map(post => (
            <div key={post.id} className={styles.post}>
              <img src={post.imageUrl} alt="Post" className={styles.postImage} />
            </div>
          ))
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
