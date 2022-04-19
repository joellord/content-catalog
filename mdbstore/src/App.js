import React from 'react';

import Header from './components/Header';
import LeftNav from './components/LeftNav';
import GridView from './components/GridView';
import Footer from './components/Footer';
import Loading from './components/Loading';

import { useSelector } from 'react-redux';

import "./assets/bootstrap.min.css";
import './App.css';

function App() {
  const status = useSelector(state => state.search.status);

  return (
    <div className="App container-fluid">
      <header className="App-header">
        <Header/>
      </header>
      <main>
        <div className="row justify-content-center">

          {status === "loading" && 
          <Loading />
          }
          <div className="col-2">
            <LeftNav />
          </div>
          <div className="col-7">
            <GridView/>
          </div>
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default App;
