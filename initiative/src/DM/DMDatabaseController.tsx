import React from 'react';
import ReactDOM from 'react-dom';
import '../App.css';

export class DMController{

    DBString: string;

    constructor(){
        this.DBString = process.env.REACT_APP_BOLT_SERVERADDRESS;
        console.log(this.DBString);

    }

    getAll = () =>{
        
    }
}