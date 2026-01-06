import React, {useEffect, useContext } from 'react'
import './App.css'
import RouterFile from './RouterFile'
import { DataContext } from './Components/DataProvider/DataProvider'
import {Type} from '../src/Utility/action.type'
import {auth} from './Utility/fireBase' 
export default function App() {
  
  const { user, dispatch } = useContext(DataContext);

  useEffect(()=>{
       auth.onAuthStateChanged((authUser)=>{

        if(authUser){
          // console.log(authUser)
          dispatch({
            type: Type.SET_USER,
            user: authUser
          })
         } else{
           dispatch({
            type: Type.SET_USER,
            user: null
          })
         }
       })
  },[])
 
  
  
  return  <RouterFile/>
    
  
}
