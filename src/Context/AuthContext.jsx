import { getAuth , onAuthStateChanged } from "firebase/auth";
import { createContext , useState,useEffect } from "react";
export const Context= createContext()

export function AuthContext({children}){
const auth = getAuth();
const [user,setUser] = useState(null)
const [loading, setLoading] = useState(true)

useEffect(()=>{
let unsubscribe ;
unsubscribe = onAuthStateChanged(auth,(currentuser)=>{
    setLoading(false)
    if (currentuser) setUser(currentuser)
    else{
        setUser(null)
    }
}) ;
return ()=>{
    if(unsubscribe) unsubscribe();
}
},[])
const values = {
    user:user,
    setUser: setUser
}
return <Context.Provider value={values}>
{!loading && children}

</Context.Provider>
}