import { useState } from 'react';
import { pinata } from '../utils/pinata.config';

const Pinata = () => {
  const [cid, setCid] = useState<string>(''); // For entering the CID
  const [url, setUrl] = useState<string | null>(null); // Store the signed URL

  // Function to handle the CID input change
  const handleCidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCid(event.target.value);
  };

  // Function to handle fetching the signed URL and displaying the image
  const fetchImage = async () => {
    if (!cid) {
      alert('Please enter a valid CID!');
      return;
    }

    try {
      const signedUrl = await pinata.gateways.createSignedURL({
        cid: cid,
        expires: 50, //50 minutes
      });
      console.log('Signed URL:', signedUrl);

      setUrl(signedUrl);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  return (
    <div>
      <h1>Display Image from Pinata</h1>

      <label>Enter CID:</label>
      <input
        type='text'
        value={cid}
        onChange={handleCidChange}
        placeholder='Enter CID here'
      />

      <button onClick={fetchImage}>Fetch Image</button>

      {url && (
        <div>
          <h3>Fetched Image:</h3>
          <img
            src={url}
            alt='Fetched from Pinata'
            style={{ maxWidth: '400px', marginTop: '10px' }}
          />
        </div>
      )}
    </div>
  );
};

export default Pinata;
