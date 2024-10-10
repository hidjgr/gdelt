import React, {useRef} from 'react';
import Globe from 'react-globe.gl';
import './App.css'
import earthTexture from './assets/gdelt/8081_earthmap4k.jpg'
import earthBump from './assets/gdelt/8081_earthbump4k.jpg'
import skyTexture from './assets/gdelt/stars.jpg';

function App() {

  const globeEl = useRef<any>(null);

  const World = () => {
    return <div style={{ width: '100vw', height: '100vh' }}>
      <Globe
        ref={globeEl}
        globeImageUrl={earthTexture}
        bumpImageUrl={earthBump}
        backgroundImageUrl={skyTexture}
	/>
    </div>
  };

  return World()
}

export default App
