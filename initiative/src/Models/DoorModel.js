let DoorModel = {
  doorID: {
    type: 'number',
    required: true, // Creates an Exists Constraint in Enterprise mode
  },
  doorStyle: {
    type: "string"
  },
  modelPath: {
    type: "string"
  },
}
export default DoorModel 
