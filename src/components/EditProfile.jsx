import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import {
  getStorage,
  ref as firebaseRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import styles from "/Users/nandocodes/LensOfLife/LensOfLife/src/components/EditProfile.module.css";

const EditProfile = () => {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [bio, setBio] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const userDocRef = doc(db, "users", uid);
      getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsername(data.username);
          setEmail(data.email);
          setProfilePicture(data.profilePicture);
          setBio(data.bio);
          // No need to setUser as it's not used elsewhere
        }
      });
    }
  }, [auth, db]);

  const handleProfilePictureChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;
    const userDocRef = doc(db, "users", uid);

    try {
      await updateDoc(userDocRef, {
        username: username,
        email: email,
        profilePicture: profilePicture,
        bio: bio, // Include bio field in update
      });
      navigate("/userhome");
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };

  return (
    <div className={styles.container}>
      <img src={profilePicture} alt="Profile" className={styles.profileImage} />
      <div className={styles.inputWrappers}>
        <p>Change Picture</p>
        <input
          className={styles.inputField}
          type="file"
          onChange={handleProfilePictureChange}
        />
      </div>
      <div className={styles.inputWrappers}>
        <p>Edit Email</p>
        <input
          className={styles.inputField}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
      </div>
      <div className={styles.inputWrappers}>
        <p>Edit Username</p>
        <input
          className={styles.inputField}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
      </div>
      <div className={styles.inputWrappers}>
        <p>Edit Bio</p>
        <textarea
          className={styles.inputField}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio"
        />
      </div>
      <button className={styles.saveButton} onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
};

export default EditProfile;
