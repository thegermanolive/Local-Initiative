import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-bootstrap/Modal';


import './App.css';
import { DungeonMaster } from './DM/DM';
import { Player } from './Player/Player';

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
      <DungeonMaster/>
    )

  }
  else if(redirectDest === RedirectType.Player){
    return(
      <Player/>
    )

  }
  else{
    return (
      <div>
        {/* <button onClick={openModal}>Open Modal</button> */}
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
      <Redirect/>
    </div>
  );
}

export default App;
