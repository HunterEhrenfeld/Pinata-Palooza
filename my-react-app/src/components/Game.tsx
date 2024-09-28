import { FC } from 'react';
import PersonCard from './PersonCard';

const Game: FC = () => {

  return(
    <div className='px-10 grid grid-rows-4 grid-cols-6 gap-3'>
      <PersonCard name='sam' image='placeholder' isActive={true}/>
      <PersonCard name='sam' image='placeholder' isActive={true}/>
      <PersonCard name='sam' image='placeholder' isActive={true}/>
      <PersonCard name='sam' image='placeholder' isActive={true}/>
      <PersonCard name='sam' image='placeholder' isActive={true}/>
      <PersonCard name='sam' image='placeholder' isActive={true}/>
      <PersonCard name='sam' image='placeholder' isActive={true}/>
      <PersonCard name='sam' image='placeholder' isActive={true}/>
    </div>
  )
}

export default Game;
