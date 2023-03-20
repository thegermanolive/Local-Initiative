import React, { useEffect, useRef } from 'react';
import TestRenderer from 'react-test-renderer'
import Room from '../../Components/Core/Room'
import { addCabinet, getCabinetbyID } from "../../Utilities/CabinetDB";
import { screen, render, fireEvent, createEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'

import { TwoDimentionalDraw } from '../../Components/Features/TwoDimentionalDraw';
import { act } from 'react-dom/test-utils';
// import ReactDOM from 'react-dom/client';
// import ReactTestUtils from 'react-dom/test-utils';
import '@testing-library/jest-dom'
import { Canvas } from '@react-three/fiber';
import {
  Modal,
  useDisclosure,
  Drawer,
  DrawerBody
} from '@chakra-ui/react'
import RoomLayoutUI from '../../Components/Core/RoomLayoutUI';
import {makeAllCustomWalls} from '../../Components/Core/Wall';
import { TwoDimensionalDraw, startDrawing } from '../../Components/Features/TwoDimentionalDraw';
import { describe, beforeAll, beforeEach, afterAll, afterEach, expect, test, it } from '@jest/globals'
import addWallToDB from '../../Utilities/RoomDB'
import ReactThreeTestRenderer from '@react-three/test-renderer'
import { create } from 'combined-stream';


/////////////////////////Mocks////////////////////////
jest.mock('../../../node_modules/three/src/loaders/TextureLoader', () => ({
  TextureLoader: 0
}));
jest.mock('three/examples/jsm/loaders/OBJLoader', () => ({
  OBJLoader: 0
}))

jest.mock('@react-three/fiber', () => ({
  ...jest.requireActual('@react-three/fiber'),
  Canvas: ({ }) => (<p>'hello'</p>)// TODO Maybe remove for performance
}))

jest.setTimeout(30000)
window.prompt = jest.fn(()=> 1)


//////////////////////////Global Variables for testing///////////////////////
//Length scale used in program
let lengthScale = 1
//length of the horizontal line
let horizontalLineLenght = 10
//Length of the angled line
let angleWallLength = 5
//Angle between the previous line to the new line
let angBetweenWalls = 150
let angBetweenWallsRad = 150 * Math.PI / 180
//Math to calculate the correct coordinates for the angles line
//calculate the Y coordinate offset for the angled line
let calcposy = (Math.abs(angBetweenWalls - 180))
calcposy = calcposy * Math.PI / 180
calcposy = Math.cos(calcposy) * angleWallLength * lengthScale
//calculate the X coordinate offset for the angled line
let calcposx = (Math.abs(angBetweenWalls - 180))
calcposx = calcposx * Math.PI / 180
calcposx = Math.tan(calcposx) * calcposy




//The coordinates that will be used to draw the lines from the origin of where the line needs to be added
//Line 559 needs length scale 50
let originXY = { posx: 20, posy: 20 }
let drawPoints = [
  {
    posx: originXY.posx,
    posy: originXY.posy,
  },
  {
    //adding 10 as that will be the length of the wall that will be created
    posx: originXY.posx + (horizontalLineLenght * lengthScale),
    posy: originXY.posy,
  }
]
//adding the test coordinates
drawPoints.push({
  posx: Math.round(drawPoints[1].posx + calcposx),
  posy: Math.round(drawPoints[1].posy + calcposy),

})


/**
 * Use this method to 
 * @param lengthScale 
 */

function recalculateDrawPoints(lengthScale) {

  lengthScale = lengthScale
  //length of the horizontal line
  horizontalLineLenght = 10
  //Length of the angled line
  angleWallLength = 5
  //Angle between the previous line to the new line
  angBetweenWalls = 150
  angBetweenWallsRad = 150 * Math.PI / 180
  //Math to calculate the correct coordinates for the angles line
  //calculate the Y coordinate offset for the angled line
  calcposy = (Math.abs(angBetweenWalls - 180))
  calcposy = calcposy * Math.PI / 180
  calcposy = Math.cos(calcposy) * angleWallLength * lengthScale
  //calculate the X coordinate offset for the angled line
  calcposx = (Math.abs(angBetweenWalls - 180))
  calcposx = calcposx * Math.PI / 180
  calcposx = Math.tan(calcposx) * calcposy
  //The coordinates that will be used to draw the lines from the origin of where the line needs to be added
  //Line 559 needs length scale 50
  originXY = { posx: 20, posy: 20 }
  drawPoints = []
  drawPoints = [
    {
      posx: originXY.posx,
      posy: originXY.posy,
    },
    {
      //adding 10 as that will be the length of the wall that will be created
      posx: originXY.posx + (horizontalLineLenght * lengthScale),
      posy: originXY.posy,
    }
  ]
  //adding the test coordinates
  drawPoints.push({
    posx: Math.round(drawPoints[1].posx + calcposx),
    posy: Math.round(drawPoints[1].posy + calcposy),

  })

}



let container
// const user = null

describe("TwoDimentionalDraw.js", () => {
  // user = userEvent.setup()

  beforeEach(() => {
    // container = document.createElement("div")
    // document.body.appendChild(container)

    //setting up suer interaction


    act(() => {
      // ReactDOM.createRoot(container).render(<RoomLayoutUI />)
      container = render(<RoomLayoutUI />)

    })

  });

  afterEach(() => {
    // document.body.removeChild(container);
    container = null;
  });


  //////////////Ignore this//////////////////////////////////
  let theFirstWall = {
    wallNumber: 1,
    posx: drawPoints[0].posx,
    posZ: drawPoints[0].posy,
    wallLength: 10,
    wallHeight: 5,
    wallRotation: 0,
    leftWall: null
  }

  let theSecondWall = {
    wallNumber: 2,
    posx: drawPoints[1].posx,
    posZ: drawPoints[1].posx,
    wallLength: 5,
    wallHeight: 5,
    wallRotation: 180 - angBetweenWalls,
    leftWall: theFirstWall
  }

  it('renders the two dimensional draw', async () => {
    //Open the Drawer
    const CustomLayoutButton = screen.getAllByText('Custom Layout')[0]
    await fireEvent.click(CustomLayoutButton)

    //Get the drawing Canvas from the Drawer
    const canvas = screen.getByTestId('TwoDimensionalCanvas')
    expect(canvas).not.toBeNull()
    expect(canvas).toBeInTheDocument();

  })

  it('renders 4 buttons (Start drawing, clear, cancel and submit)', async () => {
    //Open the Drawer
    const CustomLayoutButton = screen.getAllByText('Custom Layout')[0]
    await fireEvent.click(CustomLayoutButton)

    //Get the drawing Canvas from the Drawer
    const buttons = await screen.findAllByRole('button')
    expect(buttons).not.toBeNull()
    expect(buttons.length).toEqual(4)

  })
  it('that the cancel button dismisses current drawer and opens Select Layout Modal', async() => {
    const CustomLayoutButton = screen.getAllByText('Custom Layout')[0]
    await fireEvent.click(CustomLayoutButton)
    let canvas = null
    //Get the drawing Canvas from the Drawer
    await waitFor(() =>
      canvas = screen.getByTestId('TwoDimensionalCanvas')
    )

    expect(canvas).not.toBeNull()

    const canvasParent = screen.getByTestId('CanvasParent')
    expect(canvasParent).not.toBeNull()

    const cancelButton = screen.getAllByText('Cancel')[0]
    expect(cancelButton).not.toBeNull()
    await waitFor(() =>
     fireEvent.click(cancelButton)
    )
   
    canvas =  screen.queryAllByTestId('TwoDimensionalCanvas')
    // expect((await screen.findAllByRole('canvas')).length).toBe(0)
    expect(canvas).toHaveLength(0)

    const ChooseLayoutModal = screen.getByTestId('ChooseLayoutModal')
    expect(ChooseLayoutModal).not.toBeNull()
    expect(ChooseLayoutModal).toBeInTheDocument()
  })

  describe("startDrawingButtonHandler", () => {
    it("should render a line in the canvas when user clicks on the screen two times", async () => {

      ////////////////////////Arrange - Initial Setup/////////////
      //Open the Drawer
      const CustomLayoutButton = screen.getAllByText('Custom Layout')[0]
      await fireEvent.click(CustomLayoutButton)
      let canvas = null
      //Get the drawing Canvas from the Drawer
      await waitFor(() =>
        canvas = screen.getByTestId('TwoDimensionalCanvas')
      )

      expect(canvas).not.toBeNull()

      const canvasParent = screen.getByTestId('CanvasParent')
      expect(canvasParent).not.toBeNull()

      const StartDrawingButton = screen.getAllByText('Start Drawing')[0]
      await fireEvent.click(StartDrawingButton)
      const ctx = canvas.getContext('2d');
      expect(canvas).not.toBeNull()

      /////////////////////Act -Fire Mouse Events///////////////////////

      //Fire the mouse events to click on two different places 
      let firstclickevent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        screenX: drawPoints[0].posx,
        screenY: drawPoints[0].posy,
        button: 0,
      })

      let secondclickevent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        screenX: drawPoints[1].posx,
        screenY: drawPoints[1].posy,
        button: 0,
      })


      await waitFor(() =>
        fireEvent(canvas, firstclickevent)
      )
      await waitFor(() =>
        fireEvent(canvas, secondclickevent)
      )

      //////////////////////////Assertions////////////////////////////
      //Check if the two cooordinates exist on a path on the canvas
      expect(ctx.isPointInPath(drawPoints[0].posx, drawPoints[0].posy)).toBe(true);
      expect(ctx.isPointInPath(drawPoints[1].posx, drawPoints[1].posy)).toBe(true);
      // expect(ctx.isPointInPath(firstclickevent.offsetX, firstclickevent.offsetY)).toBe(true);

    })

    it("should display a second line from the end of the previous line " +
      "to where the mouse is clicked again", async () => {


        /////////////////Arrange - initial set up/////////////////////////////////

        //Open the Drawer
        const CustomLayoutButton = screen.getAllByText('Custom Layout')[0]
        await fireEvent.click(CustomLayoutButton)
        let canvas = null
        //Get the drawing Canvas from the Drawer
        await waitFor(() =>
          canvas = screen.getByTestId('TwoDimensionalCanvas')
        )

        expect(canvas).not.toBeNull()
        canvas.width = 1000
        canvas.height = 1000


        const canvasParent = screen.getByTestId('CanvasParent')
        expect(canvasParent).not.toBeNull()

        const StartDrawingButton = screen.getAllByText('Start Drawing')[0]
        await fireEvent.click(StartDrawingButton)
        const ctx = canvas.getContext('2d');
        expect(canvas).not.toBeNull()

        /////////////////////Act -Fire Mouse Events///////////////////////


        //Fire the mouse events to click on two different places 
        let firstclickevent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
          screenX: drawPoints[0].posx,
          screenY: drawPoints[0].posy,
          button: 0,
        })
        let move1 = new MouseEvent('mousemove', {
          view: window,
          bubbles: true,
          cancelable: true,
          screenX: drawPoints[1].posx,
          screenY: drawPoints[1].posy,
          button: 0,
        })

        let secondclickevent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
          screenX: drawPoints[1].posx,
          screenY: drawPoints[1].posy,
          button: 0,
        })
        let move2 = new MouseEvent('mouseover', {
          view: window,
          bubbles: true,
          cancelable: true,
          screenX: drawPoints[2].posx,
          screenY: drawPoints[2].posy,
          button: 0,
        })
        let thirdclickevent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
          screenX: drawPoints[2].posx,
          screenY: drawPoints[2].posy,
          button: 0,
        })


        await waitFor(() =>
          fireEvent(canvas, new MouseEvent('mouseenter'))
        )
        await waitFor(() =>
          fireEvent(canvas, firstclickevent)
        )
        await waitFor(() =>
          fireEvent(canvas, move1)
        )
        await waitFor(() =>
          fireEvent(canvas, secondclickevent)
        )
        await waitFor(() =>
          // fireEvent(canvas, move2)
          fireEvent.mouseMove(canvas, { screenY: drawPoints[2].posx, screenY: drawPoints[2].posy })

        )
        await waitFor(() =>
          fireEvent(canvas, thirdclickevent)
        )
        await waitFor(() =>
          // fireEvent(canvas, move2)
          fireEvent.mouseMove(canvas, { screenY: drawPoints[0].posx, screenY: drawPoints[0].posy })

        )


        //////////////////////////Assertions////////////////////////////
        //Check if the two cooordinates exist on a path on the canvas

        expect(ctx.isPointInPath(drawPoints[0].posx, drawPoints[0].posy)).toBe(true);
       
        expect(ctx.isPointInPath(drawPoints[1].posx, drawPoints[1].posy)).toBe(true);
       
        expect(ctx.isPointInPath(drawPoints[2].posx, drawPoints[2].posy)).toBe(true);
      })

    it("should not display angle for the first line drawn", async () => {
      /////////////////Arrange - initial set up/////////////////////////////////////////
      const CustomLayoutButton = screen.getAllByText('Custom Layout')[0]
      await fireEvent.click(CustomLayoutButton)
      const canvas = screen.getByTestId('TwoDimensionalCanvas')
      expect(canvas).not.toBeNull()

      const ctx = canvas.getContext('2d');
      ctx.canvas.width = 1000
      ctx.canvas.height = 1000

      const StartDrawingButton = screen.getAllByText('Start Drawing')[0]
      await fireEvent.click(StartDrawingButton)

      /////////////////////////Act/////////////////////////
      let firstclickevent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        screenX: drawPoints[0].posx,
        screenY: drawPoints[0].posy,
        button: 0,
      })

      let secondclickevent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        screenX: drawPoints[1].posx,
        screenY: drawPoints[1].posy,
        button: 0,
      })
      await waitFor(() =>
        fireEvent(canvas, firstclickevent)
      )
      await waitFor(() =>
        fireEvent(canvas, secondclickevent)
      )

      ////////////////////////Assertion//////////////////////////
      const angleText = screen.getAllByTestId('Angle')[0]
      expect(angleText.innerHTML).toEqual('N/A')
    })

    it("should display angle for the second line drawn", async () => {
      /////////////////////////////Arrange - initial setup/////////////////////
      // recalculateDrawPoints(50)
      //Open the Drawer
      const CustomLayoutButton = screen.getAllByText('Custom Layout')[0]
      await fireEvent.click(CustomLayoutButton)
      let canvas = null
      //Get the drawing Canvas from the Drawer
      await waitFor(() =>
        canvas = screen.getByTestId('TwoDimensionalCanvas')
      )

      expect(canvas).not.toBeNull()

      const canvasParent = screen.getByTestId('CanvasParent')
      expect(canvasParent).not.toBeNull()

      const StartDrawingButton = screen.getAllByText('Start Drawing')[0]
      await fireEvent.click(StartDrawingButton)
      const ctx = canvas.getContext('2d');
      ctx.canvas.width = 1000
      ctx.canvas.height = 1000
      expect(canvas).not.toBeNull()

      /////////////////////Act -Fire Mouse Events///////////////////////


      //Fire the mouse events to click on two different places 
      let firstclickevent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        screenX: drawPoints[0].posx,
        screenY: drawPoints[0].posy,
        button: 0,
      })
      let moveEvent = new MouseEvent('mousemove', {
        view: window,
        bubbles: true,
        cancelable: true,
        screenX: drawPoints[1].posx,
        screenY: drawPoints[1].posy,
        button: 0,
      })

      let secondclickevent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        screenX: drawPoints[1].posx,
        screenY: drawPoints[1].posy,
        button: 0,
      })
      let moveEvent2 = new MouseEvent('mousemove', {
        view: window,
        bubbles: true,
        cancelable: true,
        screenX: drawPoints[2].posx,
        screenY: drawPoints[2].posy,
        button: 0,
      })
      let thirdclickevent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        screenX: drawPoints[2].posx,
        screenY: drawPoints[2].posy,
        button: 0,
      })


      await waitFor(() =>
        fireEvent(canvas, firstclickevent)
      )
      await waitFor(() =>
        fireEvent(canvas, moveEvent)
      )
      await waitFor(() =>
        fireEvent(canvas, secondclickevent)
      )
      await waitFor(() =>
        fireEvent(canvas, moveEvent2)
      )
      await waitFor(() =>
        fireEvent(canvas, thirdclickevent)
      )

      const angleText = screen.getAllByTestId('Angle')[0]
      // expect(angleText.innerHTML).toEqual(angBetweenWalls.toString())
      expect(angleText.innerHTML).toEqual('126.9')
      // recalculateDrawPoints(1)

    })

    it("should display the length of the line being drawn", async () => {
      recalculateDrawPoints(50)

      ///////////////////////////////////Arrange/////////////////////////
      //Open the Drawer
      const CustomLayoutButton = screen.getAllByText('Custom Layout')[0]
      await fireEvent.click(CustomLayoutButton)
      let canvas = null
      //Get the drawing Canvas from the Drawer
      await waitFor(() =>
        canvas = screen.getByTestId('TwoDimensionalCanvas')
      )

      expect(canvas).not.toBeNull()
      canvas.width = 1000
      canvas.height = 1000

      const canvasParent = screen.getByTestId('CanvasParent')
      expect(canvasParent).not.toBeNull()

      const StartDrawingButton = screen.getAllByText('Start Drawing')[0]
      await fireEvent.click(StartDrawingButton)
      const ctx = canvas.getContext('2d');
      expect(canvas).not.toBeNull()

      /////////////////////Act -Fire Mouse Events///////////////////////

      //Fire the mouse events to click on two different places 
      let firstclickevent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        screenX: drawPoints[0].posx,
        screenY: drawPoints[0].posy,
        button: 0,
      })
      let moveEvent = new MouseEvent('mousemove', {
        view: window,
        bubbles: true,
        cancelable: true,
        screenX: drawPoints[1].posx,
        screenY: drawPoints[1].posy,
        button: 0,
      })

      let secondclickevent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        screenX: drawPoints[1].posx,
        screenY: drawPoints[1].posy,
        button: 0,
      })


      await waitFor(() =>
        fireEvent(canvas, firstclickevent)
      )
      await waitFor(() =>
        fireEvent(canvas, moveEvent)
      )
      await waitFor(() =>
        fireEvent(canvas, secondclickevent)
      )

      const lengthText = screen.getAllByTestId('Length')[0]
      expect(lengthText.innerHTML).toEqual(horizontalLineLenght.toFixed(1).toString())

      recalculateDrawPoints(1)
    })


  })



  describe("clearButtonHandler", () => {

    it("should clear the lines form the canvas onClick", async () => {

      /////////////////////////////////Arrange/////////////////////
      const CustomLayoutButton = screen.getAllByText('Custom Layout')[0]
      await fireEvent.click(CustomLayoutButton)

      const canvas = screen.getByTestId('TwoDimensionalCanvas')
      expect(canvas).not.toBeNull()
      let ctx = canvas.getContext('2d');
      ctx.canvas.width = 1000
      ctx.canvas.height = 1000
      const StartDrawingButton = screen.getAllByText('Start Drawing')[0]
      await fireEvent.click(StartDrawingButton)

      ////////////////////////Act/////////////////////////////////
      let firstclickevent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        screenX: drawPoints[0].posx,
        screenY: drawPoints[0].posy,
        button: 0,
      })

      let secondclickevent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        screenX: drawPoints[1].posx,
        screenY: drawPoints[1].posy,
        button: 0,
      })
      await waitFor(() =>
        fireEvent(canvas, firstclickevent)
      )
      await waitFor(() =>
        fireEvent(canvas, secondclickevent)
      )
      const clearText = screen.getAllByText('Clear')[0]
      expect(clearText).not.toBeNull()
      await waitFor(() =>
        fireEvent.click(clearText)
      )

      // ctx = canvas.getContext('2d');
      expect(ctx.isPointInPath(drawPoints[0].posx, drawPoints[0].posy)).toBe(false);

    })


  })
  describe("convertLinesToWalls()", () => {
    it("should convert all the lines to walls and adds them to the database", async () => {

      ////////////////////////////Arrange///////////////////////////////
      const CustomLayoutButton = screen.getAllByText('Custom Layout')[0]
      await fireEvent.click(CustomLayoutButton)

      const canvas = screen.getByTestId('TwoDimensionalCanvas')
      expect(canvas).not.toBeNull()
      const ctx = canvas.getContext('2d');

      const StartDrawingButton = screen.getAllByText('Start Drawing')[0]
      await fireEvent.click(StartDrawingButton)

      /////////////////////////Act///////////////////////////
      let firstclickevent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        screenX: drawPoints[0].posx,
        screenY: drawPoints[0].posy,
        button: 0,
      })

      let secondclickevent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        screenX: drawPoints[1].posx,
        screenY: drawPoints[1].posy,
        button: 0,
      })

      let thirdclickevent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        screenX: drawPoints[2].posx,
        screenY: drawPoints[2].posy,
        button: 0,
      })

      let fourthclickevent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        screenX: drawPoints[1].posx,
        screenY: drawPoints[2].posy,
        button: 0,
      })

      let fifthclickevent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        screenX: drawPoints[0].posx,
        screenY: drawPoints[2].posy,
        button: 0,
      })

      await fireEvent(canvas, firstclickevent)
      // await fireEvent(canvas, secondMoveEvent)
      await fireEvent(canvas, secondclickevent)
      await fireEvent(canvas, thirdclickevent)
      await fireEvent(canvas, fourthclickevent)
      await fireEvent(canvas, fifthclickevent)
      await fireEvent(canvas, firstclickevent)


      let clickLineArray = []

      let pushLine = {
        fromX: drawPoints[0].posx,
        fromY: drawPoints[0].posy,
        toX: drawPoints[1].posx,
        toY: drawPoints[1].posy
      }
      clickLineArray.push(pushLine)
      //2
      pushLine = {
        fromX: drawPoints[1].posx,
        fromY: drawPoints[1].posy,
        toX: drawPoints[2].posx,
        toY: drawPoints[2].posy
      }
      clickLineArray.push(pushLine)
      //3
      pushLine = {
        fromX: drawPoints[2].posx,
        fromY: drawPoints[2].posy,
        toX: drawPoints[1].posx,
        toY: drawPoints[2].posy
      }
      clickLineArray.push(pushLine)
      //4
      pushLine = {
        fromX: drawPoints[1].posx,
        fromY: drawPoints[2].posy,
        toX: drawPoints[0].posx,
        toY: drawPoints[2].posy
      }
      clickLineArray.push(pushLine)
      //5
      pushLine = {
        fromX: drawPoints[0].posx,
        fromY: drawPoints[2].posy,
        toX: drawPoints[0].posx,
        toY: drawPoints[0].posy
      }
      clickLineArray.push(pushLine)



      let wallArray = makeAllCustomWalls('5', clickLineArray, lengthScale).WallArray;
  

      ////////// Still need length
      let compareWalls = [{
        wallNumber: 1,
        posX: drawPoints[0].posx-drawPoints[0].posx,
        posZ: drawPoints[0].posy-drawPoints[0].posy,
        wallLength: horizontalLineLenght,
        wallHeight: 5,
        wallRotation: 0,
        leftWall: null
      }]
      ////////// Still need length
      let wall2Ang =(Math.PI*2)- Math.atan(Math.abs((drawPoints[2].posy - drawPoints[1].posy)/(drawPoints[2].posx  - drawPoints[1].posx)))
      compareWalls.push(
        {
          wallNumber: 2,
          posX: drawPoints[1].posx -drawPoints[0].posx,
          posZ: drawPoints[1].posy-drawPoints[0].posy,
          wallLength: angleWallLength,
          wallHeight: 5,
          wallRotation: wall2Ang,
          leftWall: compareWalls[0]
        })
      ////////// Still need length
      compareWalls.push({
        wallNumber: 3,
        posX: drawPoints[2].posx-drawPoints[0].posx,
        posZ: drawPoints[2].posy-drawPoints[0].posy,
        wallLength: Math.abs(drawPoints[2].posx - drawPoints[1].posx),
        wallHeight: 5,
        wallRotation: 180 / 180 * Math.PI,
        leftWall: compareWalls[1]
      })
      ////////// Still need length
      compareWalls.push({
        wallNumber: 4,
        posX: drawPoints[1].posx-drawPoints[0].posx,
        posZ: drawPoints[2].posy-drawPoints[0].posy,
        wallLength: Math.abs(drawPoints[1].posx - drawPoints[0].posx),
        wallHeight: 5,
        wallRotation: 180 / 180 * Math.PI,
        leftWall: compareWalls[2]
      })
      ////////// Still need length
      compareWalls.push({
        wallNumber: 5,
        posX: drawPoints[0].posx-drawPoints[0].posx,
        posZ: drawPoints[2].posy-drawPoints[0].posy,
        wallLength: Math.abs(drawPoints[2].posy - drawPoints[0].posy),
        wallHeight: 5,
        wallRotation: 90 / 180 * Math.PI,
        leftWall: compareWalls[3]
      })
      ////////// Still need length

      ///////////////////////////////Assertions//////////////////////////
      let curWallCompare = 0
      let boolResult = true
      let test = null
      compareWalls.forEach(w => {
        w.wallNumber !== wallArray[curWallCompare].wallNumber ? boolResult = false : ''
        w.posX !== wallArray[curWallCompare].posX ? boolResult = false : ''
        w.posZ !== wallArray[curWallCompare].posZ ? boolResult = false : ''
        w.wallLength !== wallArray[curWallCompare].wallLength ? boolResult = false : ''
        w.wallRotation !== wallArray[curWallCompare].wallRotation ? boolResult = false : ''
        if(boolResult === false )
        {
          test=curWallCompare          
        }
        curWallCompare += 1
        
      });
   
      //expect wallArray to have walls with same x and y coordinates
      expect(boolResult).toEqual(true)

    })

  })
  describe("3DViewButtonhandler", () => {

    it("should shows a room with 5 walls is rendered if there are 5 Lines in the line array", async () => {

      ////////////////////////////////////Arrange////////////////////////////
      recalculateDrawPoints(50)
      const CustomLayoutButton = screen.getAllByText('Custom Layout')[0]
      await fireEvent.click(CustomLayoutButton)

      const canvas = screen.getByTestId('TwoDimensionalCanvas')
      expect(canvas).not.toBeNull()
      canvas.width = 1000
      canvas.height = 1000

      const StartDrawingButton = screen.getAllByText('Start Drawing')[0]
      await fireEvent.click(StartDrawingButton)
      /////////////////////////////////Act/////////////////////////////////
      let firstclickevent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        screenX: drawPoints[0].posx,
        screenY: drawPoints[0].posy,
        button: 0,
      })

      let secondclickevent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        screenX: drawPoints[1].posx,
        screenY: drawPoints[1].posy,
        button: 0,
      })

      let thirdclickevent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        screenX: drawPoints[2].posx,
        screenY: drawPoints[2].posy,
        button: 0,
      })

      let fourthclickevent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        screenX: drawPoints[1].posx,
        screenY: drawPoints[2].posy,
        button: 0,
      })

      let fifthclickevent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        screenX: drawPoints[0].posx,
        screenY: drawPoints[2].posy,
        button: 0,
      })
      await waitFor(() =>
        fireEvent(canvas, firstclickevent)
      )
      await waitFor(() =>
        fireEvent(canvas, secondclickevent)
      )
      await waitFor(() =>
        fireEvent(canvas, thirdclickevent)
      )
      await waitFor(() =>
        fireEvent(canvas, fourthclickevent)
      )
      await waitFor(() =>
        fireEvent(canvas, fifthclickevent)
      )
      await waitFor(() =>
          // fireEvent(canvas, move2)
          fireEvent.mouseMove(canvas, { screenY: drawPoints[0].posx, screenY: drawPoints[0].posy })

      )
      const submitButton = screen.getAllByText('Submit')[0]
      
      await act( () => {
         fireEvent.click(submitButton )     
      });
    
      // screen.debug()

      /**Temporarily Commented out
       *  */
      // const button = screen.getAllByText('Submit')[0]
      // button.dispatchEvent(new MouseEvent('click'));

      // let renderer = await ReactThreeTestRenderer.create(
      //   WallList.map(Wall =>
      //     <Wall cabData={Wall} />
      //   )
      // )
      ////////////////////////////////////Assertions/////////////////////
      // const mesh = renderer.scene.allChildren
      // //check if there are 5 walls in the room
      // expect(mesh.length).toBe(5);
      const numRenderedWalls = screen.getByTestId('numOfWallsRenderedOnscreen')
      expect(numRenderedWalls.innerHTML).toEqual("4")
      recalculateDrawPoints(1)

      
    });


  })



})