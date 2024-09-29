import { FC, useEffect, useState, useRef } from 'react';
import PersonCard from './PersonCard';
import BottomNav from './BottomNav';
import AnswerQuestionModal from './AnswerQuestionModal';

const Game: FC<any> = ({ lobbyId }) => {
  // Hooks
  const [loading, setLoading] = useState(true);
  const [persons, setPersons] = useState([]);
  const [personCardClick, updatePersonCardClick] = useState(null);
  const [activePersons, updateActivePersons] = useState<string[]>([]);
  const [yourPerson, setYourPerson] = useState({});
  const [yourTurn, setYourTurn] = useState(null);
  const [waitingForAnswer, setWaitingForAnswer] = useState(false);
  const [answeringQuestion, setAnsweringQuestion] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const socketRef = useRef(null);

  useEffect(() => {
    // Setup WebSocket connection
    socketRef.current = new WebSocket(`ws://localhost:8080/game/${lobbyId}`);

    socketRef.current.onopen = (event) => {
      console.log(event.data);
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);

      if (data.messageType === 'init') {
        // Initial game setup
        setPersons(data.personList);
        setYourPerson(data.yourPerson);
        setYourTurn(data.yourTurn);
        setLoading(!data.isReady);
        updateActivePersons(
          data.personList.map((i: { id: any }) => i.cid.toString())
        );
      } else if (data.messageType === 'question') {
        // Handle received question
        setQuestion(data.question);
        if (data.yourTurn) {
          setAnsweringQuestion(true);
          setWaitingForAnswer(false);
        } else {
          setWaitingForAnswer(true);
        }
      } else if (data.messageType === 'answer') {
        setAnswer(data.answer)
        setWaitingForAnswer(false);
        setYourTurn(data.yourTurn);
      }
    };

    return () => {
      socketRef.current?.close();
    };
  }, [lobbyId]);

  useEffect(() => {
    if (activePersons.includes(personCardClick)) {
      updateActivePersons(activePersons.filter((i) => i !== personCardClick));
    } else {
      updateActivePersons(activePersons.concat(personCardClick));
    }
    updatePersonCardClick(null);
  }, [personCardClick]);

  // Logging loading and yourPerson for debugging
  useEffect(() => {
    console.log(loading);
  }, [loading]);

  useEffect(() => {
    console.log(yourPerson);
  }, [yourPerson]);

  const askQuestion = (question) => {
    if (question && yourTurn) {
      const message = {
        messageType: 'question',
        question: question,
        lobbyId: lobbyId,
      };
      socketRef.current.send(JSON.stringify(message));
    }
  };

  const submitGuess = (guessPersonId) => {
    if (yourTurn) {
      const message = {
        messageType: 'guess',
        guessId: guessPersonId,
        lobbyId: lobbyId,
      };
      socketRef.current.send(JSON.stringify(message));
    }
  };

  const answerQuestion = (answer) => {
    setAnsweringQuestion(false);
    const message = {
      messageType: 'answer',
      question: question,
      lobbyId: lobbyId,
      answer: answer,
    };
    socketRef.current.send(JSON.stringify(message));
  };

  if (loading) {
    return <div>Loading</div>;
  } else {
    return (
      <div>
        <div className='flex'>
          <div className='px-10 grid grid-rows-4 grid-cols-6 gap-3'>
            {persons.map((person: any) => (
              <PersonCard
                personId={person.cid}
                name={person.name}
                cid={person.cid}
                isActive={activePersons.includes(person.cid.toString())}
                onClick={updatePersonCardClick}
                isSelected={false}
              />
            ))}
          </div>
          <div className='w-40'>
            Selected Person:
            <PersonCard
              personId={yourPerson.cid}
              name={yourPerson.name}
              cid={yourPerson.cid}
              isActive={true}
              onClick={() => {}}
              isSelected={true}
            />
            <div className='py-10'>
              {yourTurn ? `🟢 Your turn!` : `🔴 Opponent's turn`}
            </div>
          </div>
          {yourTurn ? <>'Your turn'</> : <>'Opponent's turn'</>}
        </div>

        {/* Show waiting message or BottomNav */}
        {waitingForAnswer ? (
          <div>Waiting for answer...</div>
        ) : (
          <BottomNav
            askQuestion={askQuestion}
            submitGuess={submitGuess} // Pass submitGuess to BottomNav
            persons={persons} // Pass the list of persons to BottomNav for guessing
          />
        )}

        <AnswerQuestionModal
          question={question}
          isOpen={answeringQuestion}
          onAnswer={answerQuestion}
        />
      </div>
    );
  }
};

export default Game;
