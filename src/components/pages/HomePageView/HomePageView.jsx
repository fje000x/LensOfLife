import { useState } from 'react';
import styles from './HomePageView.module.css';

function HomePageView() {
  // Optional: useState hooks for managing form data

  return (
    <div>
      <div className={styles.container}>
        <form>
          <img src="logo.svg" alt="Logo" />
          
          <label htmlFor="username">Username</label>
          <input className={styles.input}  type="text" id="username" />
          
          <label htmlFor="password">Password</label>
          <input className={styles.input} type="password" id="password" />

          <button type="submit">Login</button>
          <p>New Here? <a href="/signup">Sign Up</a></p>
        </form>
      </div>

      <div className={styles.container2}>
        {/* Additional content if needed */}
      </div>
    </div>
  );
}

export default HomePageView;