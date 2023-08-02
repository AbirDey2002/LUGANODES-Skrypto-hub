import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './Components/Header';
import Homepage from './Pages/Homepage';
import CoinPage from './Pages/CoinPage';
import Alert from './Components/Alert'

function App() {
  
  return (
    <BrowserRouter>
      <div class="classes">
        <Header/>
        <Routes>
          <Route path='/' element= <Homepage/> exact/>
          <Route path='/coins/:id' element= <CoinPage/> />
        </Routes>
        
      </div>
      <Alert />
    </BrowserRouter>
  );
}

export default App;
