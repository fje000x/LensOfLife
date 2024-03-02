import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFirestore, collection, addDoc, query, orderBy, getDocs, serverTimestamp, doc, getDoc, deleteDoc } from "firebase/firestore";
import styles from "./Post.module.css";
import { getAuth } from "firebase/auth";

const Post = ({ profilePicture, description, username, imageUrl, postId }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const db = getFirestore();
  const currentUser = getAuth().currentUser;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        try {
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, [currentUser, db]);

  const fetchComments = async () => {
    if (!showComments || !postId) return;

    console.log("Fetching comments for postId:", postId);
    const commentsRef = collection(db, "posts", postId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "desc"));

    try {
      const snapshot = await getDocs(q);
      const fetchedComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [showComments, postId, db]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "" || !userProfile) {
      console.log("Cannot add an empty comment or user profile is not loaded.");
      return; // Prevent empty comments or submission without user profile
    }

    try {
      const commentsRef = collection(db, "posts", postId, "comments");
      await addDoc(commentsRef, {
        text: newComment,
        author: userProfile.username, // Use the username from Firestore user profile
        profilePicture: userProfile.profilePicture, // Use the profile picture from Firestore user profile
        createdAt: serverTimestamp(),
        uid: currentUser.uid, // Store the UID of the user who made the comment
      });
      setNewComment("");

      // Refetch comments to include the new one
      await fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const commentRef = doc(db, "posts", postId, "comments", commentId);
      await deleteDoc(commentRef);
      // After deletion, refetch comments to update the UI
      await fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className={styles.postbox}>
      <div className={styles.container}>
        <img src={profilePicture} alt="Profile" className={styles.profilePicture} />
        <Link to={`/profile/${username}`}>
          <div className={styles.user}>{username}</div>
        </Link>
      </div>
      <img className={styles.img} src={imageUrl} alt="Post" />
      <div className={styles.commentContainer}>
        <p className={styles.description}>
          <span className={styles.userDesc}>{username}</span> {description}
        </p>

        <div onClick={() => setShowComments(!showComments)} className={styles.commentIcon}>
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M144 208c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm112 0c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm112 0c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zM256 32C114.6 32 0 125.1 0 240c0 47.6 19.9 91.2 52.9 126.3C38 405.7 7 439.1 6.5 439.5c-6.6 7-8.4 17.2-4.6 26S14.4 480 24 480c61.5 0 110-25.7 139.1-46.3C192 442.8 223.2 448 256 448c141.4 0 256-93.1 256-208S397.4 32 256 32zm0 368c-26.7 0-53.1-4.1-78.4-12.1l-22.7-7.2-19.5 13.8c-14.3 10.1-33.9 21.4-57.5 29 7.3-12.1 14.4-25.7 19.9-40.2l10.6-28.1-20.6-21.8C69.7 314.1 48 282.2 48 240c0-88.2 93.3-160 208-160s208 71.8 208 160-93.3 160-208 160z"></path></svg>
        </div>
      </div>

      {showComments && (
        <>
          <div className={styles.commentsSection}>
            {comments.length > 0 ? (
              comments.map(comment => (
                <div key={comment.id} className={styles.comment}>
                
                  <img src={comment.profilePicture} alt="Profile" className={styles.commentProfilePicture} />
                  <span className={styles.commentAuthor}>{comment.author}:</span>
                  <span className={styles.commentText}>{comment.text}</span>
                  
                  {currentUser && comment.uid === currentUser.uid && (
                    <button onClick={() => handleDeleteComment(comment.id)}><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z"></path><path fill-rule="evenodd" d="M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" clip-rule="evenodd"></path></svg></button>
                  )}
                </div>
              ))
            ) : (
              <div>No comments yet</div>
            )}
          </div>
          <form onSubmit={handleCommentSubmit} className={styles.addCommentForm}>
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit">Post</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Post;
