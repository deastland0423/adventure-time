import React, { useEffect, useState } from 'react';
import './App.css';
import EntityBase from './components/EntityBase';
import locationDef from './components/locationDef';
import roleDef from './components/roleDef';
import userDef from './components/userDef';

function App() {

  return (
    <div className='App'>
      <h1>Into The Unknown: Online Interface</h1>
      <div>
        <h3>Registered Players</h3>
        <EntityBase entityDef={userDef} />
      </div>
      <div>
        <h3>Locations</h3>
        <EntityBase entityDef={locationDef} />
      </div>
      <div>
        <h3>Player Role Types</h3>
        <EntityBase entityDef={roleDef} />
      </div>
      <footer>
        <div className='footer'>
          Built by Daniel Eastland and Benjamin Bradley, with assistance from Shedrack Akintayo
        </div>
      </footer>
    </div>
  );
}

export default App;
