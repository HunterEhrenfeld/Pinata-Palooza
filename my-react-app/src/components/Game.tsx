import { FC, useEffect, useState } from 'react';
import PersonCard from './PersonCard';
import BottomNav from './BottomNav';
import axios from 'axios';

const Game: FC = () => {
  // Hooks
  const [loading, setLoading] = useState(true);
  const [persons, setPersons] = useState([]);
  const [personCardClick, updatePersonCardClick] = useState(null);
  const [activePersons, updateActivePersons] = useState<string[]>([]);
  const [yourPerson, setYourPerson] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/persons/board');
        setPersons(response.data);
        updateActivePersons(response.data.map((i: { id: any }) => i.id));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(activePersons);
    if (activePersons.includes(personCardClick))
      updateActivePersons(activePersons.filter((i) => i !== personCardClick));
    else updateActivePersons(activePersons.concat(personCardClick));
    updatePersonCardClick(null);
  }, [personCardClick]);

  useEffect(() => {
    if (!loading && persons) {
      setYourPerson(persons[Math.floor(Math.random() * 24)]);
    }
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
            {/* <PersonCard name='sam' image='placeholder' isActive={false}/>
      <PersonCard name='sam' image='placeholder' isActive={true}/>
      <PersonCard name='sam' image='placeholder' isActive={true}/>
      <PersonCard name='sam' image='placeholder' isActive={true}/>
      <PersonCard name='sam' image='placeholder' isActive={true}/>
      <PersonCard name='sam' image='placeholder' isActive={true}/>
      <PersonCard name='sam' image='placeholder' isActive={true}/>
      <PersonCard name='sam' image='placeholder' isActive={true}/> */}
            {persons.map((person: any) => {
              return (
                <PersonCard
                  personId={person.id}
                  name={person.name}
                  cid={person.cid}
                  isActive={activePersons.includes(person.id.toString())}
                  onClick={updatePersonCardClick}
                />
              );
            })}
          </div>
          <div className='px-10 w-5'>
            Selected Person:
            <PersonCard
              personId={yourPerson.id}
              name={yourPerson.name}
              cid={yourPerson.cid}
              isActive={true}
              onClick={() => {}}
            />
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }
};

export default Game;
