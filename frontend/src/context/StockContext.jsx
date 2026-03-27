import { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

const StockContext = createContext();
const API = 'http://localhost:5000/api';

export const StockProvider = ({ children }) => {
  const [stocks, setStocks] = useState([]);
  const [prevPrices, setPrevPrices] = useState({});
  const [priceFlash, setPriceFlash] = useState({});
  const wsRef = useRef(null);

  useEffect(() => {
    axios.get(`${API}/stocks/market`).then(res => setStocks(res.data));

    const connect = () => {
      wsRef.current = new WebSocket('ws://localhost:5000');
      wsRef.current.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.type === 'STOCK_UPDATE') {
          setStocks(prev => {
            const newFlash = {};
            msg.data.forEach(s => {
              const old = prev.find(p => p.symbol === s.symbol);
              if (old && old.price !== s.price) {
                newFlash[s.symbol] = s.price > old.price ? 'up' : 'down';
              }
            });
            if (Object.keys(newFlash).length > 0) {
              setPriceFlash(newFlash);
              setTimeout(() => setPriceFlash({}), 800);
            }
            return msg.data;
          });
        }
      };
      wsRef.current.onclose = () => setTimeout(connect, 3000);
    };
    connect();
    return () => wsRef.current?.close();
  }, []);

  const getStock = (symbol) => stocks.find(s => s.symbol === symbol);

  return (
    <StockContext.Provider value={{ stocks, priceFlash, getStock }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStocks = () => useContext(StockContext);
