import React, { useState, useContext } from 'react';
import classes from './signup.module.css';
import { Link,useNavigate , useLocation} from 'react-router-dom';
import image from './Image/image.png';
import { auth } from '../../../Utility/fireBase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import {PulseLoader} from 'react-spinners'

import { DataContext } from '../../DataProvider/DataProvider';
import { Type } from '../../../Utility/action.type';


function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading,setloading] = useState({signIn: false,signUp:false})
  const navigate = useNavigate()
  const navStateData = useLocation();
  console.log(navStateData)

   const { state, dispatch } = useContext(DataContext);
   const { user } = state;

  console.log(user);

  const authHandler = async (e) => {
    e.preventDefault();

    const action = e.nativeEvent.submitter.name; 
    console.log(action);

    try {
      let userInfo;

      if (action === "signIn") {
        setloading({...loading,signIn: true})
        userInfo = await signInWithEmailAndPassword(auth, email, password);
      } else {
         setloading({...loading,signUp: true})
        userInfo = await createUserWithEmailAndPassword(auth, email, password);
      }

      dispatch({
        type: Type.SET_USER,
        user: userInfo.user,
      });
      
      setloading({...loading, signIn: false})
       setloading({...loading, signUp: false})
       navigate(navStateData?.state?.redirect || "/");

    } catch (err) {
      console.error(err);
      setError(err.message);
      setloading({...loading, signIn: false})
      setloading({...loading, signUp: false})

    }
  };

  return (
    <section className={classes.logIn}>
      <Link to="/">
        <img src={image} alt="AmazonImage" />
      </Link>

      <div className={classes.login_container}>
        <h1>Sign-In</h1>
        {navStateData?.state?.msg && (
          <small style={{
            padding: "5px",
            textAlign: "center",
            color: "red",
            fontWeight: "bold",


          }}>
            {navStateData?.state?.msg}

          </small>

        )
         }

        <form onSubmit={authHandler}>
          <div>
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>

          <button
            type="submit"
            name="signIn"
            className={classes.login_signIn_btn}
          >{ loading.signIn ? <PulseLoader color='#2563EB' size={15}></PulseLoader> : "Sign In" }
            
          </button>

          <button
            type="submit"
            name="signUp"
            className={classes.login_registerBtn}
          > { loading.signUp ? <PulseLoader color='#2563EB' size={15}></PulseLoader> : "Create your Amazon Account" }
            
          </button>
          <p>This is Abaymart website registration and signUp page.You must create an account if you don not have one.then you can sign in anytime.You are signing in to the Abaymart e-commerce website.</p>
        </form>

        <p style={{paddingTop: "5px",color: "red"}} >{error}</p>
      </div>
    </section>
  );
}

export default Auth;






