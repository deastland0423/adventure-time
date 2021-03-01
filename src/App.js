import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import { UserProvider } from "./contexts/UserContext";
import Home from './pages/Home';
import Nav from './components/Nav';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './pages/Footer';


function App() {

    return (
      <div className="app">
        <BrowserRouter>
          <UserProvider>
            <Nav />
            <main >
              <Route path="/" exact component={Home} />
              <Route path="/login" component={Login}/>
              <Route path="/register" component={Register}/>
            </main>
            <Footer />
          </UserProvider>
        </BrowserRouter>
      </div>
  );
}


export default App;
