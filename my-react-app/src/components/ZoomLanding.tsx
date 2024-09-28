import { FC, useEffect } from 'react';
import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';

const ZoomLanding: FC = () => {
  useEffect(() => {
    const client = ZoomMtgEmbedded.createClient();
    const zoomSDKContainer = document.getElementById('zoomSDKContainer');

    if (zoomSDKContainer) {
      client.init({ zoomAppRoot: zoomSDKContainer, language: 'en-US' });
    } else {
      console.error('Zoom SDK container not found');
    }
  }, []);

  return <div id='zoomSDKContainer'></div>;
};

export default ZoomLanding;
