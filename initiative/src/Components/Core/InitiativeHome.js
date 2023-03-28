import { Component, useEffect } from "react";
import { ChakraProvider as div, FormControl, FormErrorMessage, FormLabel, IconButton, Spacer, Stack } from '@chakra-ui/react'
import {
    Modal,
    useDisclosure,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Image,
    Input,
    Text,
    Flex,
    Box
} from '@chakra-ui/react'
import { useState } from "react";
import Room from './Room'
import { makeAllWalls } from "./Wall";
import { TwoDimentionalDraw } from '../Features/TwoDimentionalDraw.js';
import PlayerView from './PlayerView'
let modalComplete = false;
let roomID ;
let numberOfWalls;
let make2DViewVisible = false

const DMNAMES=[
    'OLIVER',
    'ERIC',
    'JAYDEN',
    'DALLAS'
]

const PLAYERNAMES=[
    'OLIVER',
    'ERIC',
    'JAYDEN',
    'DALLAS',
    'ABBY',
    'KATHERINE',
    'JORDON'
]

const MODALTYPES ={
    PlayerModal: 'PlayerModal',
    DMModal: 'DMModal'
}

export default class InitiativeHome extends Component {

    constructor() {
        super()
    }

    render() {
        return (
            <div data-testid="ChooseLayoutModal">
                <LaunchModal />
            </div>
        )
    }
}

export function set2DViewVisibility(isVisible){

    make2DViewVisible = isVisible
   
}



