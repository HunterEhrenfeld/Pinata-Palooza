import { FC, CSSProperties } from 'react';

interface AnswerQuestionModalProps {
  question: string;
  isOpen: boolean;
  onAnswer: (answer: string) => void; // A callback function to pass back the answer
}

const AnswerQuestionModal: FC<AnswerQuestionModalProps> = ({
  question,
  isOpen,
  onAnswer,
}) => {
  if (!isOpen) {
    return null; // Don't render anything if the modal is not open
  }

  const modalStyle: CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#333',
    color: '#f8f8f8',
    borderRadius: '10px',
    padding: '20px',
    width: '400px',
    textAlign: 'center',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
    zIndex: 1000, // Ensure it overlays other content
  };

  const overlayStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darkened background
    zIndex: 999, // Below modal but above the rest of the content
  };

  const buttonContainerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  };

  const buttonStyle: CSSProperties = {
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderRadius: '5px',
    border: 'none',
    width: '40%',
  };

  const yesButtonStyle: CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#a6e0ab', // Soft green for "Yes"
    color: '#333',
  };

  const noButtonStyle: CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#e0a6a6', // Soft red for "No"
    color: '#333',
  };

  return (
    <>
      <div style={overlayStyle} />
      <div style={modalStyle}>
        <h3>Question from Opponent:</h3>
        <p>{question}</p>
        <div style={buttonContainerStyle}>
          <button
            style={noButtonStyle}
            onClick={() => onAnswer('No')} // Pass "No" as the answer
          >
            No
          </button>
          <button
            style={yesButtonStyle}
            onClick={() => onAnswer('Yes')} // Pass "Yes" as the answer
          >
            Yes
          </button>
        </div>
      </div>
    </>
  );
};

export default AnswerQuestionModal;
