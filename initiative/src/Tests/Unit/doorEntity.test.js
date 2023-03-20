import { describe, beforeAll, beforeEach, afterAll, afterEach, expect, test, it } from '@jest/globals';
import { Cabinet, cabinetBuilder } from '../../Entities/Cabinet';
import { Door } from '../../Entities/Door';
import { mockedCabinetList } from '../mocks'
import { copyMock, testDoorValidation } from '../testUtil';

describe("doorEntity", () => {

    const sourceCab = Object.assign(new Cabinet(), copyMock(mockedCabinetList[0]))
    sourceCab.get = (id) => { if (id === "id") return sourceCab.id }
    sourceCab._id = sourceCab.id
    delete sourceCab.id
    sourceCab.attributes = undefined
    const sourceDoor = copyMock(mockedCabinetList[0].attributes.door)
    const badSourceCab = copyMock(sourceCab)
    badSourceCab.posy = null
    const badSourceDoor = copyMock(sourceDoor)
    badSourceDoor.doorID = null
    const expectedResult = mockedCabinetList[0]

    describe("cabinetBuilder", () => {

        it("Cabinet builder creates cabient objects", async () => { // TODO move?
            // console.log(sourceCab)
            // console.log(sourceDoor)
            const cab = await cabinetBuilder(sourceCab, sourceDoor)
            expect(cab).toMatchObject(expectedResult)
        })

        it("cabinetBuilder throws an error if given Cabinet data is not in the proper format", async () => {

            jest.spyOn(console, "error")
            console.error.mockImplementation(() => { })
            await expect(cabinetBuilder(badSourceCab, sourceDoor)).rejects.toEqual(new Error("Bad Cabinet Data"))
            jest.restoreAllMocks()
        })

        it("cabinetBuilder throws an error if given Door data is not in the proper format", async () => {
            jest.spyOn(console, "error")
            console.error.mockImplementation(() => { })
            await expect(cabinetBuilder(sourceCab, badSourceDoor)).rejects.toEqual(new Error("Bad Door Data"))
            jest.restoreAllMocks()
        })

        it("getDoorPosition should return offset position coordinates based off the position of the cabinet", () => {
            const door = Object.assign(new Door(), sourceDoor)


            const offset = sourceCab.getDoorOffset()
            // console.log(offset)
            const [x, y, z] = door.getPosition(offset)

            expect(x).toBe(sourceCab.posx + offset[0])
            expect(y).toBe(sourceCab.posy + offset[1])
            expect(z).toBe(sourceCab.posz + offset[2])
        })
    })
})
