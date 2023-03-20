import { Box3 } from "three"
import { Door } from "../Entities/Door"

export const sourceDoor = {//I changed this to doorstyle to match it in the tests
    doorID: 1,
    doorStyle: "Door1",
    modelPath: "Path"
    }

export const testCabUpper = {
    posx: 1,
    posy: 3,
    posz: 1,
    rotx: 1,
    roty: 1,
    rotz: 1,
    roomID: 0,
    cabinetID: 1,
    isUpper: true,
    id: 10,
    doorOffset: [1,10,20], // x offset, y offset, z offset
    attributes:{
        door: Object.assign(new Door(), sourceDoor) 
   },
   wall: {
    wallNumber: 1,
    posX: 10,
    posZ: 5,
    wallLength: 10,
    wallHeight: 5,
    wallRotation: Math.PI/2,
    leftWall: null,
    node: {}
},
    tempBoundBox: Object.assign(new Box3(), {
    "isBox3": true,
    "min": {
        "x": -4.301490797681978,
        "y": 10.050000000000000044,
        "z": 0.057874011993408025
    },
    "max": {
        "x": -2.6514907976819777,
        "y": 11.5375000000000005,
        "z": 2.673622035980225
    }
}),
    modelPath: "yes.obj"
}



const sourceWall = {
        wallNumber: 0,
        posX: 10,
        posZ: 20,
        wallLength: 10,
        wallHeight: 10,
        wallRotation: 0,
        leftWall: null
    }

const testCabCollided1 = {
    posx: 1,
    posy: 1,
    posz: 1,
    rotx: 1,
    roty: 1,
    rotz: 1,
    roomID: 0,
    cabinetID: 1,
    id: 1,
    cabRefRenderID: 1,
    doorOffset: [1,10,20], // x offset, y offset, z offset
    attributes:{
        door: Object.assign(new Door(), sourceDoor) 
   },
   wall: {
    wallNumber: 1,
    posX: 10,
    posZ: 5,
    wallLength: 10,
    wallHeight: 5,
    wallRotation: Math.PI/2,
    leftWall: null,
    node: {}
},
    tempBoundBox: Object.assign(new Box3(), {
    "isBox3": true,
    "min": {
        "x": -4.301490797681978,
        "y": -0.050000000000000044,
        "z": 0.057874011993408025
    },
    "max": {
        "x": -2.6514907976819777,
        "y": 3.5375000000000005,
        "z": 2.673622035980225
    }
}),
    modelPath: "yes.obj"
}



const testCabCollided2 = {
    posx: 1.2,
    posy: 1.2,
    posz: 1.2,
    rotx: 1,
    roty: 1,
    rotz: 1,
    roomID: 0,
    cabinetID: 2,
    id: 2,
    cabRefRenderID: 2,
    doorOffset: [1,10,20],
    attributes:{
        door: Object.assign(new Door(), sourceDoor) 
   },
   wall: {
    wallNumber: 1,
    posX: 10,
    posZ: 5,
    wallLength: 10,
    wallHeight: 5,
    wallRotation: Math.PI/2,
    leftWall: null,
    node: {}
},
    tempBoundBox: Object.assign(new Box3(), {
        "isBox3": true,
        "min": {
            "x": -4.4,
            "y": -10.0,
            "z": -10.0
        },
        "max": {
            "x": 20.0,
            "y": 20.0,
            "z": 20.0
        }
    }),
    modelPath: "yes.obj"
}

const testCabNotCollided = {
    posx: 100,
    posy: 100,
    posz: 100,
    rotx: 0,
    roty: 0,
    rotz: 0,
    roomID: 0,
    cabinetID: 3,
    id: 3,
    cabRefRenderID: 3,
    doorOffset: [1,10,20],
    attributes:{
        door: Object.assign(new Door(), sourceDoor) 
   },
   wall: {
    wallNumber: 1,
    posX: 10,
    posZ: 5,
    wallLength: 10,
    wallHeight: 5,
    wallRotation: Math.PI/2,
    leftWall: null,
    node: {}
},
    tempBoundBox: Object.assign(new Box3(), {
        "isBox3": true,
        "min": {
            "x": 400,
            "y": 400,
            "z": 400
        },
        "max": {
            "x": 401,
            "y": 401,
            "z": 401
        },
    }),               
    modelPath: "yes.obj"
}


export const mockedCabinetList = [testCabCollided1 ,testCabCollided2, testCabNotCollided, testCabUpper]

    const badSourceCab = {}
    const badSourceDoor = {
        //I changed this to doorstyle to match it in the tests
        doorID: null,
        doorStyle: null,
        modelPath: null
      }
    const expectedResult = {
        posx: 1,
        posy: 1,
        posz: 1,
        rotx: 1,
        roty: 1,
        rotz: 1,
        roomID: 0,
        cabinetID: 1,
        cabRefRenderID: 1,
        attributes:{
             door: Object.assign(new Door(), sourceDoor) 
        },
        wall: {
            wallNumber: 1,
            posX: 10,
            posZ: 5,
            wallLength: 10,
            wallHeight: 5,
            wallRotation: Math.PI/2,
            leftWall: null,
            node: {}
        },
        tempBoundBox: Object.assign(new Box3(), {
        "isBox3": true,
        "min": {
            "x": -4.301490797681978,
            "y": -0.050000000000000044,
            "z": 0.057874011993408025
        },
        "max": {
            "x": -2.6514907976819777,
            "y": 3.5375000000000005,
            "z": 2.673622035980225
        }
    }),
        modelPath: "yes.obj"
    }
    

    
