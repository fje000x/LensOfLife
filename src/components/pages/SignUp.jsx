import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styles from "/src/components/pages/SignUp.module.css";
import { Link } from "react-router-dom";
function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const auth = getAuth();
  const navigate = useNavigate();
  // Function to return custom error messages
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

  async function handleSignUp(event) {
    event.preventDefault();

    setError(""); // Reset error message

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setEmail("");
        setPassword("");
        navigate("/userhome");
        // Handle successful signup
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
            <p className={styles.login}>Already have an Account ? <Link className={styles.link} to={'/home'}>Login</Link></p>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <div className={styles.inputContainer}>
             
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
