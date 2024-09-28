import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome: FC = () => {
  const navigate = useNavigate();

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#f0f0f0',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold' as const,
      marginBottom: '1rem',
      color: 'black',
    },
    description: {
      fontSize: '1.2rem',
      marginBottom: '2rem',
      textAlign: 'center' as const,
      color: '#333',
    },
    button: {
      padding: '10px 20px',
      fontSize: '1rem',
      color: '#fff',
      backgroundColor: '#007BFF',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      margin: '5px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to Zoom Who!</h1>
      <p style={styles.description}>
        This is a simple welcome page to get you started. Feel free to explore
        and customize the app to suit your needs.
      </p>
      <button style={styles.button} onClick={() => alert('Welcome!')}>
        Get Started
      </button>
      <button style={styles.button} onClick={() => navigate('/zoom')}>
        Zoom Test baby!
      </button>
    </div>
  );
};

export default Welcome;
