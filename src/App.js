import React, { useEffect, useState } from 'react';
import './App.css';
import Roles from './components/Roles';
import Users from './components/Users';
import UserForm from './components/UserForm';
import Locations from './components/Locations';

function App() {

  return (
    <div className='App'>
      <h1>Into The Unknown: Online Interface</h1>
      <div>
        <h3>Add new user</h3>
        <UserForm />
      </div>
      <div>
        <h3>Registered Players</h3>
        <Users />
      </div>
      <div>
        <h3>Locations</h3>
        <Locations />
      </div>
      <div>
        <h3>Player Role Types</h3>
        <Roles />
      </div>
      <footer>
        <div className='footer'>
          Built by Daniel Eastland, with assistance from Shedrack Akintayo
        </div>
      </footer>
    </div>
  );
}

export default App;
