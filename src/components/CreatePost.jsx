import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage, ref as firebaseRef, uploadBytes, getDownloadURL } from "firebase/storage";
import styles from "/src/components/CreatePost.module.css";
import { useNavigate } from "react-router-dom";
import { usePosts } from '/src/Context/PostsContext.jsx'; // Import usePosts hook

const CreatePost = () => {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track submission status
  const navigate = useNavigate();
  const { addPost } = usePosts(); // Use the addPost function from the context

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFile(null);
      setImagePreviewUrl("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("A post must have an image");
      return;
    }

    setIsSubmitting(true); // Set submitting state to true

    const uid = auth.currentUser.uid;
    const timestamp = Date.now();
    const fileName = `posts/${uid}/${timestamp}-${file.name}`;
    const fileRef = firebaseRef(storage, fileName);

    try {
      await uploadBytes(fileRef, file);
      const imageUrl = await getDownloadURL(fileRef);

      const newPost = {
        uid,
        description,
        imageUrl,
        createdAt: timestamp,
      };

      // Create a new document in Firestore for the post
      const postRef = doc(db, "posts", `${uid}_${timestamp}`);
      await setDoc(postRef, newPost);

      // Here we use the addPost function to update our global posts state
      addPost(newPost);

      alert("Post created!");
      setDescription("");
      setImagePreviewUrl("");
      setFile(null);
      navigate("/userhome"); // Navigate to user home after post creation
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Error creating post. Please try again.");
    } finally {
      setIsSubmitting(false); // Reset submitting state after submission
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.create}>Create a Post</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          id="fileUpload"
          className={styles.uploadInput}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
        <label htmlFor="fileUpload" className={styles.upload}>
          {file ? file.name : "Choose File"}
        </label>
        {imagePreviewUrl && (
          <img src={imagePreviewUrl} alt="Preview" className={styles.img} />
        )}
        <textarea
          className={styles.input}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit" className={styles.btn} disabled={isSubmitting}>
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
