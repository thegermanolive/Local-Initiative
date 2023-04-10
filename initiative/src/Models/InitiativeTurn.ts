import Neode from 'neode';
let InitiativeTurn : Neode.SchemaObject ={
    initiativeID: {
        type: "number",
        primary: true
    },
    turnNum: {
        type: 'number',
        integer:true,
    }
};
export default InitiativeTurn;