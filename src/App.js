import React, { useEffect, useState } from 'react';

import * as L from 'leaflet';
import { MapContainer, TileLayer, Polyline, useMapEvents } from 'react-leaflet';
import { useLeafletContext } from '@react-leaflet/core';
import movingMarker from './MovingMarker';

import './App.css';

const paths = [[51.507222, -0.1275], [48.8567, 2.3508],[41.9, 12.5], [52.516667, 13.383333], [44.4166,26.1]];
let marker = null;

function EventComponent(props) {
  useMapEvents({
    zoomstart: () => {
      props.setIsPaused(true);
    },
    zoom:() => {
      props.setIsPaused(false);
    },
    zoomend: () => {
      // props.setIsPaused(false);
    },
  })

  return null;
}

function App() {
  const [paused, setPaused ] = useState(false);

  console.log(L.version);

  return (
    <div className="App">
      <MapContainer 
        id="map-container" 
        center={[45.19147011,5.71453741]} 
        zoom={5} 
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={paths} pathOptions={{color:'red', weight:2}}/>
        <MovingMarker 
          paused={paused}
          path={paths}
          duration={30000}
        />

        <EventComponent setIsPaused={val => setPaused(val)}/>
      </MapContainer>
    </div>
  );
}

const MovingMarker = ({ path, duration, paused }) => {
  const context = useLeafletContext();

  useEffect(() => {
    const container = context.layerContainer || context.map;

    if(paused) {
      marker.setOpacity(0);
      container.addLayer(marker);

    } else if(!paused && marker) {
      marker.setOpacity(1); 

      container.addLayer(marker);
    }
    else {
      marker = movingMarker(path, duration, {});
      marker.start();

      container.addLayer(marker);
    }
    

    return () => {
      container.removeLayer(marker);
    }
  }, [paused]);

  return null;

}

export default App;
