instance.model('CabinetTemplate', {
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
    modelPath: {
        type: 'string',
    },
    cabinetID: {
        type: 'number',
        primary: true,
    }
});
