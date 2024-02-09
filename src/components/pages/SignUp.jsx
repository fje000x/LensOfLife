import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import styles from '/Users/nandocodes/LensOfLife/LensOfLife/src/components/EditProfile.module.css';

const EditProfile = () => {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const userDocRef = doc(db, 'users', uid);
      getDoc(userDocRef).then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsername(data.username);
          setEmail(data.email);
          setProfilePicture(data.profilePicture);
          // Initially, the preview is the current profile picture from the database
          setProfilePicturePreview(data.profilePicture);
        }
      });
    }
  }, [auth, db]);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      // Create a preview of the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
  if (!auth.currentUser) return;
  const uid = auth.currentUser.uid;
  const userDocRef = doc(db, 'users', uid);

  let newProfilePicture = profilePicture;
  if (file) {
    // Corrected to include the file name in the path to make it unique for each upload
    const fileRef = storageRef(storage, `profilePictures/${uid}/${file.name}`);
    await uploadBytes(fileRef, file); // Upload the file
    newProfilePicture = await getDownloadURL(fileRef); // Get the URL of the uploaded file

    // This line is likely incorrect as getDownloadURL should be called on the reference returned by uploadBytes
    // Correct approach:
    newProfilePicture = await getDownloadURL(fileRef); // Ensure we get the URL of the newly uploaded file
    setProfilePicture(newProfilePicture); // Optionally update the state if you want to immediately reflect the change
  }

  // Proceed to update the Firestore document
  try {
    await updateDoc(userDocRef, {
      username: username,
      email: email,
      profilePicture: newProfilePicture,
    });
    navigate('/userhome'); // Redirect after saving
  } catch (error) {
    console.error("Error updating profile:", error);
    // Consider handling the error in your UI
  }
};

  return (
    <div className={styles.container}>
      <input
        className={styles.inputField}
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        className={styles.inputField}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <img src={profilePicturePreview || profilePicture} alt="Profile" className={styles.profileImage} />
      <input
        className={styles.inputField}
        type="file"
        accept="image/*"
        onChange={handleProfilePictureChange}
      />
      <button className={styles.saveButton} onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default EditProfile;
