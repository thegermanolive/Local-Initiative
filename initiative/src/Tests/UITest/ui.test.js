import { render } from '@testing-library/react';
import UI from '../../Components/Core/UI';
import { copyMock } from '../testUtil';
import { mockedCabinetList} from '../mocks';
import * as CabinetDB from '../../Utilities/CabinetDB'

// jest.mock('neode')

jest.mock('three/src/loaders/TextureLoader', () => ({
    TextureLoader: 0
}));

jest.mock('three/examples/jsm/loaders/OBJLoader', () => ({
    OBJLoader: 0
}))

// jest.mock('../../../node_modules/neode/build/index.js')
jest.mock('../../Utilities/CabinetDB', () => {
    return {
        removeCabinetByID: jest.fn(),
        getAllDoorStyles: jest.fn().mockResolvedValue([{
            doorID: 1,
            doorStyle: "Door1",
            modelPath: "Path"
        }]),
        getAllCabinets: jest.fn()

    }
}
);


jest.mock('../../Components/Core/CatalogUI.js')
jest.mock('../../Components/Core/AttributeMenu.js', () => ()=>{
  return <div data-testid="attribute-menu">asdf</div>
});
describe('UI', () => {
    beforeAll(() => {
        jest.clearAllMocks()
    })
    describe('attributeMenu', () => {
        test('renders AttributeMenu if selectedCab is truthy', () => {
            const selectedCab = copyMock(mockedCabinetList[0])
            // const { getByTestId } = render(<UI />);
            const Room = {
                setState: jest.fn(),
                state: {currentSelected: selectedCab}
                };
            const { getByTestId } = render(<UI Room={Room} />);
            const attributeMenu = getByTestId('attribute-menu');
            expect(attributeMenu).toBeInTheDocument();
        });

        test('renders empty div if selectedCab is falsy', () => {
            const { container } = render(<UI Room={{ state: { currentSelected: null }, props: { roomID: 1 } }} />);
            const attributeMenu = container.querySelector('div');
            expect(attributeMenu).toBeInTheDocument();
            expect(attributeMenu).toBeEmptyDOMElement();
        });
    });
    describe("#deleteAllCabinetHandler(entitylist)", () => {
        it('should remove all cabinets from the entity list and call removeCabinetByID', async () => {
            let entityList = copyMock(mockedCabinetList);
            const room = { setState: jest.fn()};
            const ui = new UI({ Room: { state: { entityList }, props: { roomID: 1 }, setState: room.setState } });
            await ui.deleteAllHandler(entityList);
            
            // expect(CabinetDB.removeCabinetByID.mock.calls).toEqual(entityList.map((entity) => [entity.id]));
            expect(entityList).toHaveLength(0);
            expect(room.setState).toHaveBeenCalledWith({ entityList: [] });
        });
    })
})


