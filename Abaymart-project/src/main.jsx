import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { DataProvider } from './Components/DataProvider/DataProvider.jsx';
import { Reducer, initialState } from './Utility/rEDUCER.JSX';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
         <StrictMode>
          <DataProvider Reducer={Reducer} initialState={initialState} >
            <App />
          </DataProvider>
           
         </StrictMode>
  </BrowserRouter>
  
)
