import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import styles from '/Users/nandocodes/LensOfLife/LensOfLife/src/components/EditProfile.module.css'
const EditProfile = () => {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
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
          setUser(data); // Store the user data in state if needed elsewhere
        }
      });
    }
  }, [auth, db]);

  const handleProfilePictureChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSave = async () => {
    if (!auth.currentUser) return; // Ensure there's a logged-in user
    const uid = auth.currentUser.uid;
    const userDocRef = doc(db, 'users', uid);
  
    // Proceed only if a file is selected
    if (file) {
      try {
        // Create a unique file name for the storage reference, e.g., using the current timestamp
        const uniqueFileName = `profilePictures/${uid}/${Date.now()}-${file.name}`;
        const fileRef = storageRef(storage, uniqueFileName);
  
        // Upload the file
        await uploadBytes(fileRef, file);
  
        // After successful upload, get the download URL
        const newProfilePicture = await getDownloadURL(fileRef);
  
        // Update the Firestore document with the new profile picture URL
        await updateDoc(userDocRef, {
          username: username,
          email: email,
          profilePicture: newProfilePicture,
        });
  
        // Optionally update the local state to reflect the change immediately
        setProfilePicture(newProfilePicture);
  
        // Navigate to the user home page after saving
        navigate('/userhome');
      } catch (error) {
        console.error("Error updating user profile:", error);
        // Handle the error appropriately
      }
    } else {
      // If no file is selected, just update other info (optional)
      try {
        await updateDoc(userDocRef, {
          username: username,
          email: email,
          // Keep the existing profile picture if file is not changed
          profilePicture: profilePicture,
        });
        navigate('/userhome');
      } catch (error) {
        console.error("Error updating user info:", error);
        // Handle the error appropriately
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
      </div >
      <button className={styles.saveButton} onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default EditProfile;