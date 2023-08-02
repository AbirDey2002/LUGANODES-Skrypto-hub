import React, { useEffect, useState } from 'react'
import { CryptoState } from '../CryptoContext';
import { HistoricalChart } from '../config/api';
import axios from 'axios';
import { CircularProgress, ThemeProvider, createTheme } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CoinInfo = ({coin}) => {

  const [historicData, setHistoricData] = useState();
  const [days, setDays] = useState(1);

  const { currency } = CryptoState();

  const fetchHistoricData = async () => {
    const {data} = await axios.get(HistoricalChart(coin.id, days, currency));

    setHistoricData(data.prices);
  };

  useEffect(() => {
    fetchHistoricData();
  }, [currency, days]);

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
      <div class="container2">
      
        {
          !historicData ? (
            <CircularProgress 
            style={{color: "#5217e2"}}
            size={250}
            thickness={1}
            />
          ) : (
              
            <>
              <Line 
                data={{
                  labels: historicData.map(coin => {
                    let date = new Date(coin[0]);
                    let time = 
                      date.getHours() > 12
                       ? `${date.getHours()-12}:${date.getMinutes()} PM`
                       : `${date.getHours()}:${date.getMinutes()} AM`

                    return days===1? time : date.toLocaleDateString();
                  }),

                  datasets: [{
                    
                    data: historicData.map((coin) => coin[1]),
                    label: `Price ( Past ${days} Days) in ${currency}`,
                    borderColor: "#dee55b"
                  }]
                }}
                options={{
                  elements: {
                    point: {
                      radius: 1,
                    },
                  },
                }}
              />

            </>

          )
        }
      </div>
    </ThemeProvider>
  )
}

export default CoinInfo