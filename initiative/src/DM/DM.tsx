import React from 'react';
import ReactDOM from 'react-dom';
import '../App.css';
import { DMController } from './DMDatabaseController';
import PlayerModel from '../Models/Player'
import { Validator } from 'react';


let playerNumber : number = 1


export class DungeonMaster extends React.Component{

    Database:DMController = new DMController();
    initiativeList : Array<any>
    interval : NodeJS.Timer
    // console.log(Database);
    constructor(props){
        super(props)
        this.state={
            uploadID:"1"
        }
    }

    componentDidMount(): void {
        this.populateList()
        this.interval = setInterval(async () =>{
            await this.populateList()
            console.log("in interval")
        }, 1000*30)
    }
    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any): void {
        console.log("UPDATED")
        // this.populateList()
        // window.location.reload()
    }

    async populateList(){
        let table = document.getElementById('DMInit')
        table.innerHTML = null

        this.createTableHeaders()
        let initList = await this.Database.getAll()
        // console.log("inDM")
        console.log(initList)
        
        initList.forEach(e =>{
            console.log(e)
        })
        
        

        let order = 1
        if( initList !== undefined && initList[0] !== undefined && initList.length > 0){
            document.getElementById('nextPlayer').innerText= initList[0].playerName

            initList.forEach(e => {
                let row = document.createElement('tr');
                row.innerHTML = null
        
                let tableCell1 = document.createElement('td')
                let tableCell2 = document.createElement('td')
                let tableCell3 = document.createElement('td')
    
                tableCell1.appendChild(document.createTextNode(order.toString())) // init order
                order++
                tableCell2.appendChild(document.createTextNode(e.playerName)) // player name
                tableCell3.appendChild(document.createTextNode(e.playerInitiative.toString())) // init val
                row.appendChild(tableCell1)
                row.appendChild(tableCell2)
                row.appendChild(tableCell3)
    
                table.appendChild(row);
    
            })
        }
        

        

        

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

    async submitPlayer(){
        let newPlayer = {
            playerID: null,
            playerInitiative: null,
            playerName: null
        }
        // console.log(playerNumber)
        newPlayer.playerID = playerNumber
        playerNumber = playerNumber + 1
        newPlayer.playerInitiative = parseFloat((document.getElementById('initVal') as HTMLInputElement).value)
        newPlayer.playerName = (document.getElementById('playerName') as HTMLInputElement).value

        // console.log(newPlayer)
        try{
            await this.Database.addPlayer(newPlayer)
            this.populateList()
        }
        catch(e){
            playerNumber = playerNumber - 1
            console.log(e)
        } finally{
            (document.getElementById('initVal') as HTMLInputElement).value = "";
            (document.getElementById('playerName') as HTMLInputElement).value= "";
        }
    }

    async deleteAll(){

        if(window.confirm("Do you want to delete ALL?")){
            console.log("CONFIRMED")
            this.Database.deleteAll()

        } else {
            console.log("DENIED")
        }

    }

    async addTurn(){
        await this.Database.addTurn();

    }

    forceRender(){
        
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
                    <button type="button" onClick={()=>{
                        this.submitPlayer()
                    }}>Submit</button>
                </form>
                {/* <button type='button' onClick={()=>{this.forceUpdate()}}>Reload</button> */}
                <button type='button' onClick={()=>{this.deleteAll()}} className="delButton">Delete ALL</button>
                <button type='button' onClick={()=>{this.addTurn()}}>Add Turn</button>
            </div>
        )
    }
    
}

