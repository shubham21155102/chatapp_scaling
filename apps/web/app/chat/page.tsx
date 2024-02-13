"use client"
import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketProvider';
const Chat = () => {
  const { sendMessage,messages } = useSocket();
  const [userQuestion, setUserQuestion] = useState('');
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const x = localStorage.getItem('userId');
    const y=localStorage.getItem('userName'); 
    if (x) {
      setUserId(x);
    }
    if (y) {
      setUserName(y);
    }
  }, []);
  
  return (
    <>
    {userId?<> <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, width: '100%', height: '100vh', display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: '100%', backgroundColor: 'white' }}>
          <div style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0', display: 'flex', flexDirection: 'column' }}>
            <div id="qa-outer-container" style={{ flex: 1, overflowY: 'scroll', marginBottom: '10px' }}>
              {
                messages?.map((message, index) => (
                  <div key={index} style={{ padding: '10px', backgroundColor: '#f0f0f0', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '5px', backgroundColor: 'white', borderRadius: '4px',color:"black" }}>
                     {userName}: {message}
                    </div>
                  </div>
                ))
              }
            </div>
            <form onSubmit={((e:any)=>{
              e.preventDefault();
              sendMessage(userQuestion);
              setUserQuestion('');
              console.log("submitQuestion",userQuestion);
            })} style={{ borderTop: '1px solid #ccc', padding: '10px', display: 'flex', alignItems: 'center', position: 'sticky', bottom: 0, backgroundColor: 'white' }}>
              <input
                type="text"
                placeholder="Send message"
                style={{ flex: 1, padding: '5px' }}
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                className=' text-black'
              />
              <button type="submit" style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
              
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
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
          </div>
        </div>
      </section>
    </div> </>:
    <div>
     
    </div>
    }
     
    </>
  );
};

export default Chat;