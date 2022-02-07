import { Box, Button, Container, IconButton, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { Provider } from 'react-redux';
import MenuIcon from '@mui/icons-material/Menu';
import './App.css';
import { store } from './app/store';
import { Customers } from './features/customers/Customers';
import AppBar from './components/AppBar/AppBar';


function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <AppBar />
        <Container>
          <Customers></Customers>
        </Container>
      </div>
    </Provider>
    
  );
}

export default App;