function LaunchModal() {
    // required for modal
    const { isOpen, onOpen, onClose } = useDisclosure()
    // state for Modal
    const [ModalType, setModalType] = useState("Layout")
    // length state values
    const [dmName, setDMName] = useState()
    // width state values
    const [playerName, setPlayerName] = useState()
    // Validation state values
    const [noError, setError] = useState(true)

    const [is2DViewVisible, set2DView] = useState(false)
    const [isParentModalVisible, setParentModalVisibility] = useState(true)

    // On load this will launch the modal to select layout
    // when modals are submitted this will NOT laucnh the modals
    useEffect(() => {
        if (!modalComplete) {
            onOpen()
        }
    })

    /** 
     * function that opent the choose layout option Modal
     * modal will (*Currently*) include only 2 buttons with an image of what th room latout will be
     * the buttons will change the content of the modals for more info on the rooms
     */
    function ChooseLayoutModal() {
        return (
            <ModalContent maxW="40em">
                <ModalHeader fontSize={"3xl"} pb="0">Choose Layout</ModalHeader>
                <ModalBody pb="2em">
                    <Text pb="1em" fontSize={"md"}> Please Select a Room Layout from the options below</Text>
                    <Flex>
                        <Spacer />
                        <Box
                            as='button'
                            border='2px'
                            borderRadius='20px'
                            p='2px'
                            mx='30px'
                            borderColor='#aaaaaa'
                            bg='#e0e0e0'
                            boxSize='m'
                            px='25px'
                            onClick={() => {
                                setModalType(MODALTYPES.DMModal)
                            }}
                        >
                            <Image
                                boxSize='150px'
                                
                                src="./dungeonMaster.svg"
                                borderRadius='20px'
                            />
                            DM
                        </Box>
                        <Spacer />
                        <Box
                            as='button'
                            border='2px'
                            borderRadius='20px'
                            p='2px'
                            borderColor='#aaaaaa'
                            bg='#e0e0e0'
                            boxSize='m'
                            onClick={() => {
                                setModalType(MODALTYPES.PlayerModal)
                            }}
                        >
                            <Image
                                boxSize='200px'
                                src="./nat1.svg"
                                borderRadius='20px'
                            />
                            Player
                        </Box>
                        <Spacer />
                        <Spacer />
                    </Flex>
                </ModalBody>
            </ModalContent>
        )

    }


    // const DMNAMES=[
    //     'OLIVER',
    //     'ERIC',
    //     'JAYDEN',
    //     'DALLAS'
    // ]
    function onSubmitDM(e){
        if (dmName && DMNAMES.includes(dmName)){
            window.alert("Dm Name: "+dmName)
            SubmitMethod(dmName)
        } else {
            setError(false)
        }
    }

    /**
     * this function wil change the contents of the modal to the 
     * modal will include 2 buttons:
     * Cancel which returns to the choose layout Modal
     * Submit which runs validation on the values and show error messages if needed
     *  -If no errors will launch a room with proper dimensions
     * 
     */
    function DMModal() { 
        return(

            <form onSubmit={e=>{e.preventDefault();}}>
            <ModalContent>
                <ModalHeader fontSize={'3xl'} pb="0">DM Modal</ModalHeader>
                {/* <ModalCloseButton /> should be deleted when finished */}
                <ModalBody>

                    <Text fontSize={'md'} pb='1em'> Pleaase Enter Your Name</Text>
                    <Input type="text" value={dmName} onChange={(e) => { setDMName(e.target.value.toUpperCase()) }}
                    placeholder='Name' width='250px' borderColor={'gray.500'}></Input>
                    {noError === false ? (
                        <div style={{ color: "#ff0000" }}>
                            Incorrect Name
                        </div>) : <p></p>
                    }
                </ModalBody>

                <ModalFooter>

                <Button variant='ghost' mr={3} onClick={() => { // this Button will take you back to the previous page, as well as clearing the Length and Width and the Errors
                        setError(true)
                        setDMName('')
                        setModalType("Layout")
                    }}>Cancel</Button>
                    <Button colorScheme='blue' type="submit" onClick={(e)=>onSubmitDM(e)}>Submit</Button>

                </ModalFooter>
            </ModalContent>
        </form>
        )
    }

    function onSubmitPlayer(e){
        // window.alert(PLAYERNAMES.includes(playerName))

        if (playerName && PLAYERNAMES.includes(playerName)){
            window.alert("Player Name: " + playerName)
            SubmitMethod(playerName)
        } else {
            setError(false)
        }
    }

    /**
     * this function wil change the contents of the modal to the 
     * modal will include 2 buttons:
     * Cancel which returns to the choose layout Modal
     * Submit which runs validation on the values and show error messages if needed
     *  -If no errors will launch a room with proper dimensions
     * 
     */
    function PlayerModal() {
        return(
            <form>
            <ModalContent>
                <ModalHeader fontSize={'3xl'} pb="0">Player Modal</ModalHeader>
                {/* <ModalCloseButton /> should be deleted when finished */}
                <ModalBody>
                    <Text fontSize={'md'} pb='1em'> Pleaase Enter Your Name</Text>
                    <Input type="text" value={playerName} onChange={(e) => { setPlayerName(e.target.value.toString().toUpperCase()) }} 
                    placeholder='Name' width='250px' borderColor={'gray.500'}></Input>
                    {noError === false ? (
                        <div style={{ color: "#ff0000" }}>
                            Invalid Name
                        </div>) : <p></p>
                    }
                </ModalBody>

                <ModalFooter>
                <Button variant='ghost' mr={3} onClick={() => { // this Button will take you back to the previous page, as well as clearing the Length and Width and the Errors
                        setError(true)
                        setPlayerName('')
                        setModalType("Layout")
                    }}>Cancel</Button>
                    <Button colorScheme='blue' type='submit' onClick={(e) => onSubmitPlayer(e) }>Submit</Button>
                </ModalFooter>
            </ModalContent>
        </form>
        )
    }

    /**
     * This method will fire when the modal's forms have been filled out with valid information. It will then reset and close the modal, and begin rendering the rest of the room;
     */
    async function SubmitMethod(){
        if(ModalType === MODALTYPES.DMModal)
        {
            // await TurnOnRoom(dmName,dmName) // begin Rendering the Room, using only the Length as the measurements
            await TurnOnRoom(MODALTYPES.DMModal)
        }
        else if (ModalType === MODALTYPES.PlayerModal)
        {
            await TurnOnRoom(MODALTYPES.PlayerModal)
            // await TurnOnRoom(dmName,playerName) // begin Rendering the Room, using both the Length and the Width as measurements
        }
        else
        {
            window.alert("ERROR Am sending to Player View")
            await TurnOnRoom(MODALTYPES.PlayerModal)
        }
        onClose() // close the modal.
        setModalType("Layout") // Reset the Modal to layout mode, incase you get back into it somehow.
    }

    function open2DView() {
        
        return (
            <TwoDimentionalDraw close2DView={close2DView} closeParentModal={closeModal} 
            roomRenderStuff={RenderRoomStuff}  setStateNumerOfWalls={setStateNumerOfWalls} setRoomID={setRoomID}
            />
        )
        
    }

    async function setStateNumerOfWalls(num)
    {
        
        numberOfWalls = num
       
    }
    async function setRoomID(num)
    {
      
        roomID = num
       
    }

    function closeModal(){

        modalComplete = true
        onClose() // close the modal.
        setParentModalVisibility(false)        
        
    }
    
    function close2DView() {
        
        set2DView(false)
        modalComplete = false
        
    }

    /**
     * this return creates the basic modal, and selects which of the previous functions are to be used to fill in the body of the modal.
     */
    return (
        
        <div style={{backgroundColor: "#404040"}}>
            <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} closeOnEsc={false} size={'xl'}>
                <ModalOverlay />

                {ModalType != MODALTYPES.DMModal && ModalType != MODALTYPES.PlayerModal && // If statements that will fill in the body of the modal, based on the State value ModalType. This one is default
                    ChooseLayoutModal()
                }
                {ModalType === MODALTYPES.DMModal &&
                    DMModal()
                }
                {ModalType === MODALTYPES.PlayerModal &&
                    PlayerModal()
                }
            </Modal>

            {modalComplete &&
                <RenderRoomStuff/>
            }
  
        </div>
    )
   
}


/**
 * This method will run the Logic and Database code, and then activate the Rendering of the Room
 * TODO Maybe add in a Loading Modal to the modal above, based on modalComplete?
 * @param {double} length 
 * @param {double} width 
 */
async function TurnOnRoom(modalType){
    
    // let tempRoomID = window.prompt("what is the room id")
    
    // const theReturnedStuff = await makeAllWalls(length,width,tempRoomID)

    // numberOfWalls = theReturnedStuff.WallArray.length
    // roomID = theReturnedStuff.roomID
    modalComplete = true
}

/**
 * This method will wait for the Modal to be marked as complete. Once that has happened, the rest of the room will render
 * @returns 
 */
function RenderRoomStuff(props) {

  
    // let ID = roomID
    // let walls = numberOfWalls
    window.alert(modalComplete)
  
    if (modalComplete === true) {
      
        return (
            <div className="App" >
                <PlayerView />
            </div>
        )
    }
}
