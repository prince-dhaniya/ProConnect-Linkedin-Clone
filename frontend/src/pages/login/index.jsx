import UserLayout from '@/layout/UserLayout';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import styles from "@/styles/Login.module.css";
import { loginUser, registerUser } from '@/config/redux/action/authAction';
import { emptyMessage } from '@/config/redux/reducer/authReducer';

function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  // true = Sign In mode, false = Sign Up mode
  const [userLoginMethod, setuserLoginMethod] = useState(false);

  const [email, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn, router]);

  useEffect(() => {
    // If registration was successful, switch to Sign In mode automatically
    if (authState.isSuccess && !userLoginMethod && authState.message.includes("Registered")) {
      // eslint-disable-next-line
      setuserLoginMethod(true);
      setPassword('');
    }
  }, [authState.isSuccess, authState.message]);

  const handleRegister = (e) => {
    if (e) e.preventDefault();
    if (!username || !password || !email || !name) {
      alert("Please fill in all fields to sign up.");
      return;
    }
    dispatch(registerUser({ username, password, email, name }));
  };

  const handleSignin = (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  const toggleAuthMode = () => {
    dispatch(emptyMessage());
    setuserLoginMethod(!userLoginMethod);
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className={styles.cardleft_heading}>{userLoginMethod ? "Sign In" : "Sign Up"}</p>

            {authState.message && (
              <p
                style={{
                  color: authState.isError ? "#d93025" : authState.isSuccess ? "#188038" : "#0a66c2",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  marginBottom: "1rem",
                  textAlign: "center"
                }}
              >
                {typeof authState.message === "string" ? authState.message : JSON.stringify(authState.message)}
              </p>
            )}

            <form onSubmit={userLoginMethod ? handleSignin : handleRegister} className={styles.inputContainer}>
              {!userLoginMethod && (
                <div className={styles.inputRow}>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="Username"
                    required
                  />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="Full Name"
                    required
                  />
                </div>
              )}
              <input
                value={email}
                onChange={(e) => setEmailAddress(e.target.value)}
                className={styles.inputField}
                type="email"
                placeholder="Email"
                required
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                type="password"
                placeholder="Password"
                required
              />

              <button
                type="submit"
                disabled={authState.isLoading}
                className={styles.buttonWithOutline}
                style={{ opacity: authState.isLoading ? 0.7 : 1, width: "100%", background: "none" }}
              >
                <p>{authState.isLoading ? "Processing..." : userLoginMethod ? "Sign In" : "Sign Up"}</p>
              </button>

              <p
                onClick={toggleAuthMode}
                style={{ cursor: "pointer", textAlign: "center", color: "#0a66c2", marginTop: "0.5rem" }}
              >
                {userLoginMethod ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </p>
            </form>
          </div>
          <div className={styles.cardContainer_right}></div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;