import {describe, beforeAll, beforeEach, afterAll, afterEach, expect, test, it} from '@jest/globals';
import React, { Suspense,  useMemo, forwardRef } from 'react'
import CabinetComp from '../../Components/Shared/Models/Cabinet'
import TestRenderer from 'react-test-renderer'
import { mockedCabinetList, testCabUpper } from '../mocks';
import { clone, cloneDeep } from 'lodash';
const Neo4jVars = [process.env.REACT_APP_BOLT_SERVERADDRESS, process.env.REACT_APP_NEO4J_USERNAME, process.env.REACT_APP_NEO4J_PASSWORD]
// const instance = new Neode(...Neo4jVars);


jest.mock('../../../node_modules/three/src/loaders/TextureLoader', () => ({
    TextureLoader: 0
}));

jest.mock('@react-three/fiber',()=>({
    ...jest.requireActual('@react-three/fiber'),
    Canvas: ({})=>(<p>'hello'</p>)
}))

jest.mock('three/examples/jsm/loaders/OBJLoader',()=>({
    OBJLoader: 0
  }))

  jest.mock('../../Components/Shared/Models/GetMeshFromPath', () => (props) => {
    <mesh scale={[17.38, 25.38, 35.88]} >
      <boxGeometry />
      <meshStandardMaterial color={'red'} />
    </mesh>
   }
  );


const [testCabCollided1, testCabCollided2, testCabNotCollided] = mockedCabinetList


describe("PART ONE: COLLISION TEST", () => {
    let testInstance;
    let testCabRenderer;

    beforeEach(() => {
        testCabRenderer = TestRenderer.create(
            <CabinetComp
                key={Math.random() * 100}
                cabData={testCabCollided1}
            />
        )
        testInstance = testCabRenderer.root;
    });

    test("Test that cabinet collided", async () => {
        let currentBoundingBox = testCabCollided1.tempBoundBox;
        let cabid = testCabCollided1.id
        expect(testInstance.instance.objectCollided(currentBoundingBox, cabid, [testCabCollided2, testCabNotCollided])).toEqual([testCabCollided2])
    });

    it("Test that lone cabinet should not collide itself", () => {
        let currentBoundingBox = testCabCollided1.tempBoundBox;
        let cabid = testCabCollided1.id
        expect(testInstance.instance.objectCollided(currentBoundingBox, cabid, [testCabCollided1])).toEqual([])
    });

    test("Test that two cabinets do not collide", () => {
        let currentBoundingBox = testCabCollided1.tempBoundBox;
        let cabid = testCabCollided1.id;
        expect(testInstance.instance.objectCollided(currentBoundingBox, cabid, [testCabNotCollided])).toEqual([])
        expect(testInstance.instance.objectCollided(currentBoundingBox, cabid, [])).toEqual([])
    });

    test("that two uppers collide",()=>{
      let testUpper = cloneDeep(testCabUpper);
      let testUpper2 = cloneDeep(testUpper)
      testUpper2.id++
      let currentBoundingBox = testUpper.tempBoundBox;
      expect(testInstance.instance.objectCollided(currentBoundingBox, testUpper.id, [testUpper2]))
    })

    test("that an upper and lower dont collide",()=>{
      let testUpper = cloneDeep(testCabUpper);
      let testUpper2 = cloneDeep(testUpper)
      testUpper2.id++
      let currentBoundingBox = testUpper.tempBoundBox;
      expect(testInstance.instance.objectCollided(currentBoundingBox, testUpper.id, [mockedCabinetList[0]]))
    })

    test("that an upper and lower in the same x/z space will not collide", ()=>{
      let testUpper = cloneDeep(testCabUpper);
      let currentBoundingBox1 = testCabCollided1.tempBoundBox;

      let cabid = testCabCollided1.id;
      let currentBoundingBox2 = testUpper.tempBoundBox;
      expect(testInstance.instance.objectCollided(currentBoundingBox1, testUpper.id, [testCabCollided1]))
    })
})

