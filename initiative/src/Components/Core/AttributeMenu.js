//Done Cleaning
import { remove } from 'lodash';
import React, { Component , useState} from 'react';
import Door from '../../Entities/Door';
import { getAllDoorStyles, removeCabinetByProps, getCabinetByProps, removeCabinetByID } from '../../Utilities/CabinetDB';


export default class AttributeMenu extends Component{
	constructor(props){
		super(props)
		this.state = {
			doorOptionList: [],
			selectedDoorStyle: ""
		}
        // this is used to inject doorstyleonchange method for testing
        if (this.props?.doorStyleOnChange){
            this.doorStyleOnChange = this.props?.doorStyleOnChange
        }


	}

	/**
	 * This method will fire upon clicking ona Cabinet. It will open
	 * the attribute menu that can be used to change attributes of 
	 * the selected cabinet or delete the selected cabinet from the room
	 */
	async componentDidMount(){
		this.setState({})
		const res = await getAllDoorStyles()
        res.forEach((entry)=>{
            delete entry._id
            delete entry._labels

            this.state.doorOptionList.push({...entry})
        })

        this.setState({})
		
		if(this.props.room &&this.props.room.state?.currentSelected?.attributes != null)
		{
			if(this.props.currentSelection?.attributes?.door.doorStyle != null) // .attributes.door.doorStyle ?
			{
				this.setState({selectedDoorStyle: this.props.currentSelection.attributes.door.doorID})// .attributes.door.doorStyle ?
			}
		}
	}

	/**
	 * This method will fire when the doorStyle is changed, it will update the 
	 * object in the entity list and the cabinet in the database with the new doorStyle
	 * @param {
	 * } e 
	 */
	doorStyleOnChange = (e) =>{
		const cabData = this.props.currentSelection;
        if(!cabData?.attributes) {
            cabData.attributes = {}
        }

        const doorData = this.state.doorOptionList.find(({doorID})=> doorID==e.target.value)
        let newSelection =  Object.assign(new Door(), doorData)
        cabData.attributes.door = newSelection
        this.props.room.setState({})

        this.setState({selectedDoorStyle: e.target.vale})
	}

	/**
	 * This method is fired when the delete button in the attribute menu is pressed.
	 * It will remove the cabinet from the room while also deleting it from the room 
	 * stored in the database.
	 */
    async deleteHandler(cabData, entityList) {
        remove(entityList, (item) => item.id === cabData.id)
        await removeCabinetByID(cabData.id)
		this.props.room.setState({currentSelected : null})
        return entityList
    }

	render(){
		
        const attributeMenuStyle = {
            // move catalog to the left as small floating window
            // may be worth it to eventually move into modules.css, more research needed
            backgroundColor: "lightblue",
            width: "400px",
            height: "400px",
            position:"absolute",

            //Center div
            left: '100%',
            top:'50%',
            transform:"translate(-100%,-50%)"
        };
		return(
		<div data-testid="attribute-menu" className="AttributeMenu" style={attributeMenuStyle}>
			<select className="DoorSelect"
                    data-testid="door-select"
                    onChange={this.doorStyleOnChange}
                    value={this.state.selectedDoorStyle}
			>
				{
				this.state.doorOptionList.map((door)=> (
					 <option className={door.doorStyle} key={door.doorID} value={door.doorID}>
						 {door.doorStyle} 
					 </option>
					 
					))
				}
			</select>
			<button onClick={async () =>{ this.props.room.setState({
                    entityList:await this.deleteHandler(this.props.currentSelection, this.props.room.state.entityList )
                })} } >Delete</button>

		</div>

		)
	}

}
