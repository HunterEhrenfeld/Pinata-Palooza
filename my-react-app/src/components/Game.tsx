import { FC, useEffect, useState } from 'react';
import PersonCard from './PersonCard';
import axios from 'axios';
import BottomNav from './BottomNav';

const Game: FC = () => {

  const [loading, setLoading] = useState(true);
  const [persons, setPersons] = useState([]);
  const [yourPerson, setYourPerson] = useState({});

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/persons/board');
            setPersons(response.data);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
}, []);

useEffect(() => {
  if (!loading && persons) {
    setYourPerson(persons[Math.floor(Math.random() * 24)])
  }
}, [loading])

useEffect(() => {
  console.log(yourPerson)
}, [yourPerson])

if (loading) {
  return <div>Loading</div>
} else {
  return(
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
      {persons.map(person => {
        return <PersonCard name={person.name} image={person.imageUrl} isActive={true} />
      })}
      </div>
      <div className='px-10 w-5'>
        Selected Person:
        <PersonCard name={yourPerson.name} image={yourPerson.imageUrl} isActive={true} />
      </div>
      </div>
      <BottomNav />
    </div>
  )
}
}

export default Game;
