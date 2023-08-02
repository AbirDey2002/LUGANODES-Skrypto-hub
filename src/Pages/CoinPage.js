import React from 'react'
import { useParams } from 'react-router-dom'
import { CryptoState } from '../CryptoContext';
import { SingleCoin } from '../config/api';
import CoinInfo from '../Components/CoinInfo';
import { useState, useEffect } from 'react';
import axios from 'axios'
import { Button, LinearProgress, Typography } from '@mui/material';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export function numberWithCommas(x){
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();

  const { currency, symbol, user, watchlist, setAlert } = CryptoState();

  const fetchCoin = async () => {
    const {data} = await axios.get(SingleCoin(id));

    setCoin(data);
  };

  const inWatchlist = watchlist.includes(coin?.id);
  
  const removeFromWatchlist = async () => {
    const coinRef = doc(db, "watchlist", user.uid);

    try{
      await setDoc(coinRef, {
        coins: watchlist.filter((watch) => watch !== coin?.id),
      },
      {merge: "true"}
      );

      setAlert({
        open: true,
        message: `${coin.name} removed from subscriptions !`,
        type: "success",
      });

    }catch(error){
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    
    }
  }
  
  const addToWatchlist = async () => {
    const coinRef = doc(db,"watchlist",user.uid);
    
    console.log(user.id);

    try{
      await setDoc(coinRef,
        {coins:watchlist?[...watchlist,coin.id]:[coin?.id]}
      );

      setAlert({
        open: true,
        message: `${coin.name} Added to subscriptions !`,
        type: "success",
      });

    }catch(error){
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  }

  useEffect(() => {
    fetchCoin();
  }, []);
  
  if (!coin) return <LinearProgress style = {{backgroundColor:"#5217e2"}} />;
  
  return (
    <div class="container">
    <div class="glassSharp" style={{marginleft: 10}}>  
    <div class="sidebar">
        
        <img 
          src = {coin?.image.large}
          alt={coin?.name}
          height="200"
          style={{marginBottom: 20, marginTop: 20}} 
        />

        <Typography variant="h1" class="heading">
          {coin?.name}
        </Typography>

        <Typography variant="subtitle1" className="description">
          {coin?.description.en.split(". ")[0] + ". " + coin?.description.en.split(". ")[0]}
        </Typography>


        <div class="marketData">
          <span style={{display: "flex"}} >
            <Typography variant="h3" class="heading">
              Rank: 
            </Typography>
            &nbsp; &nbsp;
            <Typography class="heading2" variant='h3' style={{fontFamily:"Montserrat"}}>
              {coin?.market_cap_rank}
            </Typography>
          </span>

          <span style={{display: "flex"}} >
            <Typography variant="h3" class="heading">
              Current Price: 
            </Typography>
            &nbsp; &nbsp;
            <Typography class="heading2" variant='h3' style={{fontFamily:"Montserrat"}}>
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.current_price[currency.toLowerCase()]
              )}
            </Typography>
          </span>

          <span style={{display: "flex"}} >
            <Typography variant="h3" class="heading">
              Market Cap:{" "} 
            </Typography>
            &nbsp; &nbsp;
            <Typography class="heading2" variant='h3' style={{fontFamily:"Montserrat"}}>
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.market_cap[currency.toLowerCase()]
                .toString()
                .slice(0, -1)
              )}{" "}
              M
            </Typography>
          </span>

          {user && (
            <Button
              variant='outlined'
              sx={{width:"25",height:40,backgroundColor:"#dee55b",marginTop:5}}
              onClick={inWatchlist ? removeFromWatchlist : addToWatchlist}
            >
              {inWatchlist? "Remove":"Subscribe"}
            </Button>
          )}
        </div>
      </div>
      </div>
    
      <CoinInfo coin={coin} />
    </div>
  )
}

export default CoinPage