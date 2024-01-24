import { Button } from 'bootstrap';
import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import styles from './HomePageView.module.css';

function HomePageView() {
  // State to track the current image index in the gallery
  const [currentIndex, setCurrentIndex] = useState(0);

  // Array of images for the gallery (replace with your actual image URLs)
  const images = ['social.svg', 'explore.svg', 'inspire.svg'];
  
  // Swipe handlers for the image gallery
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setCurrentIndex(currentIndex + 1 < images.length ? currentIndex + 1 : currentIndex),
    onSwipedRight: () => setCurrentIndex(currentIndex - 1 >= 0 ? currentIndex - 1 : currentIndex),
  });

  return (
    <div className={styles.whole}>
      <div className={styles.container}>
        <form>
          <img src="logo.svg" alt="Logo" />

          <label htmlFor="username">Username</label>
          <input className={styles.input} type="text" id="username" />

          <label htmlFor="password">Password</label>
          <input className={styles.input} type="password" id="password" />

          <button type="submit">Login</button>
          <p>
            New Here? <a href="/signup">Sign Up</a>
          </p>
        </form>
      </div>

      <div className={styles.container2}>
        <h1>Share <span className={styles.bold}>Your</span> World</h1>
        
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
      className={`${styles.dot} ${currentIndex === index ? styles.activeDot : ''}`}
    ></span>
  ))}
</div>
    
      <h3>Create Your First Post </h3>
      <div className={styles.buttons}>
        
        <button>SIGN UP</button>
        <button>LOGIN</button>
      </div>

      </div>


      </div>
    </div>
  );
}

export default HomePageView;