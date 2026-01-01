import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "./DataProvider/DataProvider";

const ProtectedRoute = ({ children, msg, redirect }) => {
  const navigate = useNavigate();

  
  const { state } = useContext(DataContext);
  const { user } = state;

  useEffect(() => {
    if (!user) {
      navigate("/auth", {
        replace: true,
        state: { msg, redirect },
      });
    }
  }, [user, navigate, msg, redirect]);

  if (!user) return null;

  return children;
};

export default ProtectedRoute;









// import React,{useContext ,useEffect} from 'react'
// import { Navigate, useNavigate } from 'react-router-dom'
// import { DataContext } from './DataProvider/DataProvider';
// const ProtectedRoute = ({children, msg, redirect}) => {
//     const navigate = useNavigate();
//     const [{user},dispatch] = useContext(DataContext);

//     useEffect(()=>{

//         if(!user){
//             navigate("/auth",{state: {msg,redirect}})
//         }
//     },[user])
    
//   return children;
// }

// export default ProtectedRoute