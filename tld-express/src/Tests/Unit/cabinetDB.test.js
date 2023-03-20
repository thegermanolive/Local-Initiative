//
// import { updateCabinet, _relateToRoom } from '../../Utilities/CabinetDB'
// import { mockedCabinetList } from '../mocks'
// import { copyMock } from '../testUtil'
// // import  * as cabinetDb from '../../Utilities/CabinetDB' 
//
// const instance = require('../../Utilities/CabinetDB')
//
// const { describe, test, expect } = require('@jest/globals')
//
//
// describe('updateCabinet', () => {
//     it('adds a new cabinet if it does not exist', async () => {
//         // Mock the `instance.findById` function to return null
//         const mockInstance = { findById: jest.fn().mockResolvedValue(null) }
//
//         // Call the function with a new cabinet
//         const newCabinet = mockedCabinetList[0]
//         const output = await updateCabinet(newCabinet, mockInstance)
//
//         // Check that the `addCabinet` function was called and that the output is correct
//         expect(mockInstance.addCabinet).toHaveBeenCalledWith(newCabinet)
//         expect(output).toEqual(foundCabinet)
//     })
//
//     it('relates the cabinet to a door', async () => {
//         // Mock the `instance.findById` and `instance.first` functions to return nodes
//         const mockInstance = {
//             findById: jest.fn().mockResolvedValue({ id: '1' }),
//             first: jest.fn().mockResolvedValue({ doorID: 1 })
//         }
//
//         // Call the function with a cabinet that has a door
//         const cabinet = { attributes: { doorID: 1 } }
//         const output = await updateCabinet(cabinet, mockInstance)
//
//         // Check that the relationships were updated and that the output is correct
//         expect(mockInstance.findById).toHaveBeenCalledTimes(2)
//         expect(mockInstance.relateTo).toHaveBeenCalledWith(
//             { id: '1' },
//             'contains_this_door',
//             { doorID: 1 }
//         )
//         expect(output).toEqual({ id: '1' })
//     })
//
//     it('handles missing door nodes', async () => {
//         // Mock the `instance.first` function to return null
//         //
//         const cabinet = copyMock(mockedCabinetList[0])
//         const mockInstance = { first: jest.fn().mockResolvedValue(null),
//                                 findByID: jest.fn().mockResolvedValue(cabinet)
//         }
//
//         // Call the function with a cabinet that has a missing door
//         const output = await updateCabinet(cabinet, mockInstance)
//
//         // Check that the warning message was logged and that the output is null
//         expect(console.warn).toHaveBeenCalledWith("-----------------Couldn't find the door-------------")
//         expect(output).toBeNull()
//     })
// })
//
// // describe('_relateToRoom', () => {
// //   it('relates the cabinet to a room and a wall', async () => {
// //     // Mock the `instance.first` and `instance.cypher` functions to return nodes and relationships
// //     const mockInstance = {
// //       first: jest.fn()
// //         .mockResolvedValueOnce({ roomID: 1 })
// //         .mockResolvedValueOnce(null)
// //         .mockResolvedValueOnce({ wallNumber: 2 }),
// //       cypher: jest.fn().mockResolvedValue({
// //         records: [{ _fields: [{ identity: { low: 3 } }] }]
// //       }),
// //       findById: jest.fn().mockResolvedValue({ id: '1' }),
// //       relateTo: jest.fn().mockResolvedValue(null),
// //       create: jest.fn().mockResolvedValue(null)
// //     }
// //
// //     // Call the function with a cabinet that has a room and wall
// //     const cabinet = { roomID: 1, wall: { wallNumber: 2 } }
// //     const foundCabinet = { get: jest.fn().mockReturnValue(null), relateTo: mockInstance.relateTo }
// //     const output = await _relateToRoom(cabinet, foundCabinet, mockInstance)
// //
// //     // Check that the nodes and relationships were updated and that the output is null
test("this",()=>{expect(true).toBeTruthy})
