import { useEffect, useState, type ChangeEvent } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

const App = () => {
  const [username, setUsername] = useState<string>("");
  const [userData, setUserData] = useState<string[]>([]);
  const [chatUser, setChatUser] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [chat, setChat] = useState<string[]>([]);

  useEffect(() => {
    socket.on("auk", (data: string) => {
      console.log(data);
    });

    socket.on("chatUsers", (users: string[]) => {
      setUserData(users);
    });

    socket.on("chat", (chatData: { message: string; member: string }) => {
      if (chatUser === chatData.member) {
        setChat([]);
        setChatUser(chatData.member);
      }
      setChat((pre) => [...pre, chatData.message]);
    });

    return () => {
      socket.removeAllListeners();
    };
  }, []);

  return (
    <>
      <h1>Socket.IO Client</h1>
      <button onClick={() => socket.emit("pamod", "Hello from client!")}>
        Send Message
      </button>
      <div>
        <p>chat register</p>
        <div>
          <input
            type="text"
            placeholder="your username"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setUsername(e.target.value);
            }}
          />
          <button onClick={() => socket.emit("usernameRegister", username)}>
            Register
          </button>
        </div>
      </div>
      <div>
        <p>chat</p>
        <select
          value={chatUser ? chatUser : undefined}
          onChange={(e) => setChatUser(e.target.value)}
        >
          {userData?.map((user: string, index: number) => {
            return (
              <option key={index} value={user}>
                {user}
              </option>
            );
          })}
        </select>
        <div>
          {chat.map((c, index) => {
            return <p key={index}>{c}</p>;
          })}
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={() => socket.emit("message", { message, chatUser })}>
          Send
        </button>
      </div>
    </>
  );
};

export default App;
