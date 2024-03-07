import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import styles from '/src/components/pages/UserHome.module.css';
import { Link } from "react-router-dom";

const Loading = () => <div className={styles.loading}><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M8 .75c.172 0 .333.034.484.102a1.214 1.214 0 0 1 .664.664c.068.15.102.312.102.484s-.034.333-.102.484a1.214 1.214 0 0 1-.265.399 1.324 1.324 0 0 1-.399.273A1.254 1.254 0 0 1 8 3.25c-.172 0-.333-.031-.484-.094a1.324 1.324 0 0 1-.672-.672A1.254 1.254 0 0 1 6.75 2c0-.172.031-.333.094-.484.067-.151.159-.284.273-.399.115-.114.248-.203.399-.265A1.17 1.17 0 0 1 8 .75zM2.633 3.758a1.111 1.111 0 0 1 .68-1.031 1.084 1.084 0 0 1 .882 0c.136.057.253.138.352.242.104.099.185.216.242.351a1.084 1.084 0 0 1 0 .883 1.122 1.122 0 0 1-.594.594 1.169 1.169 0 0 1-.883 0 1.19 1.19 0 0 1-.359-.234 1.19 1.19 0 0 1-.234-.36 1.169 1.169 0 0 1-.086-.445zM2 7a.941.941 0 0 1 .703.297A.941.941 0 0 1 3 8a.97.97 0 0 1-.078.39 1.03 1.03 0 0 1-.531.532A.97.97 0 0 1 2 9a.97.97 0 0 1-.39-.078 1.104 1.104 0 0 1-.32-.211 1.104 1.104 0 0 1-.212-.32A.97.97 0 0 1 1 8a.97.97 0 0 1 .29-.703A.97.97 0 0 1 2 7zm.883 5.242a.887.887 0 0 1 .531-.805.863.863 0 0 1 .68 0c.11.047.203.11.281.188a.887.887 0 0 1 .188.96.887.887 0 0 1-1.148.461.913.913 0 0 1-.462-.46.863.863 0 0 1-.07-.344zM8 13.25c.208 0 .385.073.531.219A.723.723 0 0 1 8.75 14a.723.723 0 0 1-.219.531.723.723 0 0 1-.531.219.723.723 0 0 1-.531-.219A.723.723 0 0 1 7.25 14c0-.208.073-.385.219-.531A.723.723 0 0 1 8 13.25zm3.617-1.008c0-.177.06-.325.18-.445s.268-.18.445-.18.326.06.445.18c.12.12.18.268.18.445s-.06.326-.18.445a.605.605 0 0 1-.445.18.605.605 0 0 1-.445-.18.605.605 0 0 1-.18-.445zM14 7.5a.48.48 0 0 1 .352.148A.48.48 0 0 1 14.5 8a.48.48 0 0 1-.148.352A.48.48 0 0 1 14 8.5a.48.48 0 0 1-.352-.148A.48.48 0 0 1 13.5 8a.48.48 0 0 1 .148-.352A.48.48 0 0 1 14 7.5zm-1.758-5.117c.188 0 .365.036.531.11a1.413 1.413 0 0 1 .735.734c.073.166.11.343.11.53 0 .188-.037.365-.11.532a1.413 1.413 0 0 1-.735.734 1.31 1.31 0 0 1-.53.11c-.188 0-.365-.037-.532-.11a1.415 1.415 0 0 1-.734-.734 1.31 1.31 0 0 1-.11-.531c0-.188.037-.365.11-.531a1.413 1.413 0 0 1 .734-.735c.167-.073.344-.11.531-.11z"></path></svg></div>;

function UserHome() {
  const auth = getAuth();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [loading, setLoading] = useState(true);
  const db = getFirestore();
  const [posts, setPosts] = useState([]);
  const [friendsCount, setFriendsCount] = useState(0); // State to hold the count of friends
  
  const logPostId = (postId)=>{
    console.log(postId)
  }
  const fetchFriendsCount = async () => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, "users", user.uid, "friends"));
      try {
        const querySnapshot = await getDocs(q);
        setFriendsCount(querySnapshot.size); // Set the count of friends
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUsername(userData.username);
            setProfilePicture(userData.profilePicture);
            setEmail(userData.email);
            setBio(userData.bio)
            localStorage.setItem('username', userData.username);
            localStorage.setItem('email', userData.email);
            localStorage.setItem('profilePicture', userData.profilePicture);
            localStorage.setItem('bio', userData.bio);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error getting document:", error);
        }
      }
      setLoading(false);
    };

    const fetchFriendsCount = async () => {
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, "users", user.uid, "friends"));
        try {
          const querySnapshot = await getDocs(q);
          setFriendsCount(querySnapshot.size); // Set the count of friends
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      }
    };

    fetchUserData();
    fetchFriendsCount();
  }, [auth, db]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const q = query(collection(db, "posts"), where("uid", "==", user.uid), orderBy("createdAt", "desc"));
        try {
          const querySnapshot = await getDocs(q);
          const fetchedPosts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPosts(fetchedPosts);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      } else {
        console.log('User is signed out');
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
          <img className={styles.profileImg} src={profilePicture} alt="Profile" />
        </div>
        <h3 className={styles.color}>{username}</h3>
        <Link to="/edit">
          <button className={styles.editbtn}>Edit Profile</button>
        </Link>
        <p className={styles.bio}>{bio}</p>
        <div className={styles.info}>
          <Link to="/friends">
            <p>{friendsCount} Friends </p>
          </Link>
         
            <p>{posts.length} Posts </p>
          
        </div>
      </div>
      <div className={styles.imageContainer}>
      {posts.map(post => (
  <div key={post.id} className={styles.post}>
    <Link to={`/post/${post.id}`}>
      <img src={post.imageUrl} alt="Post" className={styles.postImage} />
    </Link>
  </div>
))}
      </div>
    </div>
  );
}

export default UserHome;
