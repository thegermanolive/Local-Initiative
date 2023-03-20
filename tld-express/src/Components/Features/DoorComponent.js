import { Box } from '@react-three/drei';
import { cloneDeep } from 'lodash';
import React, { createRef, Suspense, useMemo, useRef } from 'react'
import Door from "../../Entities/Door"

import GetMeshFromPath from '../Shared/Models/GetMeshFromPath';

export class DoorComponent extends React.Component {
    valid = false;
    
    constructor(props) {
        super(props)

        this.offset = cloneDeep(this.props.offset )
        this.position = cloneDeep(this.props.position)
        
        let rotation = cloneDeep(this.props.rotation)


        this.props.door.position = cloneDeep(this.props.position)

        this.offset[2] = (Math.cos(rotation[2]) * (this.props.offset[2]))
        this.offset[0] = (Math.sin(rotation[2]) * (this.props.offset[0]))

    }

    render() {
        const path = this.props.door.modelPath
     
        const [x, y, z] = this.offset
        const modpos = [x, y + this.position[1] ,z]

        const position =  modpos

        const rotation = this.props.rotation  

        return (
                <mesh

                    position={position}
                    rotation={rotation}
                    >
                    <GetMeshFromPath modelPath={path} attach="material"  material={this.props.material} color={this.props.color}/>

                </mesh>
        )

    }
}
