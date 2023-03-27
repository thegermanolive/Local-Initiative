import { QueryRoomFromDB } from '../../Utilities/CabinetDB';
import { ordTemplate } from '../Shared/ORDTemplate';

let FileSaver = require('file-saver');

// var reader = require('any-text')

/**
 * This method takes in the current room and will attempt to generate an ORD file for that room.
 * If the room does not exist in the database, the user will be alerted and no file will be generated.
 * If the room does exist in the database it will use database procedures and template files to generate
 * an ORD file for import into Cabinet/Closet Vision.
 * @param {*} room 
 * @returns 
 */
export async function GenerateORD(RoomJSON){
    // for(catalog in catalogs){
    //     addCatalog(catalog);
    // }

    let TemplateString = await ImportTemplateFromFile("") //../Template/ORDTemplate.txt"

    let outputstring = ""
    let fileName = "ORDExport.ord"
    
    //collect the JSON object's Parts into a String object.

    
    // console.log(RoomJSON.Catalog)
    let catalogArray = RoomJSON.Catalog
    // console.log(catalogArray)
    
    let WallString = ""
    // '\n[Walls]\n' +
    //     '0.000000,-2.250000,0.000000,200.000000,100.000000,' +
    //     '4.500000, 1, 2, "0",,,, "42141", "S" \n'
    let Walls = RoomJSON.Walls
    if (Walls) {
        WallString = GetWallsString(Walls)
    }
    
    let JSONString = GetCatalogString(catalogArray)
    
    // Put the Parts of the JSON object into the Template string in their correct locations
    outputstring = TemplateString.replace("[[:: Walls ::]]", WallString);
    outputstring = outputstring.replace("[[:: Catalog ::]]", JSONString);


    // Put the Output String into a File

    return (outputstring);
}

/**
 * This function allows us to grab the information of the wall from the database and reformat each information from each wall
 * to the expected format the the ord is expected.
 * @param {} Walls 
 * @returns 
 */
function GetWallsString(Walls) {
    let WallString = "[Walls]\n"

    for (let wall of Walls) {
        for (let att in wall) {
            let value = wall[att]
            WallString += value === null ? '' // If the value is NULL, leave no spaces and place a comma
                : (typeof value === 'string') ? (value.length >= 1 ? '"'+value +'"' : value ) // If the value is a string type, return surrounded with ""
                : typeof value === 'number' ? value.toFixed(6) : value // If the value is a number, return it with 6 decimal points

            WallString += ","
            
        }
        WallString = WallString.slice(0,WallString.length-1)
        WallString += "\n"
    }

    return WallString
 }

 /**
 * This function allows us to grab the information of the catalog from the array of catalog and reformat each information from each catalog
 * to the expected format the the ord is expected.
 * @param {} Walls 
 * @returns 
 */
function GetCatalogString(CatalogArray) {
    let CatalogString = "";
    for(let Catalog of CatalogArray)
    {

        CatalogString += '\n[Catalog]\n';
        for(let att in Catalog )
        {                
            let value = Catalog[att]
            if (typeof value === 'string') {
                CatalogString +=
                    att +
                    '="' + 
                    value +
                    '"\n'
            }
            else if (typeof value === 'object' && att !== "Cabinet") {
                CatalogString += att + '='
                for (let innerAtt in value) {
                    let innerVal = value[innerAtt];
                    CatalogString += '"' + innerVal + '",'
                }
                CatalogString = CatalogString.slice(0,CatalogString.length - 1)
                CatalogString += "\n"
            }
        }

        // Input the Parameters Section -- Use this section if the ORD file requres a Parameters. Leave it commented out if it is unnecessary 
        // CatalogString += GetParamString();

        // Input the Cabinets section of the current Catalog
        CatalogString += GetCabinetString(Catalog.Cabinet)

    }
    return CatalogString;
}

function GetParamString() {
        let ParamString = '\n[Parameters]\n' + 
            '"F1. Filler Ends?","FILL_END","int",0,"<lst>None=0|Left Only=1|Right Only=2|Both=3"\n' + 
            '"TU1. U Shaped?","U_TIR_U","bool",0\n' +
            '"Pull Location-Customize?","Cust_Pull","bool",0\n'
        return ParamString
 }

  /**
 * This function allows us to grab the information of the cabinet from the database and reformat each information from each cabinet
 * to the expected format the the ord is expected.
 * @param {} Walls 
 * @returns 
 */
function GetCabinetString(Cabinets) {
    let CabinetString = "\n[Cabinets]\n"
    for (let Cab of Cabinets) {
        for (let att in Cab)
        {
            let value = Cab[att]
            if (att === "posX")
            {console.log(Cab.posX)}

            CabinetString += (typeof value === 'string') ? // If the value is a string type, return surrounded with ""
                '"' + value + '"' : typeof value === 'number' ? // If the value is a number, return it with 6 decimal points
                value.toFixed(6) : value
            CabinetString += ","
            
        }
        CabinetString = CabinetString.slice(0,CabinetString.length-1)
        CabinetString += "\n"
    }
    return CabinetString
 }

async function ImportTemplateFromFile(filepath){
    return ordTemplate;
}

// EVERYTHING BELOW IS PROBABLY UNECCESARY
// DO IT ON THE SERVER <-- Yeah, that turned out real good /s

// ヘ（゜◇、゜）ノ

