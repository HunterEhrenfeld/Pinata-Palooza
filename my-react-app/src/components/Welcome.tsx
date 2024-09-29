import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const Welcome: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent scrollbars on the body
    document.body.style.overflow = 'hidden';

    // Cleanup to remove overflow hidden when the component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const styles = {
    outerContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh', // Full height of the viewport
      width: '100vw', // Full width of the viewport
      backgroundColor: '#1c1c1e', // Dark background to match the grayscale theme
      overflow: 'hidden',
    },
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      backgroundColor: '#2c2c2e', // Slightly lighter dark background for contrast
      borderRadius: '15px', // Rounded corners for the container
      boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.8)', // Uniform shadow with no light-source bias
      border: 'none', // Ensure no border is applied
      outline: 'none', // Remove any potential outline
      maxWidth: '600px', // Container won't exceed 600px width
      width: '100%', // Make sure the container can be responsive
      textAlign: 'center' as const,
    },
    title: {
      fontSize: '3rem',
      fontWeight: 'bold' as const,
      marginBottom: '1.5rem',
      color: '#f8f8f8', // Light font color to contrast the dark background
    },
    description: {
      fontSize: '1.2rem',
      marginBottom: '2rem',
      color: '#ccc', // Muted gray for text
    },
    button: {
      padding: '12px 25px',
      fontSize: '1rem',
      color: '#333',
      backgroundColor: '#f8f8f8', // Light button with dark text
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      margin: '10px',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', // Subtle shadow for buttons
      transition: 'background-color 0.3s ease, transform 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#d3d3d3', // Button changes to slightly darker gray on hover
      transform: 'translateY(-2px)', // Subtle lift effect on hover
    },
  };

  return (
    <div style={styles.outerContainer}>
      <div style={styles.container} className='font-sans'>
        <h1 style={styles.title}>Welcome to Zoom Who!</h1>
        <p style={styles.description}>
          Ready to play Guess Who? Join a lobby or start a game and challenge
          your friends!
        </p>
        <button
          style={styles.button}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = '#d3d3d3')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = '#f8f8f8')
          }
          onClick={() => alert('Welcome!')}
        >
          Get Started
        </button>
        <button
          style={styles.button}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = '#d3d3d3')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = '#f8f8f8')
          }
          onClick={() => navigate('/join')}
        >
          Join Lobby
        </button>
        <button
          style={styles.button}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = '#d3d3d3')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = '#f8f8f8')
          }
          onClick={() => navigate('/play')}
        >
          Play!
        </button>
        <ToastContainer />
        <button
          style={styles.button}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = '#d3d3d3')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = '#f8f8f8')
          }
          onClick={() => navigate('/bottom')}
        >
          Bottom Nav Test
        </button>
      </div>
    </div>
  );
};

export default Welcome;
