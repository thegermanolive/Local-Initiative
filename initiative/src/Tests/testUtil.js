import Model from "neode/build/Model";
import Validator from "neode/build/Services/Validator";
import { Cabinet } from "../Entities/Cabinet";
import DoorModel from "../Models/DoorModel";
import { addCabinet, setupDB, updateCabinet } from "../Utilities/CabinetDB";
import { mockedCabinetList } from "./mocks";

let neode = null

/**
 *  adds the mockedCabinetList to the database returns its values
 * @returns The cabinets mocked and added to the db
 */
export async function addMockedCabinets(){
  for (const cab in mockedCabinetList) {
    await addCabinet(cab)
  }
  return mockedCabinetList
}


export async function updateMockedCabinet(){
  let cabinetList = [];
  for (const cab in mockedCabinetList) {
    cabinetList.push(await updateCabinet(cab))
  }
  return cabinetList
}

export function setupMocks(jest){

    jest.mock('three/examples/jsm/loaders/OBJLoader', () => ({
      OBJLoader: 0
    }))
    jest.mock('../../../node_modules/three/src/loaders/TextureLoader',()=>({
          TextureLoader: 0
        })
    )

    jest.mock('@react-three/fiber', () => ({
      ...jest.requireActual('@react-three/fiber'),
      Canvas: ({ }) => (<p>'hello'</p>)
    }))

}


export function dbCleanup(){
  const instance = setupDB();
  instance.cypher("MATCH (n) DETACH DELETE n")
}


export const testDoorValidation = async (data, field, errorMessage) =>{
    const model = new Model(neode, 'Door', DoorModel);
    await testValidation(data, field, errorMessage, model);  
}

export const testValidation = async (data, field, errorMessage, model) => {
  jest.spyOn(console, "error")
  console.error.mockImplementation(() => { })
  try {
    // console.log(`${neode}, ${model}, ${data}`)
      await Validator(neode, model, data)
  } catch (err) {
      console.error(err)
      expect(err.details).toHaveLength(1)
      expect(err.details[0]['message']).toBe(`"${field}" ${errorMessage}`)
  }
   jest.restoreAllMocks()
}

/**
 * This function will take in an object and return a deep copy of that object,
 * this will not work with functions, only objects. returned objects will need 
 * to be assigned (Object.assign(new *, copy))
 * @param {*} original 
 */
export function copyMock(original) {
  return JSON.parse(JSON.stringify(original))
}
