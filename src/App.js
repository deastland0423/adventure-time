import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import { ModalProvider } from "./contexts/ModalContext";
import { UserProvider } from "./contexts/UserContext";
import Home from './pages/Home';
import Nav from './components/Nav';
import Modal from './components/Modal';
import Login from './pages/Login';
import MyAccount from './pages/MyAccount';
import Register from './pages/Register';
import Footer from './pages/Footer';
import axios from 'axios';
axios.defaults.withCredentials = true;

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <ModalProvider>
          <UserProvider>
            <Modal/>
            <Nav />
            <main >
              <Route path="/" exact component={Home} />
              <Route path="/login" component={Login}/>
              <Route path="/register" component={Register}/>
              <Route path="/my-account" component={MyAccount}/>
            </main>
            <Footer />
          </UserProvider>
        </ModalProvider>
      </BrowserRouter>
    </div>
  );
}


export default App;
