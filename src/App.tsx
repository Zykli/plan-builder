import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { Svg } from './components/Svg';
import { Builder } from './components/Builder';
import { useDispatch } from 'react-redux';
import { setItems } from './redux/dataStorage/actions';
import { initialItems } from './contexts/items';
import { toPairs } from 'lodash';

function App() {

  const disp = useDispatch();

  useEffect(() => {
    disp(setItems({
      storage: 'items',
      items: toPairs(initialItems.items).map(([id, item]) => ({
        id,
        item
      }))
    }));
  }, []);

  return (
    <div className="App">
      <Builder />
      <svg id='centers' style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100%',
        pointerEvents: 'none'
      }}>


      </svg>
    </div>
  );
}

export default App;
