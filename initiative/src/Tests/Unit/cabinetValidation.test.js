import {describe, beforeAll, beforeEach, afterAll, afterEach, expect, test, it} from '@jest/globals';
import Validator from 'neode/build/Services/Validator'
import Model from 'neode/build/Model'
import { ERROR_VALIDATION } from 'neode/build/ValidationError'
import CabinetModel from '../../Models/CabinetModel';
import { validate } from 'schema-utils';


describe("CABINET VALIDATION UNIT TEST", () => {
    const neode = null
    const model = new Model(neode, 'Cabinet', CabinetModel)
    let validBASECabinet;

    beforeEach(()=>{
        validBASECabinet = {
            posx: 1,
            posy: 1,
            posz: 1,
            rotx: 1,
            roty: 1,
            rotz: 1,
            cabinetID: 1,
            modelPath: "a",
            isUpper: false
        }
    });

    const testValidation = async (data, field, errorMessage) => {
        try {
            await Validator(neode, model, data)
        } catch (err) {
            expect(err.details).toHaveLength(1)
            expect(err.details[0]['message']).toBe(`"${field}" ${errorMessage}`)
        }
    }
    it("Cabinet Properties contains valid numeric values, missing path" , async () => {
        const data = validBASECabinet
        data.modelPath=""
        testValidation(data, "modelPath", 'is not allowed to be empty')
    });

    it("Cabinet Properties contains non-numeric posx value" , () => {
        const data = validBASECabinet
        data.posx="Pikachu"
        testValidation(data,"posx",'must be a number')
    });

    it("Cabinet Properties contains non-numeric posy value" , () => {
        const data = validBASECabinet
        data.posy="Eevee"
        testValidation(data,"posy",'must be a number')
    });

    it("Cabinet Properties contains non-numeric posz value" , () => {
        const data = validBASECabinet
        data.posz="Charizard"
        testValidation(data,"posz",'must be a number')
    });

    it("Cabinet Properties contains non-numeric rotx value" , () => {
        const data = validBASECabinet
        data.rotx="Snorlax"
        testValidation(data,"rotx",'must be a number')
    });

    it("Cabinet Properties contains non-numeric roty value" , () => {
        const data = validBASECabinet
        data.roty="Garchomp"
        testValidation(data,"roty",'must be a number')

    });

    it("Cabinet Properties contains non-numeric rotz value" , () => {
        const data = validBASECabinet
        data.rotz="Amoonguss"
        testValidation(data,"rotz",'must be a number')
    });

    it("Cabinet Properties contains non-numeric cabinetID value" , () => {
        const data = validBASECabinet
        data.cabinetID="Sussy"
        testValidation(data,"cabinetID",'must be a number')
    });


    it("Cabinet Properties contains null posx value" , () => {
        const data = validBASECabinet
        data.posx = null
        testValidation(data,"posx",'must be a number')
    });

    it("Cabinet Properties contains null posy value" , () => {
        const data = validBASECabinet
        data.posy=null
        testValidation(data,"posy",'must be a number')
    });

    it("Cabinet Properties contains null posz value" , () => {
        const data = validBASECabinet
        data.posz= null
        testValidation(data,"posz",'must be a number')
    });

    it("Cabinet Properties contains null rotx value" , () => {
        const data = validBASECabinet
        data.rotx=null
        testValidation(data,"rotx",'must be a number')
    });

    it("Cabinet Properties contains null roty value" , () => {
        const data = validBASECabinet
        data.roty=null
        testValidation(data,"roty",'must be a number')

    });

    it("Cabinet Properties contains null rotz value" , () => {
        const data = validBASECabinet
        data.rotz=null
        testValidation(data,"rotz",'must be a number')
    });

    it("Cabinet Properties contains null cabinetID value" , () => {
        const data = validBASECabinet
        data.cabinetID=null
        testValidation(data,"cabinetID",'must be a number')
    });

    it("properties isUpper should be boolean",()=>{
        const data = validBASECabinet
        data.isUpper = "Yes"
        testValidation(data,"isUpper", 'must be a boolean')
    });

    it("properties isUpper can be ommited", async()=>{
        const data = validBASECabinet
        delete data.isUpper

        try {
            await Validator(neode, model, data)
            expect(true).toBe(true)
        } catch (err) {
            expect(false).toBe(true)
        }
    });

});

