import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../Context/AuthContext";

export function Protected({children}){
const {user} = useContext(Context)
console.log(user)
if( !user){
    return <Navigate to="/home" replace/>
}
else{
    return children ;
}
}