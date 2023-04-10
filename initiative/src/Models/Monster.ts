import Neode from 'neode';
let MonsterModel : Neode.SchemaObject={
    monsterID: {
        type: "number",
        primary: true
    },
    monsterInitiative: {
        type: 'number',
        required: true, 
    },
    monsterName: {
        type: 'string',
        required: true, 
    }
}
export default MonsterModel