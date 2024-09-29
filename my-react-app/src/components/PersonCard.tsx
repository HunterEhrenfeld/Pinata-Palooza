import { FC, useEffect, useState } from 'react';
import { pinata } from '../utils/pinata.config';

interface PersonCardProps {
  personId: string;
  name: string;
  cid: any;
  isActive: Boolean;
  onClick: any;
  isSelected: Boolean;
}

const PersonCard: FC<PersonCardProps> = ({
  personId,
  name,
  cid,
  isActive,
  onClick,
  isSelected
}) => {
  const [imageUrl, setImageUrl] = useState('');
  // Function to handle fetching the signed URL and setting the imageUrl
  const fetchImage = async () => {
    if (!cid) {
      console.error('Invalid CID!');
      return;
    }

    try {
      const signedUrl = await pinata.gateways.createSignedURL({
        cid: cid,
        expires: 50, // 50 minutes
      });
      setImageUrl(signedUrl);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  // Use `useEffect` to fetch the image when the component mounts or CID changes
  useEffect(() => {
    if (cid && !imageUrl) {
      fetchImage();
    }
  }, [cid]);
  const x = <div className='text-7xl z-10 mt-5 ml-7 absolute'>❌</div>;

  return (
    <div
      className={`${isSelected ? 'w-40 h-44' : 'w-32 h-36'} bg-slate-900 rounded-md flex flex-col overflow-hidden`}
      onClick={() => onClick(personId)}
    >
      <div className={`h-3/4 flex justify-center ${!isActive && 'grayscale'}`}>
        <img src={imageUrl} alt={name} className='object-cover'/>
      </div>
      {!isActive && x}
      <div className='h-1/4 text-sm flex justify-center bg-slate-50'>{name}</div>
    </div>
  );
};

export default PersonCard;
