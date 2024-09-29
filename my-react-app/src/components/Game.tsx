import { FC, useEffect, useState, useRef } from 'react';
import PersonCard from './PersonCard';
import BottomNav from './BottomNav';
import axios from 'axios';

const Game: FC<any> = ({lobbyId}) => {
  // Hooks
  const [loading, setLoading] = useState(true);
  const [persons, setPersons] = useState([]);
  const [personCardClick, updatePersonCardClick] = useState(null);
  const [activePersons, updateActivePersons] = useState<string[]>([]);
  const [yourPerson, setYourPerson] = useState({});
  const [yourTurn, setYourTurn] = useState(null)

  const socketRef = useRef(null);

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const response = await axios.get('http://localhost:8080/persons/board');
    //     setPersons(response.data);
    //     updateActivePersons(response.data.map((i: { id: any }) => i.id));
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchData();
    console.log(lobbyId)
    socketRef.current = new WebSocket(`ws://localhost:8080/game/${lobbyId}`);

    socketRef.current.onopen = (event) => {
      console.log(event.data);
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Initial game setp
      console.log(data)
      if (data.messageType === 'init') {
        console.log("here");
        setPersons(data.personList);
        setYourPerson(data.yourPerson);
        setYourTurn(data.yourTurn);
        setLoading(!data.isReady);
        updateActivePersons(data.personList.map((i: { id: any }) => i.cid.toString()));
      }
      
    }
  }, []);

	useEffect(() => {
		if (activePersons.includes(personCardClick))
			updateActivePersons(activePersons.filter((i) => i !== personCardClick));
		else updateActivePersons(activePersons.concat(personCardClick));
    updatePersonCardClick(null);
    console.log(activePersons)
  }, [personCardClick]);

  useEffect(() => {
    console.log(loading)
  }, [loading]);

  useEffect(() => {
    console.log(yourPerson);
  }, [yourPerson]);

  if (loading) {
    return <div>Loading</div>;
  } else {
    return (
      <div>
        <div className='flex'>
          <div className='px-10 grid grid-rows-4 grid-cols-6 gap-3'>
            {persons.map((person: any) => {
              return (
                <PersonCard
                  personId={person.cid.toString()}
                  name={person.name}
                  cid={person.cid}
                  isActive={activePersons.includes(person.cid.toString())}
                  onClick={updatePersonCardClick}
                  isSelected={false}
                />
              );
            })}
          </div>
          <div className='px-10 w-5'>
            Selected Person:
            <PersonCard
              personId={yourPerson.cid}
              name={yourPerson.name}
              cid={yourPerson.cid}
              isActive={true}
              onClick={() => {}}
              isSelected={true}
            />
          </div>
            {yourTurn ? <>'Your turn'</> : <>'Opponent's turn</>}
        </div>
        <BottomNav />
      </div>
    );
  }
};

export default Game;
