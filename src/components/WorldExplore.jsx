import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, getDoc, query, orderBy, limit } from 'firebase/firestore'; // Added 'query'
import { getStorage, ref, getDownloadURL } from 'firebase/storage';


import Post from './Post'; // Import the Post component


function WorldExplore() {
    const [posts, setPosts] = useState([]);
    const db = getFirestore();
    const storage = getStorage();
    
    useEffect(() => {
      const fetchPosts = async () => {
        try {
          // Query all posts ordered by createdAt
          const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
          const querySnapshot = await getDocs(q);
          const fetchedPosts = [];
  
          // Array to store promises for fetching user details and image URLs
          const promises = [];
  
          querySnapshot.forEach(docSnapshot => {
            const postData = docSnapshot.data();
            const userId = postData.uid;
  
            // Fetch user details for each post
            const userDocRef = doc(db, 'users', userId);
            const userPromise = getDoc(userDocRef).then(userDocSnapshot => {
              if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                // Merge user data with post data
                return { ...postData, username: userData.username, profilePicture: userData.profilePicture };
              } else {
                return { ...postData };
              }
            });
            promises.push(userPromise);
  
            // Check if imageUrl exists and is not an empty string
            if (postData.imageUrl && postData.imageUrl.trim()) {
              const imageUrlPromise = getDownloadURL(ref(storage, postData.imageUrl))
                .then(imageUrl => {
                  return { imageUrl }; // Return an object with imageUrl
                })
                .catch(error => {
                  console.error(`Failed to get image URL for post ${docSnapshot.id}:`, error);
                  return { imageUrl: null }; // Handle missing or inaccessible image
                });
              promises.push(imageUrlPromise);
            } else {
              // Immediately resolve promise with null imageUrl for posts without an image
              promises.push(Promise.resolve({ imageUrl: null }));
            }
          });
  
          // Await all promises concurrently and combine user and image data with post data
          const results = await Promise.all(promises);
  
          // Process results to combine user details and image URLs with post data
          results.forEach((result, i) => {
            // Every even index is user data, and the following odd index is the image URL
            if (i % 2 === 0) { // User data with optional profilePicture and username
              const postWithUserData = result;
              const imageResult = results[i + 1];
              const postWithAllData = { ...postWithUserData, ...imageResult, id: querySnapshot.docs[i / 2].id };
  
              fetchedPosts.push(postWithAllData);
            }
          });
  
          // Set the fetched posts
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
          <Post key={post.id} postId={post.id} {...post} />
        ))}
      </div>
    );
  }

export default WorldExplore;
