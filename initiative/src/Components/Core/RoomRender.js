//Done Cleaning
import React, { Component, useState } from 'react';
import { OrbitControls, Plane } from '@react-three/drei'
import { useThree, useLoader } from "@react-three/fiber"
import Cabinet from "../Shared/Models/Cabinet";
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { Door, DoorComponent } from '../Features/DoorComponent';

// The number we multiply to get height from meters to feet
export const CONVERSION = 3.28084
//Room render holds logic for three funciotnality 
export default class RoomRender extends Component {

     wallTexture = useLoader(TextureLoader, '/modelFiles/images/wall-texture.jpg');
     woodTexture = useLoader(TextureLoader, '/modelFiles/images/wood-texture.jpg'); 
    // TODO NOTE !!! Lines 6, 11, and 12 break NEARLY EVERY TEST. Make sure to only leave them in for demo reasons until mocking is complete.

    constructor(props) {
        super()
        this.state = {
            throwRay: this.throwRay,
            wallArrayList: React.createRef() //We create a react ref that holds the wall meshes that we can determine which walls that the raycaster has intersected with
        }
        this.wallRef = React.createRef();
        this.floorRef = React.createRef();
        this.state.wallArrayList.current = []; // intializes the wall array with nothing

    }



    //render walls and all items in the entity list
    render() {
        let wallList = this.props.wallList
        /**  ORIGINAL FUNCTIONAL Wall Rendering */
        // return (
        //     <>
        //         <mesh rotation={[-Math.PI / 2, 0, 0]} position={[wallList[0]?.wallLength/2, 0, wallList[1]?.wallLength/2]} userData={{randomStuff: 69}} onClick={() => { this.props.onClickHandler({})} } ref={this.floorRef} name="floor">
        //             <planeBufferGeometry args={[wallList[0]?.wallLength,wallList[1]?.wallLength]} />
        //             <meshBasicMaterial map={this.woodTexture}/>
        //         </mesh >
        //         {
        //             // For each wall mesh it is being created, we push each reference of the wall to the arraylist so we can determine which wall we have intersected
        //             // Also, we add in the wall number into our userdata that the three js has for our convenience.
        //             this.props.wallList.map(wall => 
        //                 <mesh ref={(wall) => this.state.wallArrayList.current.push(wall)} userData={{wallNumber: wall.wallNumber}} name={"Wall" + wall.wallNumber.low} key={wall.wallNumber}  onClick={() => { this.props.onClickHandler({}) }} rotation-y={wall.wallRotation} 
        //                 position={[
        //                     wall.wallLength/2 * Math.abs(Math.cos(wall.wallRotation)) + wall.posX * Math.abs(Math.sin(wall.wallRotation)),  // Math function to solve for center X pos of the wall
        //                     // getXByRotation(wall),
        //                     wall.wallHeight / 2.0, 
        //                     wall.wallLength/2 * Math.abs(Math.sin(wall.wallRotation)) + wall.posZ * Math.abs(Math.cos(wall.wallRotation)) // Math function to solve for center Z pos of the wall
        //                     // getZByRotation(wall)
        //                 ]}>
        //                     <planeBufferGeometry args={[wall.wallLength, wall.wallHeight]} />
        //                     <meshBasicMaterial map={this.wallTexture}/>
        //                 </mesh>
        //                 )
        //         }
        //         { 
        //             this.props.entityList.map(entity =>
        //                 <Cabinet
        //                     onClickHandler={this.props.onClickHandler}
        //                     key={Math.random() * 100 + 10}
        //                     cabData={entity}
        //                     room={this.props.room}
        //                 />
        //             )
        //         }
        //     </>
        // )
        /** NEW RENDER, Using modified Wall Scaling to make Cabinets and Walls of the correct sizes DELETE AND UNCOMMENT ABOVE WHEN CABINET SIZES ARE CORRECTED */
    
         return (
            <>
                 {/* <mesh rotation={[-Math.PI / 2, 0, 0]} position={[wallList[0]?.wallLength/2 * 3.28084, 0, wallList[1]?.wallLength/2 * 3.28084]} userData={{randomStuff: 69}} onClick={() => { this.props.onClickHandler({})} } ref={this.floorRef} name="floor"> */}
                 {/* <mesh rotation={[-Math.PI / 2, 0, 0]} position={[wallList[0]?.wallLength/2 * 3.28084, 0, wallList[1]?.wallLength/2 * 3.28084]} userData={{randomStuff: 69}} onClick={() => { this.props.onClickHandler({})} } ref={this.floorRef} name="floor"> */}
                     {/* <planeBufferGeometry args={[wallList[0]?.wallLength * 3.28084, wallList[1]?.wallLength * 3.28084]} /> */}
                     {/* <planeBufferGeometry args={[100, 100]}  /> */}
                    {/* <meshBasicMaterial color='gray'/> */}
                 {/* </mesh > */}
                 
                 <mesh rotation={[-Math.PI / 2, 0, 0]} position={[wallList[0]?.wallLength/2, 0, wallList[1]?.wallLength/2]} userData={{randomStuff: 69}} onClick={() => { this.props.onClickHandler({})} } ref={this.floorRef} name="floor">
                    <planeBufferGeometry args={[100,100]} />
                    {/* <planeBufferGeometry args={[wallList[0]?.wallLength * 3.28084, wallList[1]?.wallLength * 3.28084]} /> */}
                    <meshBasicMaterial map={this.woodTexture}/>
                </mesh >
                {
                    this.props.wallList.map(wall => 
                        <mesh ref={(wall) => this.state.wallArrayList.current.push(wall)} userData={{wallNumber: wall.wallNumber}} name={"Wall" + wall.wallNumber} key={wall.wallNumber}  onClick={() => { this.props.onClickHandler({}) }} rotation-y={wall.wallRotation} 
                        position={[
    
                                // =======New Code=========
                                // wall.wallLength/2 * Math.abs(Math.cos(wall.wallRotation)) + wall.posX * Math.abs(Math.sin(wall.wallRotation)),  // Math function to solve for center X pos of the wall
                            wall.posX * CONVERSION + (wall.wallLength* CONVERSION/2.0 * (Math.sin(wall.wallRotation+(Math.PI/2.0)))),
                            wall.wallHeight* CONVERSION / 2.0, 
                            // wall.wallLength/2 * Math.abs(Math.sin(wall.wallRotation)) + wall.posZ * Math.abs(Math.cos(wall.wallRotation)) // Math function to solve for center Z pos of the wall
                            wall.posZ * CONVERSION + (wall.wallLength* CONVERSION/2.0 * (Math.cos(wall.wallRotation+(Math.PI/2.0)))),

                                ///////////////////Old Code ///////////////////////////////////
                            // wall.wallLength * 3.28084 /2 * Math.abs(Math.cos(wall.wallRotation)) + wall.posX * 3.28084 * Math.abs(Math.sin(wall.wallRotation)),  // Math function to solve for center X pos of the wall
                            // wall.wallHeight * 3.28084 / 2.0, 
                            // wall.wallLength * 3.28084 /2 * Math.abs(Math.sin(wall.wallRotation)) + wall.posZ * 3.28084 * Math.abs(Math.cos(wall.wallRotation)) // Math function to solve for center Z pos of the wall
                        ]}>
                            <planeBufferGeometry args={[wall.wallLength * CONVERSION, wall.wallHeight * CONVERSION]} />
                            <meshBasicMaterial map={this.wallTexture}/>
                        </mesh>
                        )
                }
                { 
                    this.props.entityList.map(entity =>
                    {
                        return(<Cabinet
                            onClickHandler={this.props.onClickHandler}
                            key={Math.random() * 100 + 10}
                            cabData={entity}
                            room={this.props.room}
                        >
                            {/* // <door data={entity.attribute.door}></door> */}
                         </Cabinet>
                            )
                    }
                    )
                }
            </>
        )
        
    }
}
