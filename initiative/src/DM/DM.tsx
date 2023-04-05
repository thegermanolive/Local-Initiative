import React from 'react';
import ReactDOM from 'react-dom';
import '../App.css';
import { DMController } from './DMDatabaseController';



export function DungeonMaster(){

    let Database:DMController = new DMController();
    console.log(Database);

    async function populateList(){

    }

    return(
        <div>
            <h1>DM Screen</h1>
            <h2>In DM file</h2>
        </div>
    )
}

