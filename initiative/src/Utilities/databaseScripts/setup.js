
export basicSetup function() {
    return `
CREATE (testroom1:Room:Test {roomID:5}) 

    CREATE (testcab1:Cabinet:Test {posx: 0, posy: 0, posz: 0, rotx: 0, roty: 0, rotz: 0, SectionCode: "1V-D=L|T", CabNomenclature: "SB-1D-2S", width: 15.875000, height: 34.875000, depth: 24.000000, CabinetIdentifier: "42359", modelPath: "../modelFiles/SimpleCab.obj", cabinetID: 10}) 

    CREATE (testcab2:Cabinet:Test {posx: 20, posy: 0, posz: 0, rotx: 0, roty: 0, rotz: 0, SectionCode: "2H=24 5/8=7 1/4-D=L-W|T", CabNomenclature: "SB-1D-1DR-1S", width: 15.875000, height: 34.875000, depth: 24.000000, CabinetIdentifier: "42189", modelPath: "../modelFiles/cab1 dxf.obj", cabinetID: 20}) 

    CREATE (testcab3:Cabinet:Test {posx: 40, posy: 0, posz: 0, rotx: 0, roty: 0, rotz: 0, SectionCode: "1V-D=L|T", CabNomenclature: "SB-1D-2S", width: 15.875000, height: 34.875000, depth: 24.000000, CabinetIdentifier: "42359", modelPath: "../modelFiles/cab2 dxf.obj", cabinetID: 30}) 

    CREATE (testdoor1:Door:Test {doorID:3,doorStyle:"Westbank"}) 

    CREATE (testdoor2:Door:Test {doorID:4,doorStyle:"East Coast 12"}) 

    CREATE (testst1:StyleTemplate:Test {styleName: "East Coast 12", Material: "MDF - Spray MB", OutsideEdge: "", InsideEdge: "", RaisedPanel: "", RoutePattern: "EastCoast", DatabaseName: "TLD DOORS", THEOTHEREMPTYSTRING: "" }) 

    CREATE (testst2:StyleTemplate:Test {styleName: "Westbank", Material: "MDF - Spray 3/4", OutsideEdge: "", InsideEdge: "", RaisedPanel: "", RoutePattern: "Westbank", DatabaseName: "TLD DOORS", THEOTHEREMPTYSTRING: "" }) 
    CREATE (testst2:StyleTemplate:Test {styleName: "Westbank", Material: "MDF - Spray 3/4", OutsideEdge: "", InsideEdge: "", RaisedPanel: "", RoutePattern: "Westbank", DatabaseName: "TLD DOORS", THEOTHEREMPTYSTRING: "" }) 
 `
}


createCabinetTemplates = `
    CREATE (testcab1:CabinetTemplate:Test {posx: 0, posy: 0, posz: 0, rotx: 0, roty: 0, rotz: 0, SectionCode: "1V-D=L|T", CabNomenclature: "SB-1D-2S", width: 15.875000, height: 34.875000, depth: 24.000000, CabinetIdentifier: "42359", modelPath: "../modelFiles/SimpleCab.obj", cabinetID: 10}) 

    CREATE (testcab2:CabinetTemplate:Test {posx: 20, posy: 0, posz: 0, rotx: 0, roty: 0, rotz: 0, SectionCode: "2H=24 5/8=7 1/4-D=L-W|T", CabNomenclature: "SB-1D-1DR-1S", width: 15.875000, height: 34.875000, depth: 24.000000, CabinetIdentifier: "42189", modelPath: "../modelFiles/cab1 dxf.obj", cabinetID: 20}) 

    CREATE (testcab3:CabinetTemplate:Test {posx: 40, posy: 0, posz: 0, rotx: 0, roty: 0, rotz: 0, SectionCode: "1V-D=L|T", CabNomenclature: "SB-1D-2S", width: 15.875000, height: 34.875000, depth: 24.000000, CabinetIdentifier: "42359", modelPath: "../modelFiles/cab2 dxf.obj", cabinetID: 30}) 

`
