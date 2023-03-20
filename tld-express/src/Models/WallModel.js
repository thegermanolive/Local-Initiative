let Wall = {
    //primary id in database
    wallID: {
        type: 'number',
        primary: true,
    },
    //number within the room
    wallNumber: {
        type: 'number',
        required: true,
        min: 1,
        integer: true,
    },
    posX:{
        type: 'number',
        required: true,
    },
    posZ: {
        type: 'number',
        required: true,
    },
    wallLength: {
        type: 'number',
        required: true,
        min: 0.1,
        max: 25,
    },
    wallHeight:{
        type: 'number',
        required: true,
        min: 0.1,
        max: 5,
    },
    wallRotation: {
        type: 'number',
        required: true,
        min: 0,
        max: Math.PI*2,
        invalid: [Math.PI*2],
    },
    //CAN be UNIT TESTED 
    //https://github.com/adam-cowley/neode/blob/master/test/Services/Validator.spec.js - Line 816
    left_wall_is:{
        type: "relationship",
        target: "Wall",
        relationship: "LEFT_WALL_IS",
        direction: "out",
        //eager: true, // unsure if needed
    },

    contains_cabinet:{
        type: "relationship",
        target: "Cabinet",
        relationship: "CONTAINS_CABINET",
        direction: "out",
        eager: true // <-- eager load this relationship
    },

}
export default Wall;