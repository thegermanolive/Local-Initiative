import React from 'react';
import UI from './UI';
import { useState, useRef} from "react";
import { OrbitControls,  PerspectiveCamera,Environment, CameraControls } from '@react-three/drei'
import {Canvas} from '@react-three/fiber'
import RoomRender from './RoomRender';
import { getAllCabinets, updateCabinet } from '../../Utilities/CabinetDB';
import { getAllWalls } from '../../Utilities/RoomDB';
import { CubeSpinner, ImpulseSpinner, MetroSpinner, RotateSpinner} from "react-spinners-kit";
import { Container, Box, SimpleGrid, Center, Text, Hide } from '@chakra-ui/react'


class PlayerView extends React.Component {

    constructor(props){
        super();
        this.state = {
            wallList: [],
            entityList: [],
            currentSelected: {},
            didInitialRender: false
        }
        this.RoomRenderRef = React.createRef();
        this.cameraRef = React.createRef();
        this.rayRef = React.createRef();

        this.roomID = props.roomID;
        this.numberOfWalls = props.numberOfWalls
    }

    render(){
        window.alert('in render fuction in Player View')

        return(
            <div>
                <h1>testing</h1>
            </div>
        
            )

    }
    

    
    /*
     * This method will set th ecurrentSelected Cabinet variable in the state, 
     * which will rerender the whole UI
     */
    // setSelectedCabinet = (selectedCab) =>{

    //     //check if the selected object is a cabinet 

    //         if(selectedCab.cabinetID)
    //         {

    //             this.setState({currentSelected: selectedCab})
    //         }
    //         else{
    //             if(this.state.currentSelected != {})
    //             {
    //                 this.setState({currentSelected: {}})
    //             }
    //         }
    //     return true
    //        //if it is a instance of an cabinet than create an instancre of an attribute menu
    //        //else if there is a instance of an attribute menu in the room than make it null
        
    // }

    // async updateDBWithList(cabList)
    // {
    //     const returnList = []

    //     for (const cab of cabList)
    //     {
    //         const outputCab = await updateCabinet(cab)
    //         returnList.push(outputCab)
    //         cab.id = outputCab?._identity.low
    //         cab._labels = outputCab?._labels
    //         cab.node = outputCab;
    //     }

    //     return returnList
    // }

    // componentDidUpdate()
    // {
    //     let ReturnList = this.updateDBWithList(this.state.entityList);
 
    // }

    // // Loop through re-rendering walls untill you have the number of walls that were made on creation
    // CheckWallRendering(){
    //     if(this.state.didInitialRender === false){
    //         getAllWalls(this.roomID).then(res => {
    //             this.setState({wallList: res.records
    //                 .map((e)=>{
    //                 return e._fields[0].properties
    //             })
                
    //         })
    //         })
    //         if(this.state.wallList.length === this.numberOfWalls)
    //         {
    //             this.setState({didInitialRender: true})
    //         }
    //     }
    // }
       
    // render(){
    //     this.CheckWallRendering()
    //     if (this.state.didInitialRender === true)
    //     {
    //         return(
    //             <div className="Room">
                    
    //                 <Canvas shadows style={{ background: "#171717" }}  gl={{ antialias: true}}   colorManagement
    //       shadowMaplinear>
    //                     <raycaster ref={this.rayRef}/>
    //                     <PerspectiveCamera makeDefault ref={this.cameraRef} position={[-2,12,10]}  />
    //                     {/* <OrbitControls /> */}
    //                     <CameraControls zoom={1}/>
    //                     <RoomRender room={this} entityList={this.state.entityList} wallList={this.state.wallList} ref={this.RoomRenderRef}
    //                     onClickHandler={this.setSelectedCabinet}
    //                     />
    //                     <directionalLight color='white' position={[1000,0,1000]}/>
    //                     <spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 15, 10]} castShadow />
    //                     <pointLight intensity={1.0} position={[10, 10, 10]} />
    //                     <ambientLight intensity={0.3} color="#FFFFFF" />
    //                     <Environment
    //         files="/modelFiles/env/unfinished_office_2k.hdr"
    //         background
    //         blur={0.9}
    //       />
    
    //                 </Canvas>
    //                 <UI Room={this}/>
    //             </div>
    //         );
    //     }
    //     else
    //     {
    //         // This loading screen fires either when we are still creating the walls, or the rendering of the walls
    //         // failed for some reason :)
    //         return(
    //             <Container bg='#404040' h='100vh' maxW='100vw'>
    //                 <Center>
    //                         <SimpleGrid columns={1} text padding='20px' h='100vh'>
    //                             <Center>
    //                                 <Box padding='20px' color='white'>
    //                                     <Center>
    //                                         <RotateSpinner size={50} color="#FFFFFF"></RotateSpinner>
    //                                     </Center>
    //                                     <Text fontSize='2xl' padding='20px'>Please wait as we process your room...</Text>
    //                                     <Text fontSize='2xl'>Wall Loading {(this.state.wallList.length/this.numberOfWalls)*100}% Done</Text>
    //                                 <Text fontSize='2xl'>Wall Loading {(this.numberOfWalls)}% Done</Text>

    //                                 {/* do not remove this line as it is just for testing*/}
    //                                 <div data-testid="numOfWallsRenderedOnscreen">{(this.numberOfWalls)}</div>
    //                                 </Box>
    //                             </Center>
    //                         </SimpleGrid>

    //                 </Center>
    //             </Container>
    //         )
    //     }
    // }
    
}

export default PlayerView;

