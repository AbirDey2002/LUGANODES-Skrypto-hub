import React from 'react'
import { CoinList } from '../config/api';
import { useState } from 'react';
import axios from 'axios';
import { CryptoState } from '../CryptoContext';
import { useEffect } from 'react';
import { Container, createTheme, ThemeProvider, Typography, TextField, TableContainer, LinearProgress, TableHead, Table, TableRow, TableCell, TableBody, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function numberWithCommas(x){
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const CoinsTable = () => {

  const navigate = useNavigate();
  
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState([]);
  const [page, setPage] = useState(1);

  const { currency, symbol } = CryptoState();

  const fetchCoins = async () => {
    setLoading(true);

    const { data } = await axios.get(CoinList(currency));

    setCoins(data); 
    setLoading(false);
  };

  useEffect(() => {
    fetchCoins();
  }, [currency])
  
  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff", 
      },
      type: "dark",
    },
  });

  const handleSearch = () => {
    return coins.filter((coin) => (
      coin.name.toLowerCase().includes(search) || coin.symbol.toLowerCase().includes(search)
    ))
  }
  
  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center"}}>
        
        <Typography variant='h4' style={{margin: 18, fontFamily: "Montserrat"}}>
         Your favourite CryptoCurrencies
        </Typography>
        
        <TextField label='Search for a crypto currency' variant='outlined'
        style={{marginBottom: 20, width: "100%"}}
        onChange={(e) => setSearch(e.target.value)} 
        />
        
        <TableContainer>
          {
            loading ? (
              <LinearProgress style={{backgroundColor: "#5217e2"}} />
            ) : (
              <Table class="glass">
                <TableHead style={{backgroundColor: "#5217e2"}}>
                  <TableRow>
                    {["Coin", "Price", "24h Change"].map((head) => (
                      <TableCell style={{
                        color: "#dee55b",
                        fontWeight: "700",
                        fontFamily: "Montserrat",
                      }}
                      key = {head}
                      align={head==="Coin" ? "" : "right"}
                      >
                        {head}
                      </TableCell>

                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                      {handleSearch().slice((page-1)*10,(page-1)*10+10).map((row) => {
                        const profit = row.price_change_percentage_24h > 0; 

                        return (
                          <TableRow
                          onClick={() => navigate(`/coins/${row.id}`)}
                          class = "row"
                          key = {row.name}
                          >
                            <TableCell component="th" scope="row" style={{
                              display: "flex",
                              gap: 15,
                            }}>
                              <img 
                                src={row?.image}
                                alt={row.name}
                                height="50"
                                style={{marginBottom: 10}}
                              />
                              <div style={{ display: "flex", flexDirection: "column", color: "#dee55b" }}>
                                <span style={{
                                  textTransform: "uppercase",
                                  fontSize: 22,
                                }}>{row.symbol}</span>
                                <span style={{color: "white"}}>{row.name}</span>
                              </div>
                            </TableCell>

                            <TableCell align='right' style={{color:"white"}}>
                            {symbol}{" "}
                            {numberWithCommas(row.current_price.toFixed(2))}
                            </TableCell>
                            
                            <TableCell align="right" style ={{
                              color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                              fontWeight: 500,
                            }}>{profit && '+'} { row.price_change_percentage_24h.toFixed(2)}% </TableCell>
                          </TableRow>
                        );
                      })}
                </TableBody>
              </Table>
          )}

        </TableContainer>

        <Pagination 
        class = "pagination"
        count={(handleSearch()?.length / 10).toFixed(0)} 
        style = {{padding: 20, width: "100%", display:"flex", justifyContent: "center" }}
        color="primary"
        onChange={(_,value) => {
          setPage(value);
          window.scroll(0,450); 
        }}
        />

      </Container>
    </ThemeProvider>
  )
}

export default CoinsTable