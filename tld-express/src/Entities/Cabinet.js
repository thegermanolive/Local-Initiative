import DoorModel from "../Models/DoorModel"
import { Door } from "./Door"
import CabinetModel from "../Models/CabinetModel";
import Validator from "neode/build/Services/Validator";
import Model from "neode/build/Model";

export class Cabinet {
    constructor() { }
    // setStyle(){
    // }
    getDoorOffset() {
        return this.doorOffset
    }
}

/**
 * This method will return a cabinet object with it's door as it's own object
 * inside the attributes of the Cabinet object
 */
export async function cabinetBuilder(cabinet, door) {
    try {
        await Validator(null, new Model(null, 'Cabinet', CabinetModel), cabinet)
    } catch (err) {
        console.error(err.message)
        // console.log(cabinet)
        throw new Error("Bad Cabinet Data");
    }
    // console.log(cabinet)

    try {
        await Validator(null, new Model(null, 'Door', DoorModel), door)
    } catch (err) {
        throw new Error("Bad Door Data");
    }
    door._label = ['Door']
    cabinet.id = cabinet._id

    delete cabinet._id
    delete cabinet.node
    delete door._id
    delete cabinet.node

    door.position = [cabinet.posx, cabinet.posy, cabinet.posz]
    door.rotation = [cabinet.rotx, cabinet.roty, cabinet.rotz]
    let cab = Object.assign(new Cabinet(), cabinet)
    if (cab.attributes === undefined) {
        cab.attributes = {}
    }
    cab.attributes.door = Object.assign(new Door(), { ...door })
    return cab
}
