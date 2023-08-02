import { AppBar, Toolbar, Typography, Container, Select, MenuItem, createTheme, ThemeProvider } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CryptoState } from '../CryptoContext';
import AuthModal from './Authentication/AuthModal';
import UserSidebar from './Authentication/UserSideBar';

const Header = () => {

  const navigate = useNavigate();

  const { currency, setCurrency, user } = CryptoState();  

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff", 
      },
      type: "dark",
    },
  });

  return (

    <ThemeProvider theme={darkTheme}>

      <AppBar color='transparent' position='static'>
        <Container>
          <Toolbar>
            <Typography onClick={() => navigate("/")} class="logo" variant="h3">SKRYPTO HUB</Typography>
            <Select variant='standard' style={{
              width: 100,
              height: 40,
              marginRight: 15,
              color: 'white',
            }} value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <MenuItem value={"INR"}>INR</MenuItem>
              <MenuItem value={"USD"}>USD</MenuItem>            
            </Select>

            {user? <UserSidebar/>:<AuthModal /> }
          </Toolbar>
        </Container>
      </AppBar>

    </ThemeProvider>
  )
}

export default Header