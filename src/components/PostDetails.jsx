import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

import { getStorage, ref, deleteObject } from 'firebase/storage';

import Post from './Post'; // Assuming this is the component you want to render the post with
import styles from "./PostDetails.module.css";

const PostDetail = () => {
  const { id } = useParams(); // Extract the post ID from the URL
  const [post, setPost] = useState(null);
  const db = getFirestore();
  



  useEffect(() => {
    const fetchPost = async () => {
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
        setPost({
          ...postData,
          id: docSnap.id,
          username: userInfo.username, // Assuming the user data includes username
          profilePicture: userInfo.profilePicture, // Assuming the user data includes profilePicture
          imageUrl // Using the imageUrl directly from postData
          
        });
        
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    fetchPost();
  }, [id, db]);

  // Render the post using the Post component or display loading text
  return (
    
    <div className={styles.box}>
    {post ? (
    <Post key={post.id} postId={post.id} {...post} />
  ) : (
    <div>Loading...</div>
  )}
  </div>
  );
};


export default PostDetail;
