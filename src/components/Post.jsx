// Post.jsx
import React from 'react';
import styles from './Post.module.css';

const Post = ({ profilePicture, description, username, imageUrl }) => {
  return (
    <div className={styles.postbox}>
      <div className={styles.container}>
        <img src={profilePicture} alt="Profile" className={styles.profilePicture} />
        <div className={styles.user}>{username}</div>
      </div>
      <img className={styles.img} src={imageUrl} alt="Post" />

      <p className={styles.description}><span className={styles.userDesc}>{username}</span><span className={styles.check}><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 640 512"  width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4zm323-128.4l-27.8-28.1c-4.6-4.7-12.1-4.7-16.8-.1l-104.8 104-45.5-45.8c-4.6-4.7-12.1-4.7-16.8-.1l-28.1 27.9c-4.7 4.6-4.7 12.1-.1 16.8l81.7 82.3c4.6 4.7 12.1 4.7 16.8.1l141.3-140.2c4.6-4.7 4.7-12.2.1-16.8z"></path></svg></span> {description}</p>
    </div>
  );
};

export default Post;