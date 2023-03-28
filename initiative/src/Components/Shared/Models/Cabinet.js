import React, { createRef, Suspense, useMemo, useRef } from 'react'
import GetMeshFromPath from './GetMeshFromPath'
import { useLoader, meshBasicMaterial } from "@react-three/fiber";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Box3, Vector3, Color, Mesh, BoxHelper } from 'three';
import * as THREE from 'three'
import { DoorComponent } from '../../Features/DoorComponent';
import { useHelper } from '@react-three/drei';
import { CONVERSION } from '../../Core/RoomRender';

class Cabinet extends React.Component {
    valid = false; // a boolean value that is used for confirming the information that is being sent in is of the correct types.
    material = new THREE.MeshStandardMaterial();

    constructor(props) {
        super(props);
        let cabData = props.cabData
        this.cabRef = createRef();
        this.geoRef = createRef();
        this.groupCab = createRef(); //Math.sq

        if (!cabData || !cabData.cabinetID) { 
            // console.log("Incorect object type stored in the Entity List array")
            return
        }

        if(!cabData.modelPath){
            // console.log("No File Path handed in with the cabinet object. Reverting to Default")
            cabData.modelPath = "../ModelFiles/SimpleCab.obj";
            return
        }

        // this.valid = cabData.modelPath.substr(cabData.modelPath.length - 4, 4).toLowerCase() === ".obj"
        if (!this.valid){
            // console.log("File is of incorrect type!")
        }
        
        cabData.rotx = -(Math.PI/2);
    
        let color = "DarkGoldenRod"
        if(cabData.isCollided)
        {
            color = "red"
        }
        this.state = {
            cabData: cabData,
            color: color
        }
    }

    componentDidUpdate(){

        this._adjustPosition()
    }

    // This is where the position of the cabinet has been
    // modified, based on the wall that it is currently related into.
    // It complements well with the CatalogItem attachToWall functionality as it grabs those position and wall information
    // with relatively ease without making this portion super complicated for us to fix it in the future stories ahead.
    _adjustPosition(){
        let measure = new Box3().setFromObject(this.cabRef.current)
        let vector3 = new Vector3();
        measure.getSize(vector3)
        // 
        const [width, height, depth] = vector3.toArray()
        this.state.cabData.modelSize = vector3.toArray()

        this.cabRef.current.rotation.z = this.state.cabData.rotz

        adjustY(this.cabRef, this.state.cabData)
        
        this.cabRef.current.position.x = (Math.sin(this.state.cabData.rotz) * (depth + 7.55) /2) // the small value change here is... for reasons that dont make perfect sense.
        this.cabRef.current.position.z = (Math.cos(this.state.cabData.rotz) * (depth - 0.10) /2)
        if(! this.state.adjustedPosition){
            
            this.setState({adjustedPosition: this.cabRef.current.position})
        }
                                // Cabinets depth seems to be calculated slightly off, so these numbers work to adjust them. This number moves them over slightly.
    }



    componentDidMount(){

        let measure = new Box3()
        // console.log("mount")
        // console.log(this.cabRef)
        try {
            this._adjustPosition()

            this.state.cabData.cabRef = this.groupCab
            this.state.cabData.cabRefRenderID = this.groupCab.current.id

            const collidedList = this.isCollided(this.props.room.state.entityList)
            if (collidedList.length > 0) {
                let cabData = this.state.cabData
                cabData.isCollided = true
                this.setState({ cabData: cabData })
                collidedList.forEach(cab => {
                    let target = cab.isCollided
                    cab.isCollided = true
                    this.setState({color:"red"})
                    if (!target) {
                        this.props.room.forceUpdate()
                    }
                });

            }
        } catch (err) {
            if (typeof err === TypeError) {

            }
        }
    }

    /**
     * This internal isCollided method allows us to determine which cabinets that the current cabinet
     * has collided into and uses that information to change the color of the appropriate cabinet to red.
     * 
     * Basically, this function creates a boundbox for that current cabinet and other cabinets in the state
     * and compares whether or not they collided or not.
     * @param {} collidableObjects 
     * @returns 
     */
    isCollided(collidableObjects){
        let currentBoundBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        currentBoundBox.setFromObject(this.groupCab.current);
        let cabinetId = this.state.cabData.id 
        // collidableObjects.forEach(cab => {
        // for (const cab in collidableObjects){
            for(let i = 0; i<collidableObjects.length;i++){

            let tempBoundBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            tempBoundBox.setFromObject(collidableObjects[i].cabRef.current);
            collidableObjects[i].tempBoundBox = tempBoundBox;
        }
        // })
        let result = this.objectCollided(currentBoundBox,  cabinetId, collidableObjects)
        
        return result
    }

    /**
     * This method allows the current cabinet to detect whether or not it has been collided to another cabinet.
     * PARAMS: List of collidable objects to check for collisions with this object as a comparison.
     * RETURN: BOOLEAN
     */
    objectCollided(currentBoundingBox, cabinetID, collidableObjects) {
        if(!collidableObjects) return false
        let collidedList = []


        // collidableObjects.forEach(cab => {
        for (const cab of collidableObjects){
            if (cab.id != cabinetID)
            {
                if (currentBoundingBox.intersectsBox(cab.tempBoundBox))
                {
                    collidedList.push(cab)
                }
            }
        }
        // });
        return collidedList
    }

    render() { // Method copied from React documentation, basic method for rendering an object. displays a red box.
        if (this.valid) {
                let rotation = [this.state.cabData.rotx, this.state.cabData.roty, this.state.cabData.rotz];
                let position = [this.state.cabData.posx, this.state.cabData.posy, this.state.cabData.posz];
                let modelPath = this.state.cabData.modelPath
                let doorOffset = [11.5*2,0,11.5*2];
                let doorpos = []
                if(this.state.adjustedPosition?.x || this.state.adjustedPosition?.z || this.state.adjustedPosition?.y){
                    doorpos = [this.state.adjustedPosition.x, this.state.adjustedPosition.y, this.state.adjustedPosition.z]
                }
                else{
                    doorpos = position
                }
                //cab is in inches, this converts it into feet
                const scale = 1/12

                return (
                    <group ref={this.groupCab} castShadow receiveShadow dispose={null} scale={scale} position={position} key={Math.random()} >
                        <mesh
                            ref={this.cabRef}
                            onClick={(e)=>{
                                this.props.onClickHandler(this.state.cabData)
                                // console.log(this.state.cabData)
                                e.stopPropagation()}}
                                rotation={rotation}
                            >
                            <GetMeshFromPath modelPath={modelPath}  attach="material" color={this.state.color} material={this.material}/>
                        </mesh>
                        
                        {/* <DoorComponent

                            position={doorpos}
                            door={this.state.cabData.attributes.door}
                            material={this.material}
                            offset={doorOffset}
                            rotation={rotation}
                            color={this.state.color}
                        />  */}
                        
                    </group>
                )
        }
        else {

            return (null);
        }
    }

}

export default Cabinet


export function adjustX(){

}

/***
 * Method works for now, but due to some constant value will need to be tested with different
 * cabinets with different heights
 */
export function adjustY(cabRef, cabData){

    const [width, height, depth] = cabData.modelSize;
    let offset = 0;
    if (cabData.isUpper){
        offset = -height/2
    }
    else{

        offset = height/2 +0.5
    }
    cabRef.current.position.y = offset

        
}

export function adjustZ(cabRef, cabData){
}