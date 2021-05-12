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

const screenSize = {
    width: window.innerWidth,
    height: window.innerHeight
}

const chunkList = []

const chunkListVisualisation = []

let coardinatsStartEvent = 0;

const directionalEffect = ( z, number ) => {
    const radian = 180 / Math.PI;
    return {
        coifX: number * Math.cos( z / radian ),
        coifY: number * Math.sin( z / radian )
    }
}

const moveScreen = ( e ) => {
    screenPosition.x -= e.movementX * ( 100 / screenPosition.scale );
    screenPosition.y += e.movementY * ( 100 / screenPosition.scale );
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
        this.from = { x: 0, y: 0 };
        this.to = { x: chunkSize, y: chunkSize };
        this.objectList = [];

        if ( directionCreated === 'top' ) {
            this.directionCreatedTop( neighboringChunk );
        } else if ( directionCreated === 'left' ) {
            this.directionCreatedLeft( neighboringChunk );
        } else if ( directionCreated === 'bottom' ) {
            this.directionCreatedBottom( neighboringChunk );
        } else if ( directionCreated === 'right' ) {
            this.directionCreatedRight( neighboringChunk );
        } else if ( directionCreated !== 'init chunk' ) {
            return;
        }
    }

    directionCreatedTop = ( neighboringChunk ) => {
        this.from = { x: neighboringChunk.to.x, y: neighboringChunk.to.y };
        this.to = { x: neighboringChunk.to.x, y: neighboringChunk.to.y + chunkSize };
    }

    directionCreatedLeft = ( neighboringChunk ) => {
        this.from = { x: neighboringChunk.to.x, y: neighboringChunk.to.y };
        this.to = { x: neighboringChunk.to.x - chunkSize, y: neighboringChunk.to.y };
    }

    directionCreatedBottom = ( neighboringChunk ) => {
        this.from = { x: neighboringChunk.to.x, y: neighboringChunk.to.y };
        this.to = { x: neighboringChunk.to.x , y: neighboringChunk.to.y - chunkSize };
    }

    directionCreatedRight = ( neighboringChunk ) => {
        this.from = { x: neighboringChunk.to.x, y: neighboringChunk.to.y };
        this.to = { x: neighboringChunk.to.x + chunkSize, y: neighboringChunk.to.y };
    }

    addObject = ( object ) => {
        this.objectList.push( object );
    }
}

class Object {
    constructor( x, y, width, height, color, type ) {
        this.x = x - width / 2;
        this.y = y - height / 2;
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
        if (this.type === 'chunk') {
            elem.style.zIndex = -1;
            elem.style.border = 'solid 1px #000';
            elem.style.boxSizing = 'border-box';
        }
        return elem;
    }

    showElem = () => {
        screen.append( this.elem );
    }

    hideElem = () => {
        this.elem.remove();
    }

    rerenderElem = () => {
        this.elem.style.left = `${(screenSize.width / 2 + -screenPosition.x + this.x ) * ( screenPosition.scale / 100 )}px`;
        this.elem.style.bottom = `${(screenSize.height / 2 + -screenPosition.y + this.y ) * ( screenPosition.scale / 100 )}px`;
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
    chunkListVisualisation.forEach((chunk) => {
        chunk.rerenderElem();
    });
}

function createObject(x, y, width, height, color, type) {
    if (type === 'chunk') {
        const obj = new Object( x, y, width, height, color, 'chunk' );
        obj.createElem();
        obj.showElem();
        chunkListVisualisation.push( obj );
    } else {
        const obj = new Object( x, y, width, height, color, type );
        obj.createElem();
        obj.showElem();
        chunkList[0].addObject( obj );
    }
}


function addCalibrationDrawing() {
    createObject( 0, 0, 100, 100, '#F00', 'test' );
    createObject( 250, 250, 50, 50, '#0F0', 'test' );
    createObject( 500, 500, 10, 10, '#00F', 'test' );
    createObject( -250, 250, 50, 50, '#0F0', 'test' );
    createObject( -500, 500, 10, 10, '#00F', 'test' );
    createObject( -250, -250, 50, 50, '#0F0', 'test' );
    createObject( -500, -500, 10, 10, '#00F', 'test' );
    createObject( 250, -250, 50, 50, '#0F0', 'test' );
    createObject( 500, -500, 10, 10, '#00F', 'test' );
}

chunkList.push( new Chunk( 'init chunk', 'init chunk' ) );
chunkList.push( new Chunk( chunkList[0], 'top' ) );//1
chunkList.push( new Chunk( chunkList[0], 'left' ) );//2
chunkList.push( new Chunk( chunkList[0], 'bottom' ) );//3
chunkList.push( new Chunk( chunkList[0], 'right' ) );//4
chunkList.push( new Chunk( chunkList[4], 'bottom' ) );//5
chunkList.push( new Chunk( chunkList[4], 'top' ) );//6
chunkList.push( new Chunk( chunkList[2], 'bottom' ) );//7
chunkList.push( new Chunk( chunkList[2], 'top' ) );//8

addCalibrationDrawing();

setInterval( visualistationSystem, 15 );
