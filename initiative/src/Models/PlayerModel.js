let PlayerModel ={
    ID: {
        type: "number",
        primary: true
    },
    playerInitiative: {
        type: 'number',
    },
    playerName: {
        type: 'string',
    }
};

export default PlayerModel;