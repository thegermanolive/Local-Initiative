import React, { Component } from 'react';
import { GenerateORD } from '../Features/ORDMaker';
import CatalogUI from './CatalogUI';
import AttributeMenu from './AttributeMenu';
import { removeCabinetByID, removeCabinetByProps } from '../../Utilities/CabinetDB';
import {QueryRoomFromDB} from '../../Utilities/RoomDB'
import deleteHandler from '../Core/AttributeMenu';
import FileSaver from 'file-saver';
import { Button, ButtonGroup } from '@chakra-ui/react'

//Basic UI components will hold multiple portions of the UI
export default class UI extends Component {


    shouldBlockNavigation = false;
    // If there is a cabinet currently selected, the attribute menu will be rendered,
    // If there is none, it will not be rendered. The attribute menu alkso holds references
    // to the currently selected cabinet and the room, used for changing arttribute relationships
    // in the database

    attributeMenu = (curSelection, room) => {
        if (curSelection?.cabinetID) {
            return (<AttributeMenu
                currentSelection={curSelection}
                room={room}
            />);
        }
        else {
            return (<div></div>)
        }

        
    }

    // Handler method for the submit button. When the button is clicked, a .ord file
    // is built and pushed to the browser window. The file is saved using the file-saver npm module
    // https://www.npmjs.com/package/file-saver
    async ClickedSubmit() {
        try {

            let roomJSON = await QueryRoomFromDB(this.props.Room.props.roomID);

            let string = await GenerateORD(roomJSON)
            let blob = new Blob([string], { type: "text/plain;charset=utf-8" });

            // Download the File to the client user's Downloads Folder
            FileSaver.saveAs(blob, "ORDExport.ord");
        } catch (err) {
            window.alert(err.message);
            console.error(err)
        }
        
    }

    //Renderer decides what gets returned 
    // the submit button will create a .ord file
    //The delete all button will remove everything from the current room
    render() {
        return (
            <>
                {this.attributeMenu(this.props.Room.state.currentSelected, this.props.Room)}
                <button onClick={async () => await this.ClickedSubmit()} >Submit</button>
                <button onClick={async () => await this.deleteAllPrompt()} >Delete All </button>

                <CatalogUI Room={this.props.Room} />
            </>
        )//the Catalog object held at the side of the string.

    }

    //This handler will fire when the user confirms deletion
    //it will delete all items in the current room, removing
    //them from the saved room in the database
    async deleteAllHandler(entityList) {

        for (let i = 0; i < entityList.length; i++)
		{
            await removeCabinetByID(entityList[i].id)
		}
        // todo Should this remove the items from the list
        entityList.length = 0
        entityList = []
        //I added this - No you didn't, it was me
        this.props.Room.setState({entityList: []})
        return entityList

    }

    //This handler will prompt the user for confirmation when theuser clicks the delete all button
    //If the user clicks "ok" it will cal the functuiion to empty the items in the room,
    //Otherwise it will do nothing if "cancel" is clicked
    async deleteAllPrompt() {
        if (window.confirm("Do you want to delete all cabinets?"))
        {
            this.deleteAllHandler(this.props.Room.state.entityList)
        }
    }

}
