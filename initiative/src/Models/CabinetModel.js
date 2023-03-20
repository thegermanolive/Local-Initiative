let CabinetModel = {
    ID: {
        type: "number",
        primary: true
    },
    posx: {
        type: 'number',
        required: true, // Creates an Exists Constraint in Enterprise mode
    },
    posy: {
        type: 'number',
        required: true, // Creates an Exists Constraint in Enterprise mode
    },
    posz: {
        type: 'number',
        required: true, // Creates an Exists Constraint in Enterprise mode
    },
    rotx: {
        type: 'number',
        required: true, // Creates an Exists Constraint in Enterprise mode
    },
    roty: {
        type: 'number',
        required: true, // Creates an Exists Constraint in Enterprise mode
    },
    rotz: {
        type: 'number',
        required: true, // Creates an Exists Constraint in Enterprise mode
    },
    distanceFromWall: {
        type: 'number',
    },
    modelPath: {
        type: 'string',
    },
    cabinetID: {
        type: 'number',
        required: true,
    },
    isUpper: {
        type: 'boolean',
        required: false,
    },
    contains_this_door:{
        type: "relationship",
        target: "Door",
        relationship: "CONTAINS_THIS_DOOR",
        direction: "out",
        eager: true // <-- eager load this relationship
    },
    contains_this_doorTemplate:{
        type: "relationship",
        target: "DoorTemplate",
        relationship: "CONTAINS_THIS_DOOR",
        direction: "out",
        eager: true // <-- eager load this relationship
    },
    contains_cabinet:{
        type: "relationship",
        target: "Wall",
        relationship: "CONTAINS_CABINET",
        direction: "in",
        eager: true // <-- eager load this relationship
    }

};
export default CabinetModel

