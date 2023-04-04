import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-bootstrap/Modal';


import './App.css';

const logo = require( './logo.svg');
enum RedirectType {
  DM,
  Player
}

function Redirect(){
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(true);
  const [redirectDest, setRedirectDest] = React.useState<RedirectType>();

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  function toPlayer(){
    setRedirectDest(RedirectType.Player);
  }

  function toDM(){
    setRedirectDest(RedirectType.DM);
  }

  if(redirectDest === RedirectType.DM){
    return(
      <h1>DM Screen</h1>
    )

  }
  else if(redirectDest === RedirectType.Player){
    return(
      <h1>Player Screen</h1>
    )

  }
  else{
    return (
      <div>
        <button onClick={openModal}>Open Modal</button>
        <Modal
           show={modalIsOpen}
           onShow={afterOpenModal}
           onHide={closeModal}
           backdrop="static"
           keyboard={false}
           className="Modal"
        >
          <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2>
          <button onClick={closeModal}>close</button>
          <div>I am a modal</div>
          <form>
            <input />
            <button onClick={toDM}>DM</button>
            <button onClick={toPlayer}>Player</button>
          </form>
        </Modal>
      </div>
    );
  }

  
}

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <Redirect/>
    </div>
  );
}

export default App;
