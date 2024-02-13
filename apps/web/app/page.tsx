"use client"
import React, { useEffect, useState } from "react";
import "./page.module.css";
import { useRouter } from "next/navigation";

const LoginGlassmorphism: React.FC = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [loggedIn, setLoggedIn] = useState("");

  const logInSubmit = async (e: any) => {
    e.preventDefault();
    const data = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_name: userName,
        password: password
      })
    });
    const response = await data.json();
    console.log(response);
    if (response.status === 200) {
      console.log("success");
      setUserId(response.data.id);
      setLoggedIn("true");
      router.push("/chat"); 
    }
  };

  useEffect(() => {
    localStorage.setItem("userId", userId);
    localStorage.setItem("userName", userName);
    localStorage.setItem("loggedIn", loggedIn);
  }, [userId, userName]);

  return (
    <div>
      {loggedIn==="true" ? (
        <></>
      ) : (
        <>
          <div>
            <section>
              <div className="color"></div>
              <div className="color"></div>
              <div className="color"></div>
              <div className="box">
                <div className="square" style={{ "--i": 0 }}></div>
                <div className="square" style={{ "--i": 1 }}></div>
                <div className="square" style={{ "--i": 2 }}></div>
                <div className="square" style={{ "--i": 3 }}></div>
                <div className="square" style={{ "--i": 4 }}></div>
                <div className="container">
                  <div className="form">
                    <h2>Login</h2>
                    <form onSubmit={logInSubmit}>
                      <div className="inputBox">
                        <input
                          type="text"
                          placeholder="username"
                          onChange={(e) => {
                            setUserName(e.target.value);
                          }}
                        />
                      </div>
                      <div className="inputBox">
                        <input
                          type="text"
                          placeholder="password"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <div className="inputBox">
                        <input type="submit" value="Log In" />
                      </div>
                      <p className="forget">
                        Don't have an account ?{" "}
                        <a href="/register">Sign up</a>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default LoginGlassmorphism;
