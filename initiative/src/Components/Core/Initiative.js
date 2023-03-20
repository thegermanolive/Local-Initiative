import Neode from "neode";
import InitiativeTurn from "../models/InitiativeTurn";
import PlayerModel from "../models/PlayerModel";


const PSSWD = "oliver2002"

const Neo4jVars = [process.env.REACT_APP_BOLT_SERVERADDRESS, process.env.REACT_APP_NEO4J_USERNAME, process.env.REACT_APP_NEO4J_PASSWORD]

const instance = new Neode(...Neo4jVars)
instance.model('Player',PlayerModel)
instance.model('Initiative', InitiativeTurn)

setDoc()

async function setDoc(){
    let dList = document.getElementById('dynamicList')
    let sList = document.getElementById('staticList')
    let nextPlayer = document.getElementById('nextPlayer')

    let oArr = await getAllOrdered()
    let uArr = await getAllUnordered()

    nextPlayer.innerText = oArr[0].playerName
    for(let i = 1; i < oArr.length; i++){
        let pName = oArr[i].playerName

        let listItem = document.createElement('li')
        listItem.appendChild(document.createTextNode(pName))
        dList.appendChild(listItem)
    }

    uArr.forEach((e) =>{

        let listItem = document.createElement('li')
        listItem.appendChild(document.createTextNode(e.playerName))
        sList.appendChild(listItem)
    })


}

export async function getAllOrdered(){
    const instance = new Neode(...Neo4jVars)
    instance.model('Player',PlayerModel)

    let outputVal = await instance.all('PlayerModel', PlayerModel)
    let initArray = []

    outputVal.forEach(async obj => {
        initArray.push(obj)
    })
    _orderList(initArray);

    return initArray
}

async function getAllUnordered(){
    const instance = new Neode(...Neo4jVars)
    instance.model('Player',PlayerModel)

    let outputVal = await instance.all('PlayerModel', PlayerModel)
    let initArray = []

    outputVal.forEach(async obj => {
        initArray.push(obj)
    })
    
    return initArray
}

async function _orderList(initArray){
    initArray.sort(compare)
    _loopArray(initArray)
}

async function _loopArray(initArray, InitiativeTurn){
    const instance = new Neode(...Neo4jVars)
    instance.model('Initiative', InitiativeTurn)

    let outputVal = await instance.first('Initiative', InitiativeTurn)
    for(let i = 0; i < outputVal.turnNum; i++){
        let temp = initArray.shift()
        initArray.push(temp)
    }
}

function compare(a,b){
    if(a.playerInitiative > b.playerInitiative){
        return 1
    }
    if(a.playerInitiative < b.playerInitiative){
        return -1
    }
    return 0
}