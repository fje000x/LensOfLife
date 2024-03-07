import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Post from './Post'; // Assuming this is the component you want to render the post with
import styles from "./PostDetails.module.css";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const db = getFirestore();
  const navigate = useNavigate();

  // This function will be called when the background is clicked
  const clickedBackground = (e) => {
    navigate('/userhome');
  };

  // Stop propagation for clicks within the post content
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const fetchPost = async () => {
      // First, try to retrieve cached post details
      const cachedPost = localStorage.getItem(`post_${id}`);
      if (cachedPost) {
        setPost(JSON.parse(cachedPost));
        return;
      }

      try {
        const postRef = doc(db, 'posts', id);
        const docSnap = await getDoc(postRef);

        if (!docSnap.exists()) {
          console.log('No such document!');
          return;
        }

        const postData = docSnap.data();
        const userId = postData.uid;

        // Fetch user details
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        let userInfo = {};
        if (userSnap.exists()) {
          userInfo = userSnap.data();
        }

        // Assuming postData includes an 'imageUrl' field that directly points to the image in Firebase Storage
        const imageUrl = postData.imageUrl || null;

        // Combine post data with user info
        const combinedPost = {
          ...postData,
          id: docSnap.id,
          username: userInfo.username,
          profilePicture: userInfo.profilePicture,
          imageUrl
        };

        // Cache the combined post details
        localStorage.setItem(`post_${id}`, JSON.stringify(combinedPost));

        setPost(combinedPost);
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    fetchPost();
  }, [id, db]);

  return (
    <div className={styles.box} onClick={clickedBackground}>
      <div className={styles.innerBox} onClick={stopPropagation}>
        {post ? (
          <Post key={post.id} postId={post.id} {...post} />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
