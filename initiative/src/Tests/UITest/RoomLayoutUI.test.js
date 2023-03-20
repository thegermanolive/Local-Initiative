import React, { useEffect, useRef } from 'react';
import TestRenderer from 'react-test-renderer'
import Room from '../../Components/Core/Room'
import { addCabinet, getCabinetbyID } from "../../Utilities/CabinetDB";
import { screen, render, fireEvent, createEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { TwoDimentionalDraw } from '../../Components/Features/TwoDimentionalDraw';
import { act } from 'react-dom/test-utils';
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

let container


describe("TwoDimentionalDraw.js", () => {


  beforeEach(() => {
    act(() => {
    
      container = render(<RoomLayoutUI />)

    })

  });

  afterEach(() => {
   
    container = null;
  });


test("that the custom layout button opens custome Layout drawer", async() =>{
   

    let ChooseLayoutModal = screen.getByTestId('ChooseLayoutModal')
    expect(ChooseLayoutModal).not.toBeNull()
    expect(ChooseLayoutModal).toBeInTheDocument()

   let CustomLayoutButton = screen.getAllByText('Custom Layout')[0]
    await fireEvent.click(CustomLayoutButton)
    let canvas = null
    //Get the drawing Canvas from the Drawer
    await waitFor(() =>
      canvas = screen.getByTestId('TwoDimensionalCanvas')
    )    
    expect(canvas).not.toBeNull()
    expect(canvas).toBeInTheDocument()

  });



    //EDITED: changed 2 to 3
    it("should have 3 buttons ", () =>{

        let ChooseLayoutModal = screen.getByTestId('ChooseLayoutModal')
        expect(ChooseLayoutModal).not.toBeNull()
        expect(ChooseLayoutModal).toBeInTheDocument()

        let buttonsOnScreen =  screen.queryAllByRole('button')

        expect(buttonsOnScreen).toHaveLength(3)


    })
})