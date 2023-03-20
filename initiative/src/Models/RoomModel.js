let RoomModel = {
    roomID: {
        type: 'number',
        // type: 'uuid' // Re-activating this instead of the previous line will make the ID's into Unique Hash Values. Warning, this will probably break tests, so prepare for some work when implementing this.
        primary: true,
    },

};
export default RoomModel

