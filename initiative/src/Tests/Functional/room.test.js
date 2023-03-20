jest.mock('@react-three/fiber');
jest.mock('@react-three/drei');
import { cloneDeep, update } from 'lodash';
import Room from '../../Components/Core/Room';
import * as CabinetDB from '../../Utilities/CabinetDB';
import { mockedCabinetList } from '../mocks';
import { copyMock } from '../testUtil';

jest.mock("../../Utilities/CabinetDB.js");
jest.mock('../../Components/Shared/Models/GetMeshFromPath', () => (props) => {
    <mesh scale={[17.38, 25.38, 35.88]} >
        <boxGeometry />
        <meshStandardMaterial color={'red'} />
    </mesh>
});

jest.mock('../../../node_modules/three/src/loaders/TextureLoader', () => ({
    TextureLoader: 0
}));

jest.mock('three/examples/jsm/loaders/OBJLoader', () => ({
    OBJLoader: 0
}));


jest.mock('../../Utilities/CabinetDB');
jest.mock('../../Components/Core/RoomRender');
jest.mock('../../Components/Core/UI.js');
afterAll(()=>{jest.clearAllMocks()})

describe("Room.js", () => {
    const mockedCurrentSelection = {
        posx: 1,
        posy: 1,
        posz: 1,
        rotx: 0,
        roty: 0,
        rotz: 0,
        modelPath: "",
        cabinetID: 1,
        attributes: {
            BaseDoorStyle: "door2"
        },
        wall: {
            wallNumber: 1,
            posX: 10,
            posZ: 5,
            wallLength: 10,
            wallHeight: 5,
            wallRotation: Math.PI / 2,
            leftWall: null,
            node: {}
        }
    }

    const fakeEvent = ({
        object: mockedCurrentSelection,            // The object that was actually hit
        eventObject: mockedCurrentSelection         // The object that registered the event
        // Distance between mouse down and mouse up event in pixels
    })

    const fakeEventWhereCurrentSelectionIsNotCabinet = ({
        object: null,            // The object that was actually hit
        eventObject: null         // The object that registered the event
        // Distance between mouse down and mouse up event in pixels
    })



    let room;
        room = new Room({ roomID: 0, state: { didInitialRender: "true" } })
    // let setSelectedCabinet;

    jest.mock("../../Utilities/CabinetDB.js")

    beforeEach(() => {
        room.render = jest.fn()
        // lroom.CheckWallRendering= jest.fn();
        // lroom.updateDBWithList= jest.fn();
        // lroom.componentDidUpdate= jest.fn();
        // lroom.componentDidUpdate= jest.fn();
    })
    let equalsResult = (input, result, done) => {
            room.setState = (state) => {
                expect(state.currentSelected).toEqual(result)
                done()
            };
        room.setSelectedCabinet(input)
    }

    describe("#updateDBWithList(CabList)",()=>{
        const updateSpy = jest.spyOn(CabinetDB, "updateCabinet").mockImplementation(async(item)=>{
            item._identity.low = item.id
            return item
        })
        let room = new Room({ roomID: 0, state: { didInitialRender: "true" } })

        let entityList = copyMock(mockedCabinetList)
        test("that updatecab is called for each cabinet supplied",async ()=>{

            await room.updateDBWithList(entityList)
            expect(updateSpy).toBeCalledTimes(mockedCabinetList.length)
        })



    })

    describe("#setSelectedCabinet()", () => {
        it("should select an item when the handler is fired", done => {
            equalsResult(mockedCurrentSelection, mockedCurrentSelection, done)
        });

        it("should not select an item when the handler is fired if there is no cabinetID", done => {
            equalsResult({ pos: 1, pos: 6 }, {} , done)
        });
    });
});

