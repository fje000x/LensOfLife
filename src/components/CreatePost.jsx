
const CreatePost = () => {
    
   
    return (
        <div>
            <h2>Create a Post</h2>
            <form>
                <input 
                    type="file" 
                    accept="image/*" 
                />
                <textarea 
                    placeholder="Description" 
                />
                <button type="submit">
                    Post
                </button>
            </form>
        </div>
    );
};

export default CreatePost;
