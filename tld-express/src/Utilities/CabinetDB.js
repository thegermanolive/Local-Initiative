//Done Cleaning
import Neode from 'neode';
import CabinetModel from '../Models/CabinetModel';
import DoorModel from '../Models/DoorModel';
import RoomModel from '../Models/RoomModel'
import neo4j from 'neo4j-driver'
import Wall from '../Models/WallModel';
import { cabinetBuilder } from '../Entities/Cabinet';

const Neo4jVars = [process.env.REACT_APP_BOLT_SERVERADDRESS, process.env.REACT_APP_NEO4J_USERNAME, process.env.REACT_APP_NEO4J_PASSWORD]


//This will create an instance of neode to interact with the database
//https://www.npmjs.com/package/neode
export function setupDB(){
    const instance = new Neode(...Neo4jVars);

    instance.model('Cabinet', CabinetModel);
    instance.model('CabinetTemplate', CabinetModel);
    instance.model('Cabinet:Test', CabinetModel);
    instance.model('Door', DoorModel);
    instance.model('DoorTemplate', DoorModel);
    instance.model('Door:Test', DoorModel);
    instance.model('Room', RoomModel);
    instance.model('Room:Test', RoomModel);
    instance.model('Test', DoorModel);
    instance.model('Wall', Wall)
    return instance
}


const instance = setupDB()

/**
 * This function will query the database for all template cabinets and populate a list
 * with cabinet objects that will be used for the dragging and dropping of cabinets
 * @returns 
 */
export async function getAllCabinets() {
    let outputVal = await instance.all('CabinetTemplate')
    
    let list = []
    for (let obj of outputVal)
    {       
        const cabDoorID = obj.get("contains_this_doorTemplate").endNode().get('doorID').toInt()
        let doorNode = await instance.first("DoorTemplate", {doorID:cabDoorID})

        let door = await doorNode.toJson()

        let cabJson = await obj.toJson()
        

        let cab = await cabinetBuilder(cabJson, door)
        
        list.push(cab)
    }
    return list;
}

/**
 * This method will use a props object to query the database for a Cabinet
 * @param {*} props 
 * @returns 
 */
export async function getCabinetByProps(props) {
    return await instance.first('Cabinet', props)
}

/**
 * This method will attempt to grab a Cabinet from the database using the cabinetID
 * it will add this as properties and call GetCabinetByProps to query the database
 */
export async function getCabinetbyCabinetID(cabid) {
    return await getCabinetByProps({ cabinetID: cabid })

}
/**
 * This method will use a props object to delete a cabinet from the database
 * @param {*} props 
 * @returns 
 */
export async function removeCabinetByProps(props) {
    let targetCab = await getCabinetByProps(props)
    if (targetCab === false) {throw new Error("Cabinet could not be deleted, could not be found")}
    return await targetCab.delete();
}

/**
 * This method will use a cabinets "id" value (not the cabinetID) to delete a cabinet from the database
 * @param {*} id 
 * @returns 
 */
export async function removeCabinetByID(id) {
    const targetCab = await instance.findById("Cabinet", id)
    if (targetCab === false) {throw new Error("Cabinet could not be deleted, could not be found")}
    else {
        const relationships = await targetCab.get('contains_this_door')
        let oldDoor = relationships.endNode()
        await relationships.startNode().detachFrom(relationships.endNode())
        await oldDoor.delete()
    }
    return await targetCab.delete();
}

/**
 *  This method will add a cabinet to the Database creating all necessary relationships in the process
 * @param {cabinet to add} cabinet 
 */
export async function addCabinet(cabinet) {
    cabinet.distanceFromWall = Math.sqrt((cabinet.posx - cabinet.wall.posX)**2 + (cabinet.posz - cabinet.wall.posZ)**2)
    delete cabinet.contains_this_doorTemplate
   
    const dbCab = await instance.create('Cabinet', {
        ...cabinet
    })
    await _relateToRoom(cabinet, dbCab);
    return (dbCab);

}


