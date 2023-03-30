import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/App';
import MarvelService from './services/MarvalService';
import './style/style.scss';


 // const marvelSevice = new MarvelService ();
// marvelSevice.getAllCharacters().then(res => console.log(res))
// marvelSevice.getAllCharacters().then(res => res.data.results.forEach(item => console.log(item.name)));


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

