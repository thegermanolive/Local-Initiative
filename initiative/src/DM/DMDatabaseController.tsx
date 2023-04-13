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
    turnNum: number

    constructor(){
        // console.log(Neo4jVars);
        this.instance = setupDB();
        
        // this.addTurn()
        // this.getAll()
        // this.getAll();

    }

    async getAll(){
        // console.log(this.initiativeList)
        this.initiativeList = []
        await this.instance.all('Player').then(e =>{
            e.forEach(e =>{
                e.toJson().then(e =>{this.initiativeList.push(e)})
            })
        })
        // await this.instance.all('Monster').then(e =>{
        //     e.forEach(e =>{
        //         e.toJson().then(e =>{this.initiativeList.push(e)})
        //     })
        // })
        await this.instance.all('Initiative').then(e=>{
            e.forEach(e =>{
                e.toJson().then(e =>{this.turnNum = e.turnNum})
                e.delete()
            })
        })
        
        if(this.turnNum === undefined || !(this.turnNum > 0)  ){
            this.turnNum = 0
            let newTurnNum = {
                initiativeID: 1,
                turnNum: 0
            }
            await this.instance.create('Initiative', newTurnNum)
        }
        // this.initiativeList.sort((a,b) => (a))
        // console.log(this.initiativeList)
        this.initiativeList.sort((a,b) =>(a.playerInitiative > b.playerInitiative ? -1 : 1))
        console.log("turn num")
        console.log(this.turnNum)
        for(let i = 0; i < this.turnNum; i++){
            this.initiativeList.push(this.initiativeList.shift())
        }
        return this.initiativeList
        
    }
    async deleteAll(){
        this.instance.cypher("match (n) detach delete n",{})
        // await this.instance.all('Initiative').then(e =>{
        //     e.forEach(e =>{
        //         e.delete()
        //     })
        // })
        await this.instance.all('Monster').then(e =>{
            e.forEach(e =>{
                e.delete()
            })
        })
        await this.instance.all('Player').then(e =>{
            e.forEach(e =>{
                e.delete()
            })
        })
        // this.instance.deleteAll('Monster')
    }

    async addPlayer(player){
        const dbPlayer = await this.instance.create('Player',player);
        // console.log(dbPlayer)

    }

    //DONT WWOKR
    async addTurn(){


        let newTurn
        // try{
            await this.instance.all('Initiative').then(e=>{
                e.forEach(e =>{
                    e.toJson().then(e =>{this.turnNum = e.turnNum})
                    e.delete()
                })
            })
        // } catch(e) {
        //     let newTurnNum = {
        //         initiativeID: 1,
        //         turnNum: 0
        //     }
        //     newTurn = await this.instance.create('Initiative', newTurnNum)
        //     console.log(newTurn)
        // }

        let newTurnNum = {
            initiativeID: 1,
            turnNum: 0
        }

        if(this.turnNum === undefined || !(this.turnNum > 0)){
            this.turnNum = 0;
            let newTurnNum = {
                initiativeID: 1,
                turnNum: 0
            }
            newTurn = await this.instance.create('Initiative', newTurnNum)
            console.log(newTurn)
        }
        else{
            newTurnNum.turnNum = this.turnNum + 1
            this.instance.create('Initiative', newTurnNum)
        }
        console.log(this.turnNum)

    }
}