/**
 *  This method will add or update a given cabinet in the Database
 * @param {cabinet to update} cabinet 
 */
export async function updateCabinet(cabinet) {

    delete cabinet.node
    delete cabinet._labels
    delete cabinet._id
    delete cabinet?.attributes?.door?._id
    

    let foundCab
    try {
        foundCab = await instance.findById('Cabinet', cabinet.id)
    } catch {}

    if (!foundCab) {
        foundCab = await addCabinet(cabinet)

    }
    if(!cabinet['attributes'])
    {
        cabinet.attributes ={
            door:1
        }
    }

      
    const relationships = await foundCab.get('contains_this_door')

    //If relationship was found 
    if (relationships) {
        //detatch nodes
        let oldDoor = relationships.endNode()
        await relationships.startNode().detachFrom(relationships.endNode())
        await oldDoor.delete()
    }
    let doorNodeToRelateTo 
    try{
        doorNodeToRelateTo = await instance.create('Door', { ...cabinet.attributes.door })
    } catch (err){
        console.error(err)
        throw err
    }

    if (!doorNodeToRelateTo) {
        console.warn("-----------------Couldn't find the door-------------")
        return;
    }


    await foundCab.relateTo(doorNodeToRelateTo, "contains_this_door", { doorID: Number(cabinet['attributes']['door']['doorID'])})

    const outputCab = await instance.findById('Cabinet', foundCab.id())

    return outputCab;

}


async function _relateToRoom(cabinet, foundCab){
    let RoomNodeToRelateTo = await instance.first('Room', {roomID: Number(cabinet['roomID'])})
    if (!RoomNodeToRelateTo) {
        console.warn(`-----------------Couldn't find the Room #${cabinet['roomID']}-------------`)
        await instance.create('Room', {roomID: Number(cabinet['roomID'])})
        RoomNodeToRelateTo = await instance.first('Room', {roomID: Number(cabinet['roomID'])})
    }

    let wallToRelateTo = await instance.cypher(`Match (r:Room {roomID: ${cabinet.roomID}})-[]-(w:Wall {wallNumber: ${cabinet.wall.wallNumber}}) Return w`)

    if (!wallToRelateTo.records[0]) {
        console.warn(`-----------------Couldn't find the Wall #${cabinet['roomID']} -> ${cabinet.wall.wallNumber}-------------`)
        let allwalls = await instance.cypher(`Match (r:Room {roomID: ${cabinet.roomID}})-[]-(w:Wall ) Return w`)
        for (let record of allwalls.records) { console.log(record) }
        return;
    }
    wallToRelateTo = wallToRelateTo.records[0]._fields[0]
    wallToRelateTo = await instance.findById("Wall", wallToRelateTo.identity.low);

    if(foundCab.get("contains_cabinet"))
    {
        console.warn(`--------------CAB has room----------------`)
        return;
    }

    try {
        await foundCab.relateTo(wallToRelateTo, "contains_cabinet", {})
    } catch {
        console.warn("Database Loading error")
     }

}

/**
 * This method will return a json object of the doors in the Database used to populate
 * the attribute menu's list box with the available door styles 
 */
export async function getAllDoorStyles() {

    let doors = await instance.all('DoorTemplate')

    let json = JSON.parse(JSON.stringify(await doors.toJson()));
    
    return json
}

/**
 * This method will use a props object to query the database for a Door
 * @param {*} props 
 * @returns 
 */
export async function getDoorByProps(props) {
    return await instance.first('Door', props)
}
/**
 * This method will attempt to grab a Door from the database using the doorID
 * it will add this as properties and call GetDoorByProps to query the database
 */
export async function getDoorbyID(doorid) {
    return await getDoorByProps({ doorID: doorid })

}

/**
 * This method will close the database connection
 * @returns 
 */
export async function closeDB(){
    return instance.close()
}


