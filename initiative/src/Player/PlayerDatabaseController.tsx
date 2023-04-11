import React from 'react';
import ReactDOM from 'react-dom';
import '../App.css';
import Neode from 'neode';
import { setupDB } from '../DM/DMDatabaseController';

export class PlayerDatabase{

    instance : Neode
    initiativeList : Array<any>

    constructor(){

        this.instance = setupDB();
    }

}