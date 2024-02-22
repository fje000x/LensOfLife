import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import Post from './Post'; // Import the Post component

function ExplorePage() {
  const [posts, setPosts] = useState([]);
  const db = getFirestore();
  const storage = getStorage();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, 'posts');
        const querySnapshot = await getDocs(postsRef);
        const fetchedPosts = [];

        // Array to store promises for fetching user details and image URLs
        const promises = [];

        for (const docSnapshot of querySnapshot.docs) {
          const postData = docSnapshot.data();
          const userId = postData.uid;

          // Fetch user details for each post (without awaiting)
          const userDocRef = doc(db, 'users', userId);
          const userPromise = getDoc(userDocRef);
          promises.push(userPromise);

          // Fetch image URL from Firebase Storage (without awaiting)
          const imageUrlPromise = getDownloadURL(ref(storage, postData.imageUrl));
          promises.push(imageUrlPromise);
        }

        // Await all promises concurrently
        const results = await Promise.all(promises);

        // Process results in pairs (user detail, image URL)
        for (let i = 0; i < results.length; i += 2) {
          const userDocSnapshot = results[i];
          const imageUrl = results[i + 1];

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();

            const postData = querySnapshot.docs[i / 2].data();
            const postWithUserAndImage = {
              id: querySnapshot.docs[i / 2].id,
              ...postData,
              username: userData.username,
              profilePicture: userData.profilePicture,
              imageUrl: imageUrl,
              description: postData.description // Pass the description here
            };

            fetchedPosts.push(postWithUserAndImage);
          }
        }

        // Sort fetchedPosts by createdAt field in descending order
        fetchedPosts.sort((a, b) => b.createdAt - a.createdAt);

        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, [db, storage]);

  return (
    <div>
      {posts.map(post => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  );
}

export default ExplorePage;
