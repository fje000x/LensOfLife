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

    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.exists() ? userDoc.data() : {};

    // Delete the old profile picture if it exists
    if (userData.profilePictureRef) {
      const oldFileRef = firebaseRef(storage, userData.profilePictureRef);
      await deleteObject(oldFileRef).catch((error) => {
        console.error("Error deleting old profile picture:", error);
      });
    }

    if (file) {
      try {
        const uniqueFileName = `profilePictures/${uid}/${Date.now()}-${
          file.name
        }`;
        const fileRef = firebaseRef(storage, uniqueFileName);

        await uploadBytes(fileRef, file);
        const newProfilePictureUrl = await getDownloadURL(fileRef);
        const newProfilePictureRefPath = fileRef.fullPath;

        await updateDoc(userDocRef, {
          username: username,
          email: email,
          profilePicture: newProfilePictureUrl,
          profilePictureRef: newProfilePictureRefPath,
        });

        setProfilePicture(newProfilePictureUrl);
        navigate("/userhome");
      } catch (error) {
        console.error("Error updating user profile:", error);
      }
    } else {
      try {
        await updateDoc(userDocRef, {
          username: username,
          email: email,
          profilePicture: userData.profilePicture
            ? userData.profilePicture
            : null,
          profilePictureRef: userData.profilePictureRef
            ? userData.profilePictureRef
            : null,
        });
        navigate("/userhome");
      } catch (error) {
        console.error("Error updating user info:", error);
      }
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
      <button className={styles.saveButton} onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
};

export default EditProfile;
