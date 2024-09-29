import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Game from './Game';

const JoinLobby: React.FC = () => {
  const [username, setUsername] = useState('');
  const [opponentUsername, setOpponentUsername] = useState('');
  const [lobbyId, setLobbyId] = useState('');
  const [lobby, setLobby] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [inGame, setInGame] = useState(false);
  const [error, setError] = useState('');
  const socketRef = useRef<WebSocket | null>(null);

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
      socketRef.current?.send(username);
      setIsConnected(true);
      setError('');
    };

    socketRef.current.onmessage = (event) => {
      const data = event.data;
      console.log(data);
      if (data.startsWith('lobby:')) {
        const lobbyList = data.replace('lobby:', '').split(',');

        setInGame((currentInGame) => {
          if (currentInGame && lobbyList.length < 2) {
            console.log('Less than 2 players in the lobby, exiting the game');
            toast.warn('Player left match.');
            leaveLobby();
            alert('Player left match, exiting');
            navigate('/');
            return false;
          }
          return currentInGame;
        });
        setLobby(lobbyList);
      } else if (data === 'start') {
        setInGame(true);
      } else if (data.startsWith('error:')) {
        setError(data.replace('error:', ''));
      }
    };

    socketRef.current.onclose = () => {
      console.log('closed');
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
    const filteredUserList = lobby.filter((person) => person !== username);
    if (filteredUserList.length !== 0) {
      setOpponentUsername(filteredUserList[0]);
      console.log('Opponent: ' + filteredUserList[0]);
    }
  }, [lobby]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      minWidth: '100vw',
      backgroundColor: '#1c1c1e',
      padding: '20px',
    },
    box: {
      backgroundColor: '#2c2c2e',
      padding: '20px',
      borderRadius: '15px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.8)',
      maxWidth: '100vw',
      textAlign: 'center' as const,
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold' as const,
      marginBottom: '20px',
      color: '#f8f8f8',
    },
    input: {
      width: '100%',
      padding: '12px',
      margin: '10px 0',
      fontSize: '1rem',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#3c3c3e',
      color: '#fff',
      outline: 'none',
    },
    button: {
      backgroundColor: '#d3d3d3', // Light gray button to match the theme
      color: '#333',
      padding: '12px 25px',
      fontSize: '1rem',
      fontWeight: 'bold' as const,
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      margin: '10px 0',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#bbb',
    },
    errorMessage: {
      color: 'red',
      fontStyle: 'italic',
      marginTop: '10px',
    },
    list: {
      color: '#fff',
      listStyleType: 'none' as const,
      padding: 0,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.title}>Multiplayer Lobby</h1>
        {!isConnected ? (
          <div>
            <input
              style={styles.input}
              type='text'
              placeholder='Enter your username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              style={styles.input}
              type='text'
              placeholder='Enter Lobby ID'
              value={lobbyId}
              onChange={(e) => setLobbyId(e.target.value)}
            />
            <button
              style={styles.button}
              onClick={joinLobby}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = '#bbb')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = '#d3d3d3')
              }
            >
              Join Lobby
            </button>
            {error && <p style={styles.errorMessage}>{error}</p>}
          </div>
        ) : inGame ? (
          <div>
            <Game lobbyId={lobbyId} />
            <button
              style={styles.button}
              onClick={leaveLobby}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = '#bbb')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = '#d3d3d3')
              }
            >
              Leave Game
            </button>
          </div>
        ) : (
          <div>
            <h2 style={{ color: '#f8f8f8' }}>Lobby</h2>
            <ul style={styles.list}>
              {lobby.map((player, index) => (
                <li key={index}>{player}</li>
              ))}
            </ul>
            <button
              style={styles.button}
              onClick={leaveLobby}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = '#bbb')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = '#d3d3d3')
              }
            >
              Leave Lobby
            </button>
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default JoinLobby;
