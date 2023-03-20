// Started Cleaning, setup for .env
import { describe, beforeAll, beforeEach, afterAll, afterEach, expect, test, it } from '@jest/globals'
import TestRenderer from 'react-test-renderer'
import AttributeMenu from '../../Components/Core/AttributeMenu';
import '@testing-library/react'
import { mockedCabinetList } from '../mocks';
import { copyMock } from '../testUtil';
import * as CabinetDB from '../../Utilities/CabinetDB'
import { cloneDeep, forIn, remove } from 'lodash';


import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
describe("AttributeMenu.js", () => {

    test('renders AttributeMenu component', () => {
        render(<AttributeMenu />);
        const attributeMenu = screen.getByTestId('attribute-menu');
        expect(attributeMenu).toBeInTheDocument();
    });
    test('renders door style Select ', () => {
        render(<AttributeMenu />);
        const doorSelect = screen.getByTestId('door-select');
        expect(doorSelect).toBeInTheDocument();
    });
    test('calls doorStyleOnChange method correctly', () => {
        const doorStyleOnChange = jest.fn();
        render(
            <AttributeMenu doorStyleOnChange={doorStyleOnChange}
                currentSelection={cloneDeep(mockedCabinetList[0])}
                room={{setState:jest.fn()}}
            />);
        const doorSelect = screen.getByTestId('door-select');
        fireEvent.change(doorSelect, { target: { value: 'test' } });
        expect(doorStyleOnChange).toHaveBeenCalled();
    });




    // object portion
    // TODO update so that we can mock the db fully 
    // it("should change the cabinet's data within the entitylist to the new data attribute", () => {
    //     testInstance.instance.state.currentSelected = testCabinet
    //     testInstance.instance.setState({})
    //     const TargetValue = 1
    //
    //
    //
    //     testInstance.findByProps({ className: "DoorSelect" }).props.onChange({ target: { value: TargetValue } })
    //
    //
    //     expect(testInstance.instance.state.currentSelected.attributes.door.doorID).toEqual(TargetValue)// make sure the door style of the object changes
    //
    // });


    //         it("should contain a single listbox with a doorstyle", () => {
    //
    //              expect(testInstanceAttributeMenu.findByProps({ className: "DoorSelect" })).toBeDefined();
    //         });


    // afterAll(async () => {
    //     await removeCabinetByProps({cabinetID : testCabinet.cabinetID})
    //
    //     await session.close()
    // })


    // });



    //-----------------------------------story1c_v2_remove_unwanted_cabinet-----------------------------------------

});
describe("#deleteHandler(event)", () => {
    jest.mock("../../Utilities/CabinetDB.js")

    let removeCabSpy
    let entityList
    let selectCab
    let entityListLength
    let entityListOriginal

    beforeEach(async () => {
        removeCabSpy = jest.spyOn(CabinetDB, 'removeCabinetByID').mockResolvedValue(true)
        entityList = cloneDeep(mockedCabinetList);
        entityListOriginal = cloneDeep(entityList);
        selectCab = entityList[1]
        entityListLength = entityList.length

        let test = TestRenderer.create(<AttributeMenu currentSelection={selectCab} room={{ setState: jest.fn() }} />)
        test.getInstance().setState = jest.fn()

        entityList = await test.getInstance().deleteHandler(selectCab, entityList)
    });

    it("should remove a selected cabinet from the entity list and any other cabinets in the entity list should remain there", async () => {
        const remainingList = cloneDeep(entityListOriginal)
        remove(remainingList, (item) => item.id === selectCab.id)
        expect(entityList.sort()).toEqual(remainingList.sort())
    })

    test("that entityList no longer has selected Cab", async () => {
        expect(entityList).not.toContain(selectCab)
    })

    //------------------------------------Test 3---------------------------------------------
    it("should only ask selected cab to be removed, by its id", async () => {
        expect(removeCabSpy).toHaveBeenCalledTimes(1)
        expect(removeCabSpy).toHaveBeenLastCalledWith(selectCab.id)
    })


});
