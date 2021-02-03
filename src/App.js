import React, { useEffect, useState } from 'react';
import './App.css';
import List from './components/List';
import withListLoading from './components/withListLoading';
import axios from 'axios';

function App() {
  const ListLoading = withListLoading(List);
  const [appState, setAppState] = useState({
    loading: false,
    repos: null,
  });

  useEffect(() => {
    setAppState({
      loading: true 
    });
    
    const apiUrl = `https://xlxp3abvkg.execute-api.us-east-1.amazonaws.com/dev/users`;

    axios.get(apiUrl).then( (repos) => {
      const allRepos = repos.data;
      console.log(allRepos);
      setAppState( { loading: false, repos: allRepos});
    });

    // fetch(apiUrl)
    //   .then((res) => res.json())
    //   .then((repos) => {
    //     setAppState({ loading: false, repos: repos });
    //   });
  }, [setAppState]);
  
  return (
    <div className='App'>
      <div className='container'>
        <h1>Into The Unknown: React App</h1>
      </div>
      <div className='repo-container'>
        <ListLoading isLoading={appState.loading} repos={appState.repos} />
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
