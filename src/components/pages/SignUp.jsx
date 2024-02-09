import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styles from "/src/components/pages/SignUp.module.css";
import { Link } from "react-router-dom";
import { database } from "../../main";
import { doc, setDoc } from "firebase/firestore"; // Correctly import setDoc

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  
  const auth = getAuth();
  const navigate = useNavigate();
  
  const getCustomErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "This email is already in use.";
      case "auth/invalid-email":
        return "Invalid email address.";
      case "auth/weak-password":
        return "Password is too weak.";
      default:
        return "An unexpected error occurred.";
    }
  };

  function getRandomPicture() {
    const imgs = ['profile1.svg', 'profile2.svg', 'profile3.svg'];
    const randomIndex = Math.floor(Math.random() * imgs.length); // Generate a random index
    return imgs[randomIndex]; // Return the randomly selected image filename
  }

  async function handleSignUp(event) {
    event.preventDefault();
    setError(""); // Reset error message
    const profilePicture = getRandomPicture();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userData = {
          email: email,
          username: username,
          profilePicture: profilePicture, // Assign the randomly selected profile picture
        };

        // Correct reference to Firestore document
        const userDocRef = doc(database, 'users', user.uid);
        
        // Correctly use setDoc to add the document
        setDoc(userDocRef, userData)
          .then(() => {
            console.log('User data added to Firestore with UID as document ID');
            setEmail("");
            setPassword("");
            setUsername(""); // Reset username after successful sign-up
            navigate("/userhome"); // Navigate to userhome
          })
          .catch((error) => {
            console.error('Error adding user data to Firestore:', error);
            setError('Failed to add user data to Firestore.'); // Provide a generic error message
          });
      })
      .catch((error) => {
        const customMessage = getCustomErrorMessage(error.code);
        setError(customMessage); // Set custom error message
      });
  }

  return (
    
      <div className={styles.signupContainer}>
        <form onSubmit={handleSignUp} className={styles.signupForm}>
          <h2 className={styles.signupHeader}>Sign Up</h2>
          <p className={styles.login}>Already have an Account ? <Link to={'/home'}>Login</Link></p>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <div className={styles.inputContainer}>
            <input
              className={styles.inputField}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Username"
            />
            <input
              className={styles.inputField}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
            />
            <input
              className={styles.inputField}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
            />
          </div>
          <button className={styles.submitButton} type="submit">Sign Up</button>
        </form>
        <footer className={styles.footer}>
          <p className={styles.footerText}>Join the community and show us your world.</p>
        </footer>
      </div>
  );
}

export default Signup;