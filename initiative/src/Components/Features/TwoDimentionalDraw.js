import { Component, useEffect, useRef, React } from "react";
import * as THREE from 'three'
import { ChakraProvider as div, FormControl, FormErrorMessage, FormLabel, IconButton, Spacer, Stack } from '@chakra-ui/react'
import {
    Modal,
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    Image,
    Input,
    Text,
    Flex,
    Box,
    allowMouseWheel
} from '@chakra-ui/react'
import { useState } from "react";
import Room from "../Core/Room";
import { makeAllCustomWalls } from "../Core/Wall"

// import Room from './Room'
// import { makeAllWalls } from "./Wall";
let modalComplete = false;
let roomID;
let numberOfWalls;



//////////////////////////////Test Zone//////////////////////////////

var renderer, scene, camera;

var line;
var MAX_POINTS = 500;
var drawCount;
var splineArray = [];

export class TwoDimentionalDraw extends Component {

    constructor(props) {
        super(props)

        this.state = {
            lineArray: []
        }
    }

    render(props) {

        // console.log("2d draw render props:")
        // console.log(this.props)
        return (

            <LaunchDrawer close2DView={this.props.close2DView} closeParentModal={this.props.closeParentModal} 
            roomRenderStuff={this.props.roomRenderStuff} setRoomID={this.props.setRoomID} setStateNumerOfWalls={this.props.setStateNumerOfWalls}
            setModalComplete={this.props.setModalComplete}/>
        )
    }
}





