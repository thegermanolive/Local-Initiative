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
        let list = document.getElementById('DMInit')
        list.innerHTML = null

        // var firstname = document.getElementById('firstname');
        var entry = document.createElement('li');
        entry.appendChild(document.createTextNode('tesasasdasdasdasfsaasfasfassfsat'));
        list.appendChild(entry);

    }

    render(): React.ReactNode {
        return(
            <div>
                <h1>DM Screen</h1>
                <h2>In DM file</h2>
                <div>
                    <ol id="DMInit">
                        
                    </ol>
                </div>
                <form>
                    <label htmlFor="playerName">Player name:</label><br/>
                    <input type="text" id="playerName" name="playerName"/><br/><br/>
                    <label htmlFor="initVal">Initiative:</label><br/>
                    <input type="number" id="initVal" name="initVal"/><br/><br/>
                    <button>Submit</button>
                </form>
            </div>
        )
    }
    
}

