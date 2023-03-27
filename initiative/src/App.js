import './App.css';
// import Room from './Components/Shared/Models/Room';
import Room from './Components/Core/Room';
import { ChakraProvider } from '@chakra-ui/react'
import {
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button
} from '@chakra-ui/react'
import InitiativeHome from './Components/Core/InitiativeHome'
let buttonClicked = false;

function App() {

  // const { isOpen, onOpen, onClose } = useDisclosure()

  
  

  let Cabinet1 = {
    cabinetID: 1,
    pos: [-10, 0, 0],
    modelPath: "../ModelFiles/SimpleCab.obj"
  }
  let Cabinet2 = {
    cabinetID: 1,
    pos: [10, 0, 0],
    modelPath: "../ModelFiles/SimpleCab.obj"
  }
  
  // const [ref, bounds] = useMeasure({ polyfill: ResizeObserver })
  // let Cabinet2 = new Cabinet({ cabinetID: 2 })
  return(
    <ChakraProvider>
      <InitiativeHome/>
    </ChakraProvider>
  )
  // return RoomLayoutUI.chooseLayoutModal
  // return (
    // <ChakraProvider>
    //   <Button onClick={onOpen}>Open Modal</Button>
    //   <Modal isOpen={isOpen} onClose={onClose}>
    //     <ModalOverlay />
    //     <ModalContent>
    //       <ModalHeader>Modal Title</ModalHeader>
    //       <ModalCloseButton />
    //       <ModalBody>
    //         <p> THIS IS THE MIDDLE OF THE MODAL</p>
    //       </ModalBody>

    //       <ModalFooter>
    //         <Button colorScheme='blue' mr={3} onClick={onClose}>
    //           Close
    //         </Button>
    //         <Button variant='ghost' onClick={TurnOnRoom}>Secondary Action</Button>
    //       </ModalFooter>
    //     </ModalContent>
    //   </Modal>
    //   <RenderRoomStuff/>  
    // </ChakraProvider>
  // );
}

export default App;

/***
 * temp function to render the contents of the room after Modal is closed
 */
// function RenderRoomStuff(props){
//   if (buttonClicked == true){
//     return (
//       <div className="App" >
//           <Room RoomID={5}/>
//         </div>
//     )
//   }
// }

function TurnOnRoom(props){
  buttonClicked = true
}