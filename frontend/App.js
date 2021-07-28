
import * as React from 'react';
import * as Location from 'expo-location';

import Starmap from './star-env/Starmap';

import './config';

export default function App() {
  const [errorMsg, setErrorMsg] = React.useState('');
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      global.config.location = loc.coords;
    })();
  }, []);
  
  return (
    <>
      <Starmap/>
    </>
  );
}


