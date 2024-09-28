import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function JoinLobby() {
    const [username, setUsername] = useState('');
    const [opponentUsername, setOpponentUsername] = useState('');
  const [lobbyId, setLobbyId] = useState(''); // New state for lobby ID
  const [lobby, setLobby] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [inGame, setInGame] = useState(false); // New state to track if the game has started
  const [error, setError] = useState('');
  const socketRef = useRef(null);

  const navigate = useNavigate();

  const joinLobby = () => {
    if (!lobbyId) {
      setError('Please enter a lobby ID');
      return;
    }

    if (!username) {
        setError('Please set a username');
        return;
    }

    socketRef.current = new WebSocket(`ws://localhost:8080/lobby/${lobbyId}`);
    
    socketRef.current.onopen = () => {
      socketRef.current.send(username);
      setIsConnected(true);
      setError(''); // Clear any previous errors
    };

    socketRef.current.onmessage = (event) => {
      const data = event.data;

      if (data.startsWith('lobby:')) {
        const lobbyList = data.replace('lobby:', '').split(',');
     
        setInGame((currentInGame) => {
            if (currentInGame && lobbyList.length < 2) {
              console.log("Less than 2 players in the lobby, exiting the game");
              toast.warn("Player left match.")
              leaveLobby();
              alert("Player left match, exiting");
              navigate("/")
              return false;  // Update inGame to false
            }
            return currentInGame; // Keep it unchanged if no conditions are met
          });
        setLobby(lobbyList);
      } else if (data === 'start') {
        setInGame(true);
      } else if (data.startsWith('error:')) {
        setError(data.replace('error:', ''));
      }
    };

    socketRef.current.onclose = () => {
        console.log("closed");
      setIsConnected(false);
      setInGame(false);
    };
  };

  const leaveLobby = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
  };

  useEffect(() => {
        const filteredUserList = lobby.filter(person => person !== username);
        if (filteredUserList.length != 0) {
            setOpponentUsername(filteredUserList[0]);
            console.log("Oppnent: " + filteredUserList[0])
        }
    }, [lobby])

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
          <input
            type="text"
            placeholder="Enter Lobby ID"
            value={lobbyId}
            onChange={(e) => setLobbyId(e.target.value)}
          />
          <button onClick={joinLobby}>Join Lobby</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      ) : inGame ? (
        <div>
          <h2>Game Started!</h2>
          <p>Game logic will go here...</p>
          <button onClick={leaveLobby}>Leave Game</button>
        </div>
      ) : (
        <div>
          <h2>Lobby</h2>
          <ul>
            {lobby.map((player, index) => (
              <li key={index}>{player}</li>
            ))}
          </ul>
          <button onClick={leaveLobby}>Leave Lobby</button>
        </div>
      )}
        <ToastContainer />
    </div>
  );

  };
  
  export default JoinLobby;