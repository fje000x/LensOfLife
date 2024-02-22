import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import styles from "./HomePageView.module.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function HomePageView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); // Declare the error state here

  const auth = getAuth();
  const navigate = useNavigate();

  // Function to return custom error messages
  const getCustomErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-credential":
        return "Incorrect Email or Password ";
      case "auth/too-many-requests":
        return "This account has been disabled.Please reset Password or try again later";
      case "auth/invalid-email":
        return "Invalid email address format.";
      
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  async function handleSignIn(event) {
    event.preventDefault();
    setError(""); // Reset error message before attempting to sign in

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setEmail("");
        setPassword("");
        navigate("/userhome"); // Navigate on successful login
      })
      .catch((error) => {
        console.log(error)
        const customMessage = getCustomErrorMessage(error.code);
        setError(customMessage); // Set custom error message
      });
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const images = ["social.webp", "explore.webp", "inspire.webp"];

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setCurrentIndex(currentIndex + 1 < images.length ? currentIndex + 1 : currentIndex),
    onSwipedRight: () => setCurrentIndex(currentIndex - 1 >= 0 ? currentIndex - 1 : currentIndex),
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.whole}>
      <div className={styles.container}>
        <form onSubmit={handleSignIn}>
          <img src="logo.webp" alt="Logo" />

          <label htmlFor="username">Email</label>
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
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {password && (
            <p
              className={styles.inputText}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"} Password
            </p>
          )}

          <button type="submit">Login</button>

          {/* Display error message */}
          {error && <p className={styles.errorMessage}>{error}</p>}

          <p onClick={() => navigate("/signup")}>
            New Here? <span className={styles.signup}>Sign Up</span>
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
        </div>
        <h3>Create Your First Post </h3>
        <div className={styles.buttons}>
          <button onClick={() => navigate("/signup")}>Sign Up</button>
          <button onClick={scrollToTop}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default HomePageView;