export function LaunchDrawer(props) {

    // required for modal
    const { isOpen, onOpen, onClose } = useDisclosure()
    // state for Modal
    const [ModalType, setModalType] = useState("Layout")
    let [LineArray, setLineArray] = useState([])
    const [RoomId, setRoomId] = useState()
    let drawingCanvas, canvasContext, fromXY, toXY, pushLine, tempP, startingDot = {x:0, y:0};
    const [LoadingState, setLoadingState] = useState(false)

    //how many pixels equals 1 metre
    const lengthScale = 50.0
    // boolean that descibes if the room has snapped to the begining of the first line and has been drawn and added to the line array
    let roomIsClose = false


    fromXY = {
        x: 0,
        y: 0
    }

    toXY = {
        x: 0,
        y: 0
    }

    pushLine ={
        fromX:0,
        fromY:0,
        toX:0,
        toY:0
    }


    // On load this will launch the modal to select layout
    // when modals are submitted this will NOT laucnh the modals
    useEffect(() => {
        onOpen()
        
    })

    function startDrawing() {
        // window.alert("yo")
        // setLoadingState(true)
        drawingCanvas = document.getElementById('wallCanvas')
        tempP= document.getElementById("mousecord")
        drawingCanvas.onclick = clickHandler
        // drawingCanvas.addEventListener("click", clickHandler);
        drawingCanvas.onmousemove = moveHandler
        canvasContext = drawingCanvas.getContext("2d")

        canvasContext.save()
        // Make it visually fill the positioned parent
        drawingCanvas.style.width = '100%';
        drawingCanvas.style.height = '90%';
        // ...then set the internal size to match
        drawingCanvas.width = drawingCanvas.offsetWidth;
        drawingCanvas.height = drawingCanvas.offsetHeight;
        roomIsClose = false

        // setLoadingState(false)
       
        
    }
    //is "working" but throwing some error that need to be fixed
    function clickHandler(mouse) {
        if(mouse.offsetX === undefined || mouse.offsetY === undefined )
        {
            mouse.offsetX = mouse.screenX
            mouse.offsetY = mouse.screenY
        }

        if (fromXY.x === 0) { //first click
            fromXY.x = mouse.offsetX
            fromXY.y = mouse.offsetY
            startingDot = {
                x: mouse.offsetX,
                y: mouse.offsetY
            }
            // console.log("event" + mouse.screenX + " " + mouse.screenY)
           
            // console.log("mouse x and y " + mouse.offsetX + " " + mouse.offsetY)
        }
        else if(roomIsClose === false) {
            if(mouse.offsetX === undefined || mouse.offsetY === undefined )
            {
                mouse.offsetX = mouse.screenX
                mouse.offsetY = mouse.screenY
            }
            if(isInStartingDot(mouse) ===false || LineArray.length < 2){
                if(mouse.offsetX === undefined || mouse.offsetY === undefined )
                {
                    mouse.offsetX = mouse.screenX
                    mouse.offsetY = mouse.screenY
                }
                toXY.x = mouse.offsetX
                toXY.y = mouse.offsetY

                // console.log("=======First Click====")
                drawClick()
                pushLine = {
                    fromX:  fromXY.x,
                    fromY:  fromXY.y,
                    toX:    toXY.x,
                    toY:    toXY.y
                }
                LineArray.push(pushLine)
                // fromXY.x = mouse.offsetX
                // fromXY.y = mouse.offsetY
                fromXY.x = pushLine.toX
                fromXY.y = pushLine.toY
            }
            else{
                toXY.x = startingDot.x
                toXY.y = startingDot.y
                // console.log("=======Second Click====")
                // console.log(fromXY.x +" " +fromXY.y)
                drawClick()
                pushLine ={
                    fromX:  fromXY.x,
                    fromY:  fromXY.y,
                    toX:    toXY.x,
                    toY:    toXY.y
                }
                LineArray.push(pushLine)
                roomIsClose = true

            }
            // console.log("In click ELSE")
        }
        if(LineArray.length > 1){
            showStartingDot()
        }

       
    }

    // displays a a small circle at the staring point of tghe firtst line
    function showStartingDot(){
        canvasContext.beginPath()
        canvasContext.arc(startingDot.x, startingDot.y, 10,0, 2*Math.PI,false)
        canvasContext.fillStyle = "#0000cc"
        canvasContext.fill()
        canvasContext.lineWidth = 2
        canvasContext.strokeStyle = "black"
        canvasContext.stroke()
    }


    // draws the lines when the mouse moves
    function moveHandler(mouse) {
        if(mouse.offsetX === undefined || mouse.offsetY === undefined )
        {
            mouse.offsetX = mouse.screenX
            mouse.offsetY = mouse.screenY
        }
        if (fromXY.x != 0 && isInStartingDot(mouse) === false && roomIsClose === false) {
            canvasContext.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height)
            reDrawLines()
            toXY.x = mouse.offsetX
            toXY.y = mouse.offsetY
            // console.log("In move IF")
            drawMove()
        }
        else if(isInStartingDot(mouse) === true && roomIsClose === false){
            snapToBegining()
        }
        tempP.innerText =// "X: "+ mouse.clientX + "\tY: " +mouse.clientY + 
        "\toffset X: "+ mouse.offsetX + "\tY: " +mouse.offsetY
         +"\n X:" +fromXY.x +"\tY:  "+ fromXY.y

    }

    //snaps the curretn line to the begining point
    function snapToBegining(){
        canvasContext.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height)
        canvasContext.beginPath()
        canvasContext.moveTo(fromXY.x, fromXY.y)
        canvasContext.lineTo(startingDot.x, startingDot.y)
        canvasContext.strokeStyle = "yellow";
        canvasContext.lineWidth = 10;
        canvasContext.stroke()
        canvasContext.closePath()
        reDrawLines()
        toXY.x = startingDot.x
        toXY.y = startingDot.y
    }

    //return true or false if it is within 20 pizels of the starting point
    function isInStartingDot(mouse) {
        if(mouse.offsetX === undefined || mouse.offsetY === undefined )
        {
            mouse.offsetX = mouse.screenX
            mouse.offsetY = mouse.screenY
        }

        if(mouse.offsetX < startingDot.x+10 && mouse.offsetX > startingDot.x-10 
            && mouse.offsetY < startingDot.y+10 && mouse.offsetY > startingDot.y-10 && LineArray.length > 1){
            return true
        }
        else {
            return false
        }
    }

    function reDrawLines(){
        LineArray.forEach(line => {
            canvasContext.beginPath()
            canvasContext.moveTo(line.fromX, line.fromY)
            canvasContext.lineTo(line.toX, line.toY)
            canvasContext.strokeStyle = "black";
            canvasContext.lineWidth = 10;
            canvasContext.stroke()
            canvasContext.closePath()
        });
        // if there are 2 or more lines show a dot at the starting point
        if(LineArray.length > 1){
            showStartingDot()
        }
        // console.log(LineArray)
    }

    //clears the canvas
    function clear() {
        fromXY = {
            x: 0,
            y: 0
        }

        toXY = {
            x: 0,
            y: 0
        }
        LineArray=[]
        canvasContext.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height)
        roomIsClose = false
        canvasContext.restore()
        document.getElementById("angle").innerHTML = "N/A"
        document.getElementById("length").innerHTML = "N/A"

    }

    //draws a line from first click to current mouse pos
    //will also update length and angle
    function drawMove() {
        canvasContext.beginPath()
        canvasContext.moveTo(fromXY.x, fromXY.y)
        canvasContext.lineTo(toXY.x, toXY.y)
        canvasContext.strokeStyle = "yellow";
        canvasContext.lineWidth = 10;
        canvasContext.stroke()
        canvasContext.closePath()
        setLength()
        // there is a line in the array show the angle between them
        if(LineArray.length > 0){
            setAngle()
            
        }

    }

    //wll set the angle span to the proper angle
    function setAngle() {
        let angleSpan = document.getElementById("angle")
        let prevline = LineArray[LineArray.length-1]
        // console.log( "prevline: " + prevline)
        let prevLineLengthSqr, curLineLengthSqr, hypotenuseSqr, curAngle
        prevLineLengthSqr = Math.pow((Math.abs(prevline.fromX - prevline.toX)),2) +
                            Math.pow((Math.abs(prevline.fromY - prevline.toY)),2);
                            // console.log( "prevLineLeng: " + prevLineLengthSqr)
        curLineLengthSqr =  Math.pow((Math.abs(fromXY.x - toXY.x)),2) +
                            Math.pow((Math.abs(fromXY.y - toXY.y)),2);
                            // console.log( "curlinelength: " + curLineLengthSqr)
        hypotenuseSqr =     Math.pow((Math.abs(prevline.fromX - toXY.x)),2) +
                            Math.pow((Math.abs(prevline.fromY - toXY.y)),2);
                            // console.log( "hypolength: " + hypotenuseSqr)
        curAngle = prevLineLengthSqr+curLineLengthSqr-hypotenuseSqr
        // console.log( "curAngle add: " + curAngle)
        curAngle = curAngle / (2 * Math.sqrt(prevLineLengthSqr) * Math.sqrt(curLineLengthSqr))
        // console.log( "curAngle div: " + curAngle)
        curAngle = Math.acos(curAngle)
        // console.log( "curAngle acos: " + curAngle)
        curAngle = curAngle * 180 / Math.PI
        // console.log( "curAngle to deg: " + curAngle)
        angleSpan.innerHTML = curAngle.toFixed(1)
        // console.log( "curAngle: " + curAngle)

    }

    //wll set the length span to the proper length
    function setLength() {
        // console.log("in setlength")
        let lengthSpan = document.getElementById("length")
        let curLineLength
        curLineLength = Math.pow((Math.abs(fromXY.x - toXY.x)),2) +
                        Math.pow((Math.abs(fromXY.y - toXY.y)),2);
        curLineLength = Math.sqrt(curLineLength)/lengthScale
        lengthSpan.innerHTML = curLineLength.toFixed(1)
    }

    //makes line stop moving and adds to line array
    function drawClick() {
        // console.log("FromXY " + fromXY.x +" "+ fromXY.y + " ToXY " + toXY.x + " " +toXY.y)
        canvasContext.beginPath()
        canvasContext.moveTo(fromXY.x, fromXY.y)
        canvasContext.lineTo(toXY.x, toXY.y)
        canvasContext.strokeStyle = "black";
        canvasContext.lineWidth = 10;
        canvasContext.stroke()
        canvasContext.closePath()
    }

    //turns on room, doesn't close drawer
    function submitHandler(props) {
        onClose()



        TurnOnRoom(LineArray, lengthScale, props)
    }

    //doesnt close drawer
    async function cancelHandler(){
        await onClose()
    }


    /**
        * this return creates the basic modal, and selects which of the previous functions are to be used to fill in the body of the modal.
        * Switch drawer to layoutui and just return canvas in this file
        */
    return (
        <div style={{backgroundColor: "#404040"}}  data-testid="CanvasParent">
            <Drawer  onClose={onClose} isOpen={isOpen} size={'full'} closeOnOverlayClick={false} closeOnEsc={false}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader>{` Full drawer contents | Angle: `}<span data-testid="Angle" id="angle">N/A</span>{` Length: `}<span id="length" data-testid="Length">N/A</span>{` metres`}</DrawerHeader>
                    <DrawerBody
                        border='2px'
                        borderRadius='20px'
                        p='2px'
                        
                        borderColor='#aaaaaa'>
                        {/* <Box
                          

                            onClick={() => {

                            }}
                        > */}
                        {/* <DrawingCanvas /> */}

                        <canvas ref={drawingCanvas} id="wallCanvas" data-testid="TwoDimensionalCanvas"></canvas>

                        <Flex>
                            <Button
                                colorScheme='red'
                                onClick={() => {
                                    clear()
                                }}
                            >Clear</Button>
                            <Button
                                // isLoading = {LoadingState}
                                colorScheme='green'
                                ml={3}
                                onClick={() => {
                                    startDrawing()
                                }}
                            >Start Drawing</Button>
                            <p data-testid="mousecords" id="mousecord">Nothing</p>
                            <Spacer />
                            <Button variant='ghost' mr={3} onClick={props.close2DView}>Cancel</Button>
                            <Button colorScheme='blue' onClick={() => {
                                submitHandler(props)
                                props.close2DView()
                                
                            }}>Submit</Button>
                        </Flex>
                        {/* </Box> */}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            {/* <RenderRoom/> */}
        </div>
    )
}

// does render room, does not close drawer
async function TurnOnRoom(lineArray, lengthScale, props) {
  
        let tempRoomID = window.prompt("what is the room id")
    
    

    //Just for passing the rests
    if (tempRoomID === undefined || tempRoomID === null)
    {
        tempRoomID = 9999    
    }
    const returnedWalls = await makeAllCustomWalls(tempRoomID, lineArray, lengthScale) // makes walls from the line array

    numberOfWalls = lineArray.length
    // console.log(numberOfWalls)
    roomID = returnedWalls.roomID
   

    // console.log("props in turn on room: ")
    // console.log(props)
    await props.setStateNumerOfWalls(numberOfWalls)
    await props.setRoomID(roomID)
    props.closeParentModal()
    modalComplete = true;
    props.roomRenderStuff()
}

// function RenderRoom(props){
//     console.log(numberOfWalls)
//     console.log()
//     if (modalComplete === true) {
//         return (
//             <div className="App" >
//                 <Room roomID={roomID} numberOfWalls={numberOfWalls} />
//             </div>
//         )
//     }
// }
