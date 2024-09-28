import { FC } from 'react';

interface PersonCardProps {
	name: string;
	image: any;
	isActive: Boolean;
}

const PersonCard: FC<PersonCardProps> = ({ name, image, isActive }) => {
	const x = <div>x</div>;

	return (
		<div className='w-24 h-32 bg-blue-300 rounded-md flex flex-col'>
			<div className='h-4/5 flex justify-center'>{isActive ? <img src={image}></img> : x}</div>
			<div className='h-1/5 flex justify-center bg-slate-50'>{name}</div>
		</div>
	);
};

export default PersonCard;
