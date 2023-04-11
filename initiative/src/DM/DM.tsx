import React from 'react';
import ReactDOM from 'react-dom';
import '../App.css';
import { DMController } from './DMDatabaseController';



export class DungeonMaster extends React.Component{

    Database:DMController = new DMController();
    initiativeList : Array<any>
    // console.log(Database);
    constructor(props){
        super(props)
    }

    componentDidMount(): void {
        this.populateList()
    }

    async populateList(){
        let table = document.getElementById('DMInit')
        table.innerHTML = null

        this.createTableHeaders()

        
        let row = document.createElement('tr');
        row.innerHTML = null

        let tableCell1 = document.createElement('td')
        let tableCell2 = document.createElement('td')
        let tableCell3 = document.createElement('td')

        tableCell1.appendChild(document.createTextNode('1')) // init order
        tableCell2.appendChild(document.createTextNode('testPlayer')) // player name
        tableCell3.appendChild(document.createTextNode('17.15')) // init val
        row.appendChild(tableCell1)
        row.appendChild(tableCell2)
        row.appendChild(tableCell3)

        table.appendChild(row);

    }

    createTableHeaders(){
        let table = document.getElementById('DMInit')
        table.innerHTML = null

        
        let row = document.createElement('tr');
        let tableHeader1 = document.createElement('th')
        let tableHeader2 = document.createElement('th')
        let tableHeader3 = document.createElement('th')
        tableHeader1.appendChild(document.createTextNode('Current Order'))
        tableHeader2.appendChild(document.createTextNode('Player Name'))
        tableHeader3.appendChild(document.createTextNode('Initiative'))
        row.appendChild(tableHeader1)
        row.appendChild(tableHeader2)
        row.appendChild(tableHeader3)
        table.appendChild(row);

    }

    submitPlayer(){

    }

    render(): React.ReactNode {
        return(
            <div>
                <h1>DM Screen</h1>
                <h2>In DM file</h2>
                <div>
                    <h3>NEXT:<span id="nextPlayer"></span></h3>
                    <table id="DMInit">
                        
                    </table>
                </div>
                <form>
                    <label htmlFor="playerName">Player name:</label><br/>
                    <input type="text" id="playerName" name="playerName"/><br/><br/>
                    <label htmlFor="initVal">Initiative:</label><br/>
                    <input type="number" id="initVal" name="initVal"/><br/><br/>
                    <button type="button" onClick={this.submitPlayer}>Submit</button>
                </form>
            </div>
        )
    }
    
}

