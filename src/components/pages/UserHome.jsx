import styles from  '/src/components/pages/UserHome.module.css'
import { signOut , getAuth } from 'firebase/auth'
function UserHome(){
    const auth = getAuth()
    async function handleSignOut(){
        try{
            await signOut(auth);
            
        }
        catch(error){
            console.log(error)
        }
    }
    return (
        <div className={styles.hello}>
<h1 className={styles.color} >HEllo You Are Home </h1>
<button  onClick={handleSignOut}>SIGNOUT</button>
</div>




    )
}

export default UserHome 