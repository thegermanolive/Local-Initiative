import React from 'react';
import ReactDOM from 'react-dom';
import '../App.css';
import Neode from 'neode';
import InitiativeTurn from '../Models/InitiativeTurn';
import MonsterModel from '../Models/Monster';
import PlayerModel from '../Models/Player';

const Neo4jVars: (string)[] = [process.env.REACT_APP_BOLT_SERVERADDRESS, process.env.REACT_APP_NEO4J_USERNAME, process.env.REACT_APP_NEO4J_PASSWORD]

export function setupDB() : Neode {
    const instance = new Neode(Neo4jVars[0],Neo4jVars[1],Neo4jVars[2]);

    instance.model('Player', PlayerModel);
    instance.model('Initiative', InitiativeTurn);
    instance.model('Monster', MonsterModel);

    return instance;
}

export class DMController{

    instance : Neode;
    initiativeList : Array<any>

    constructor(){
        console.log(Neo4jVars);
        this.instance = setupDB();
        // this.getAll();

    }

    async getAll(){
        console.log(this.initiativeList)
        this.initiativeList = new Array<any>
        await this.instance.all('Player').then(e =>{
            e.forEach(e =>{
                this.initiativeList.push(e)
            })
        })
        await this.instance.all('Monster').then(e =>{
            e.forEach(e =>{
                this.initiativeList.push(e)
            })
        })
        
        // this.initiativeList.sort((a,b) => (a))
        console.log(this.initiativeList)
        
    }
}