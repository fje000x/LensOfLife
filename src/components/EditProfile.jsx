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
  
  const [profilePicture, setProfilePicture] = useState("");
  const [bio, setBio] = useState("");
  const [file, setFile] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // State for triggering refresh

  useEffect(() => {
    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const userDocRef = doc(db, "users", uid);
      getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsername(data.username);
          
          setProfilePicture(data.profilePicture);
          setBio(data.bio);
          // No need to setUser as it's not used elsewhere
        }
      });
    }
  }, [auth, db, refreshKey]); // Include refreshKey in the dependencies array

  const handleProfilePictureChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSave = async () => {
    if (!auth.currentUser || !db) return;
    const uid = auth.currentUser.uid;
    const userDocRef = doc(db, "users", uid);
  
    const uploadProfilePicture = async () => {
      if (file) {
        const fileRef = firebaseRef(storage, `profilePictures/${uid}`);
        await uploadBytes(fileRef, file);
        const newProfilePictureURL = await getDownloadURL(fileRef);
        return newProfilePictureURL;
      }
      return profilePicture;
    };
  
    try {
      const newProfilePictureURL = await uploadProfilePicture();
  
      await updateDoc(userDocRef, {
        username: username,
        profilePicture: newProfilePictureURL,
        bio: bio,
      });
  
      navigate("/userhome");
  
      // Force a full refresh of the page
      window.location.reload();
    } catch (error) {
      console.error("Error updating user info or uploading new profile picture:", error);
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
