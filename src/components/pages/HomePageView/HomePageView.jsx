import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import styles from "./HomePageView.module.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function HomePageView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Added state to toggle password visibility
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

  async function handleSignIn(event) {
    event.preventDefault();
    setError(""); // Reset error message

    signInWithEmailAndPassword(auth, email, password)
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

  // State to track the current image index in the gallery
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = ["social.svg", "explore.svg", "inspire.svg"];

  // Swipe handlers for the image gallery
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () =>
      setCurrentIndex(
        currentIndex + 1 < images.length ? currentIndex + 1 : currentIndex
      ),
    onSwipedRight: () =>
      setCurrentIndex(currentIndex - 1 >= 0 ? currentIndex - 1 : currentIndex),
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className={styles.whole}>
      <div className={styles.container}>
        <form onSubmit={handleSignIn}>
          <img src="logo.svg" alt="Logo" />

          <label htmlFor="username">Username</label>
          <input
            className={styles.input}
            type="text"
            id="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            className={styles.input}
            type={showPassword ? "text" : "password"} // Changes based on showPassword state
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {
          password && ( // Render the toggle button only if there is input in the password field
    <p className={styles.inputText} onClick={() => setShowPassword(!showPassword)}>
      {showPassword ? "Hide" : "Show"} Password
    </p>
  )}

          <button type="submit">Login</button>

          <p onClick={() => navigate("/signup")}>
            New Here? <span className={styles.signup}> Sign Up</span>
          </p>
        </form>
      </div>

      <div className={styles.container2}>
        <h1>
          Share <span className={styles.bold}>Your</span> World
        </h1>

        <div {...swipeHandlers} className={styles.galleryContainer}>
          {images.length > 0 && (
            <img
              src={images[currentIndex]}
              alt={`Gallery Image ${currentIndex + 1}`}
              className={styles.galleryImage}
            />
          )}

          <div className={styles.dotsContainer}>
            {images.map((image, index) => (
              <span
                key={index}
                className={`${styles.dot} ${
                  currentIndex === index ? styles.activeDot : ""
                }`}
              ></span>
            ))}
          </div>

          <h3>Create Your First Post </h3>
          <div className={styles.buttons}>
            <button  onClick={() => navigate("/signup")}>SIGN UP</button>
            <button onClick={scrollToTop}>LOGIN</button>
          </div>
        </div>
      </div> 
    </div>
  );
}

export default HomePageView;