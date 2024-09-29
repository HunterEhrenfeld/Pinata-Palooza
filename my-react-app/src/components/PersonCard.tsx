import { FC, useEffect, useState } from 'react';
import { pinata } from '../utils/pinata.config';

interface PersonCardProps {
  personId: string;
  name: string;
  cid: any;
  isActive: Boolean;
  onClick: any;
}

const PersonCard: FC<PersonCardProps> = ({
  personId,
  name,
  cid,
  isActive,
  onClick,
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

  return (
    <div
      className='w-24 h-32 bg-blue-300 rounded-md flex flex-col'
      onClick={() => onClick(personId)}
    >
      <div className='h-4/5 flex justify-center'>
        {isActive ? <img src={imageUrl || undefined} alt={name} /> : 'x'}
      </div>
      <div className='h-1/5 flex justify-center bg-slate-50'>{name}</div>
    </div>
  );
};

export default PersonCard;
