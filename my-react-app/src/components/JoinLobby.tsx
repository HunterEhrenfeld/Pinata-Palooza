import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function JoinLobby() {
    const [username, setUsername] = useState<any>('');
  const [lobby, setLobby] = useState<any>([]);
  const [isConnected, setIsConnected] = useState<any>(false);
  const socketRef = useRef<any>(null);

  const joinLobby = () => {
    socketRef.current = new WebSocket('ws://localhost:8080/lobby');
    
    socketRef.current.onopen = () => {
      socketRef.current.send(username);
      setIsConnected(true);
    };

    socketRef.current.onmessage = (event: any) => {
      const lobbyList = event.data.split(',');
      setLobby(lobbyList);
    };

    socketRef.current.onclose = () => {
      setIsConnected(false);
    };
  };

  const leaveLobby = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <div>
      <h1>Multiplayer Lobby</h1>
      {!isConnected ? (
        <div>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={joinLobby}>Join Lobby</button>
        </div>
      ) : (
        <div>
          <h2>Lobby</h2>
          <ul>
            {lobby.map((player: any, index: any) => (
              <li key={index}>{player}</li>
            ))}
          </ul>
          <button onClick={leaveLobby}>Leave Lobby</button>
        </div>
      )}
    </div>
  );
  };
  
  export default JoinLobby;