import { FC } from 'react';

interface PersonCardProps {
  personId: string;
	name: string;
	image: any;
  isActive: Boolean;
	onClick: any;
}

const PersonCard: FC<PersonCardProps> = ({ personId, name, image, isActive, onClick }) => {
	const x = <div>x</div>;

	return (
		<div className='w-24 h-32 bg-blue-300 rounded-md flex flex-col' onClick={() => onClick(personId)}>
			<div className='h-4/5 flex justify-center'>{isActive ? <img src={image}></img> : x}</div>
			<div className='h-1/5 flex justify-center bg-slate-50'>{name}</div>
		</div>
	);
};

export default PersonCard;
