import Neode from 'neode';
let PlayerModel : Neode.SchemaObject ={
    playerID: {
        type: "number",
        primary: true
    },
    playerInitiative: {
        type: 'number',
        required: true, 
    },
    playerName: {
        type: 'string',
        required: true, 
    }
}
export default PlayerModel