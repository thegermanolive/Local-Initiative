//this is the entity which is used within our application, for db models check the model folder
export class Door{
  constructor(){}

  /*
   * This function uses the internal posx, posy, posz, and sets its offset to 
   * properly match the position of the door on the cabinet, it then returns 
   * the modified positions
   */
  getPosition(offset){

    let [x,y,z] = offset
    let [dx,dy,dz] = this.position
    
    let retPositions = [dx + x, dy + y,  dz+ z]
    return retPositions
  }

  /*
   * This function uses the internal rotx, roty, rotz, and sets its offset to 
   * properly match the rotation of the door on the cabinet, it then returns 
   * the modified rotations
   */
  getRotation(offset){
    let [x,y,z] = offset
    let [dx,dy,dz] = this.rotation
    let retRotation = [dx + x, dy + y,  dz+ z]
    return retRotation
  }
}
export default Door
