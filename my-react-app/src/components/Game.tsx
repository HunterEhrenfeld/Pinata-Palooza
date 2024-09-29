import { FC, useEffect, useState } from 'react';
import PersonCard from './PersonCard';
import axios from 'axios';
import BottomNav from './BottomNav';

const Game: FC = () => {
	// Hooks
	const [loading, setLoading] = useState(true);
	const [persons, setPersons] = useState([]);
	const [personCardClick, updatePersonCardClick] = useState(null);
	const [activePersons, updateActivePersons] = useState<string[]>([]);

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

	if (loading) {
		return <div>Loading</div>;
	} else {
		return (
			<div className='px-10 grid grid-rows-4 grid-cols-6 gap-3'>
				{persons.map((person) => {
					return (
						<PersonCard
							personId={person.id}
							name={person.name}
							image={person.imageUrl}
							isActive={activePersons.includes(person.id.toString())}
							onClick={updatePersonCardClick}
						/>
					);
				})}
				<BottomNav />
			</div>
		);
	}
};

export default Game;
