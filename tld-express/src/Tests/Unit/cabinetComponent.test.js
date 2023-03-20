import { cloneDeep } from "lodash";
import { adjustY } from "../../Components/Shared/Models/Cabinet";
import { mockedCabinetList } from "../mocks";
jest.mock('three/src/loaders/TextureLoader', () => ({
    TextureLoader: 0
}));

jest.mock('three/examples/jsm/loaders/OBJLoader', () => ({
    OBJLoader: 0
}))


describe("Cabinet Component", ()=>{


  it.todo("should throw an error if the cabinet model is not found")
 

  describe("adjustPosition", ()=>{
    test.todo("that the adjust position method takes in a cabRef and alters position on that object")
  })

  describe("adjustY(cabRef, isUpper ,positionOffset, zRotation)", ()=>{
      const mockCabRef = {
        current: {
          size:{
            height:0,
            width:0,
            length:0
          },
          rotation: {
            x:0,
            y:0,
            z:0
          },
          position: {
            x:0,
            y:0,
            z:0
          },
        }
      }
    test("that adjustY changes cabRef's y position by offset",()=>{
      let mockCabResult = cloneDeep(mockCabRef)
      let cabData = cloneDeep(testCabUpper)
      cabData.modelSize = [17.377954483032227,35.875000000000014,26.15748023986817]
      mockCabResult.posy = 12
      const mockOffset = [1,12,1]
      const mockRotation = 0
      let isUpper = true
      



      const res = adjustY(mockCabRef, cabData, mockOffset, mockRotation)

      expect(mockCabRef).toEqual(mockCabResult)
    })
  });

  describe("delete Upper Cabinets", ()=>{
    test("that an upper cabinet can be deleted", () =>{

    });
  })

  describe("Upper cabinet top edge and bottom edge Alignments", () =>{
    test("that the top edge of all upper cabinets are the same", ()=>{

    });

    test("that the bottom edge of upper cabinets can be differernt",()=>{

    });
  })

})