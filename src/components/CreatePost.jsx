import React, { useState } from 'react';
import styles from '/src/components/CreatePost.module.css';

const CreatePost = () => {
    const [fileName, setFileName] = useState('');
    const [imagePreviewUrl, setImagePreviewUrl] = useState(''); // State to store the image preview URL

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result); // Set the image preview URL to the result of FileReader
            };

            reader.readAsDataURL(file); // Read the file as a Data URL
        } else {
            setFileName('');
            setImagePreviewUrl(''); // Reset the image preview URL if no file is selected
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.create}>Create a Post</h2>
            <form className={styles.form}>
                <input 
                    id="fileUpload" 
                    className={styles.uploadInput}
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    style={{display: 'none'}}
                />
                <label htmlFor="fileUpload" className={styles.upload}>
                    {fileName || 'Choose File'}
                </label>
                
                {/* Display the image preview if available */}
                {imagePreviewUrl && (
                    <img className={styles.img} src={imagePreviewUrl} alt="Preview" style={{ maxWidth: '100%', marginTop: '10px' }} />
                )}
                
                <textarea 
                    className={styles.input}
                    placeholder="Description"
                />
                <button type="submit" className={styles.btn}>
                    Post
                </button>
            </form>
        </div>
    );
};

export default CreatePost;
