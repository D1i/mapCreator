"use strict";

const screen = document.getElementById( 'screen' );

const globalPosition = {
    x: 0,
    y: 0
}

const screenPosition = {
    x: 0,
    y: 0,
    scale: 100
}

const chunkList = []

let coardinatsStartEvent = 0;

const directionalEffect = ( z, number ) => {
    const radian = 180 / Math.PI;
    return {
        coifX: number * Math.cos( z / radian ),
        coifY: number * Math.sin( z / radian )
    }
}

const moveScreen = ( e ) => {
    screenPosition.x += e.movementX * ( 100 / screenPosition.scale );
    screenPosition.y -= e.movementY * ( 100 / screenPosition.scale );
}

screen.addEventListener( 'mousedown', () => {
    screen.addEventListener( "mousemove", moveScreen, false )
} );
screen.addEventListener( 'mouseup', () => {
    screen.removeEventListener( 'mousemove', moveScreen, false );
} );

screen.addEventListener( "wheel", ( e ) => {
    if ( e.deltaY === -100 ) {
        screenPosition.scale += 5;
    } else {
        screenPosition.scale -= screenPosition.scale !== 5 ? 5 : 0;
    }
} )

class Chunk {
    constructor( neighboringChunk, directionCreated ) {
        if ( directionCreated === 'top' ) {
            this.directionCreatedTop( neighboringChunk );
        } else if ( directionCreated === 'left' ) {
            this.directionCreatedLeft( neighboringChunk );
        } else if ( directionCreated === 'left' ) {
            this.directionCreatedBottom( neighboringChunk );
        } else if ( directionCreated === 'left' ) {
            this.directionCreatedRight( neighboringChunk );
        } else if ( directionCreated !== 'init chunk' ) {
            return;
        }

        this.from = { x: 0, y: 0 };
        this.to = { x: 500, y: 500 };
        this.objectList = [];
    }

    directionCreatedTop = ( neighboringChunk ) => {
        this.from = { x: neighboringChunk.to.x, y: neighboringChunk.to.y };
        this.to = { x: neighboringChunk.to.x, y: neighboringChunk.to.y + 500 };
    }

    directionCreatedLeft = ( neighboringChunk ) => {
        this.from = { x: neighboringChunk.to.x, y: neighboringChunk.to.y };
        this.to = { x: neighboringChunk.to.x - 500, y: neighboringChunk.to.y };
    }

    directionCreatedBottom = ( neighboringChunk ) => {
        this.from = { x: neighboringChunk.to.x, y: neighboringChunk.to.y };
        this.to = { x: neighboringChunk.to.x, y: neighboringChunk.to.y - 500 };
    }

    directionCreatedRight = ( neighboringChunk ) => {
        this.from = { x: neighboringChunk.to.x, y: neighboringChunk.to.y };
        this.to = { x: neighboringChunk.to.x + 500, y: neighboringChunk.to.y };
    }

    addObject = ( object ) => {
        this.objectList.push( object );
    }
}

class Object {
    constructor( x, y, width, height, color, type ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.texture = '';
        this.type = type;
        this.elem = this.createElem();
    }

    createElem = () => {
        const elem = document.createElement( 'div' );
        elem.style.position = `absolute`;
        elem.style.backgroundColor = `${this.color}`;
        return elem;
    }

    showElem = () => {
        screen.append( this.elem );
    }

    hideElem = () => {
        this.elem.remove();
    }

    rerenderElem = () => {
        this.elem.style.left = `${( screenPosition.x + this.x ) * ( screenPosition.scale / 100 )}px`;
        this.elem.style.bottom = `${( screenPosition.y + this.x ) * ( screenPosition.scale / 100 )}px`;
        this.elem.style.width = `${this.width * ( screenPosition.scale / 100 )}px`;
        this.elem.style.height = `${this.height * ( screenPosition.scale / 100 )}px`;
    }
}

function visualistationSystem() {
    chunkList.forEach( ( chunk ) => {
        chunk.objectList.forEach( ( object ) => {
            object.rerenderElem();
        } );
    } );
}

function createObject(x, y, width, height, color, type) {
    const obj = new Object( x, y, width, height, color, type );
    obj.createElem();
    obj.showElem();
    chunkList[0].addObject( obj );
}

chunkList.push( new Chunk( 'init chunk', 'init chunk' ) );

createObject( 0, 0, 20, 20, '#F00', 'test' );
createObject( 250, 250, 20, 20, '#0F0', 'test' );
createObject( 500, 500, 20, 20, '#00F', 'test' );

setInterval( visualistationSystem, 15 );
