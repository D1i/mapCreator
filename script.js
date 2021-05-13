"use strict";

const screen = document.getElementById( 'screen' );

const globalPosition = {
    x: 0,
    y: 0
}

const screenSize = {
    width: window.innerWidth,
    height: window.innerHeight
}

const screenPosition = {
    x: 0,
    y: 0,
    scale: ( screenSize.width + screenSize.height ) / 100
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
screen.addEventListener( 'mouseleave', () => {
    screen.removeEventListener( 'mousemove', moveScreen, false );
} )

screen.addEventListener( "wheel", ( e ) => {
    if ( e.deltaY === -100 ) {
        screenPosition.scale += screenPosition.scale > 5 ? 1 : 0.05;
    } else {
        screenPosition.scale -= screenPosition.scale > 5 ? 1 : 0.05;
        if ( screenPosition.scale <= 0 ) screenPosition.scale = 0.01;
    }
} )

window.addEventListener( 'resize', () => {
    screenSize.width = window.innerWidth;
    screenSize.height = window.innerHeight;
    screenPosition.scale = Math.floor( ( screenSize.width + screenSize.height ) / 100 );
} )

function findChunkByCoordinates( x, y ) {
    return chunkList.find( ( i ) => {
        return (
            i.from.x <= x && i.to.x >= x &&
            i.from.y <= y && i.to.y >= y
        )
    } )
}
class Chunk {
    constructor( neighboringChunk, directionCreated ) {
        this.from = { x: 0, y: 0 };
        this.to = { x: chunkSize, y: chunkSize };
        this.objectList = [];
        this.neighboringChunks = {
            top: null,
            left: null,
            bottom: null,
            right: null
        }

        if ( directionCreated === 'top' ) {
            this.directionCreatedTop( neighboringChunk );
        } else if ( directionCreated === 'left' ) {
            this.directionCreatedLeft( neighboringChunk );
        } else if ( directionCreated === 'bottom' ) {
            this.directionCreatedBottom( neighboringChunk );
        } else if ( directionCreated === 'right' ) {
            this.directionCreatedRight( neighboringChunk );
        } else if ( directionCreated !== 'init chunk' ) {
            console.log( 'ERROR CHUNK' )
            return;
        }

        if ( neighboringChunk === 'init chunk' ) {
            neighboringChunk = {};
            neighboringChunk.from = { x: '-', y: '-' }
            neighboringChunk.to = { x: '-', y: '-' }
        }
    }

    directionCreatedTop = ( neighboringChunk ) => {
        this.from = { x: neighboringChunk.from.x, y: neighboringChunk.from.y + chunkSize };
        this.to = { x: neighboringChunk.to.x, y: neighboringChunk.to.y + chunkSize };
        // this.addNeighboringChunk( neighboringChunk, 'bottom' );
    }

    directionCreatedLeft = ( neighboringChunk ) => {
        this.from = { x: neighboringChunk.from.x - chunkSize, y: neighboringChunk.from.y };
        this.to = { x: neighboringChunk.to.x - chunkSize, y: neighboringChunk.to.y };
        // this.addNeighboringChunk( neighboringChunk, 'right' );
    }

    directionCreatedBottom = ( neighboringChunk ) => {
        this.from = { x: neighboringChunk.from.x, y: neighboringChunk.from.y - chunkSize };
        this.to = { x: neighboringChunk.to.x, y: neighboringChunk.to.y - chunkSize };
        // this.addNeighboringChunk( neighboringChunk, 'top' );
    }

    directionCreatedRight = ( neighboringChunk ) => {
        this.from = { x: neighboringChunk.from.x + chunkSize, y: neighboringChunk.from.y };
        this.to = { x: neighboringChunk.to.x + chunkSize, y: neighboringChunk.to.y };
        // this.addNeighboringChunk( neighboringChunk, 'right' );
    }

    addNeighboringChunk = ( neighboringChunk, directionCreated ) => {
        this.neighboringChunks[directionCreated] = neighboringChunk;
        //Используйте при новых генерации соседних чаноков для дополнения списка соседей
    }

    hasNeighboringChunk = (directionCreated) => {
        return !!this.neighboringChunks[directionCreated];
    }

    setNeiFromChunks = () => {
        const center = {
            x: this.from.x + chunkSize / 2,
            y: this.from.y + chunkSize / 2
        }

        this.neighboringChunks = {
            top: findChunkByCoordinates( center.x, center.y + chunkSize ),
            left: findChunkByCoordinates( center.x - chunkSize, center.y ),
            bottom: findChunkByCoordinates( center.x, center.y - chunkSize ),
            right: findChunkByCoordinates( center.x + chunkSize, center.y )
        }

        this.neighboringChunks.top && (this.neighboringChunks.top.neighboringChunks.bottom = this);
        this.neighboringChunks.left && (this.neighboringChunks.left.neighboringChunks.right = this);
        this.neighboringChunks.bottom && (this.neighboringChunks.bottom.neighboringChunks.top = this);
        this.neighboringChunks.right && (this.neighboringChunks.right.neighboringChunks.left = this);
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
        if ( this.type === 'chunk' ) {
            elem.style.zIndex = '-1';
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
        if ( this.type === 'fixed on screen NO SCALE' ) {
            this.elem.style.left = `${screenSize.width / 2 + this.x}px`;
            this.elem.style.bottom = `${screenSize.height / 2 + this.y}px`;
            this.elem.style.width = `${this.width}px`;
            this.elem.style.height = `${this.height}px`;
            return;
        }
        this.elem.style.left = `${screenSize.width / 2 + ( -screenPosition.x + this.x ) * ( screenPosition.scale / 100 )}px`;
        this.elem.style.bottom = `${screenSize.height / 2 + ( -screenPosition.y + this.y ) * ( screenPosition.scale / 100 )}px`;
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
    chunkListVisualisation.forEach( ( chunk ) => {
        chunk.rerenderElem();
    } );
}

function createObject( x, y, width, height, color, type ) {
    if ( type === 'chunk' ) {
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

function generateChunk( neighboringChunk, directionCreated ) {
    if (neighboringChunk === 'init chunk') return;
    try {
        if (neighboringChunk.hasNeighboringChunk( directionCreated )) return 'error';
    } catch {
        debugger
    }
    const newChunk = new Chunk( neighboringChunk, directionCreated );
    // neighboringChunk.addNeighboringChunk( newChunk, directionCreated );
    chunkList.push( newChunk );
    return newChunk;
}

function generatChunksToObject( object ) {
    for (let genComplite = false; genComplite !== true;) {
        if ( chunkList[0].from.x > object.x - object.width / 2 || chunkList[0].to.x > object.x + object.width / 2 ) {
            
        } else if ( chunkList[0].from.y > object.y - object.height / 2 || chunkList[0].to.y > object.y + object.height / 2 ) {

        } else {
            genComplite = false;
        }
    }
    chunkList[0]
}

function setNeiFromChunks () {
    chunkList.forEach(i => {
        i.setNeiFromChunks();
    })
}

setNeiFromChunks();//ВО

function generateRouteByChunksForObject (x, y, width, height) {
    let chunkTarget = null;
    const chunkDirection = {
        x: true,
        y: true
    };
    
    if (chunkDirection.x < 0) {
        chunkDirection.x = false;
    }
    if (chunkDirection.y < 0) {
        chunkDirection.y = false;
    }

    chunkTarget = findChunkByCoordinates(x, y)


    if (chunkTarget) return chunkTarget;
    
    let iterator = 0;
    const moveIn = {
        x: 'S',
        y: 'S'
    };
    let currentChunk = chunkList[0];
    
    const genNeedChunk = () => {
        while (true) {
            console.log(moveIn);
            if (moveIn.x === 'N' && moveIn.y === 'N') {
                return currentChunk;
                break;
            }
            if (moveIn.x === 'S' || moveIn.y === 'S') {
                moveIn.x = (x > currentChunk.from.x && x > currentChunk.to.x) ? 'P' : (x < currentChunk.from.x && x < currentChunk.to.x) ? 'M' : 'N';
                moveIn.y = (y > currentChunk.from.y && y > currentChunk.to.y) ? 'P' : (y < currentChunk.from.y && y < currentChunk.to.y) ? 'M' : 'N';
            }
            if (moveIn.x !== 'N') {
                moveIn.x = (x > currentChunk.from.x && x > currentChunk.to.x) ? 'P' : (x < currentChunk.from.x && x < currentChunk.to.x) ? 'M' : 'N';
            }
            if (moveIn.y !== 'N') {
                moveIn.y = (y > currentChunk.from.y && y > currentChunk.to.y) ? 'P' : (y < currentChunk.from.y && y < currentChunk.to.y) ? 'M' : 'N';
            }
            if (moveIn.x !== 'N' && moveIn.x === 'P') {
                currentChunk = generateChunk(currentChunk, 'right');
            } else if (moveIn.x !== 'N') {
                currentChunk = generateChunk(currentChunk, 'left');
            }
            if (moveIn.y !== 'N' && moveIn.y === 'P') {
                currentChunk = generateChunk(currentChunk, 'top');
            } else if (moveIn.y !== 'N') {
                currentChunk = generateChunk(currentChunk, 'bottom');
            }
        }
    }

    return genNeedChunk();

}

function TEST_CHUNK_AUTO_ROUTS() {
    generateRouteByChunksForObject(0,-20000,100, 100)
    generateRouteByChunksForObject(0,20000,100, 100)
    generateRouteByChunksForObject(20000,0,100, 100)
    generateRouteByChunksForObject(-20000,0,100, 100)

    generateRouteByChunksForObject(20000,20000,100, 100)
    generateRouteByChunksForObject(-20000,20000,100, 100)
    generateRouteByChunksForObject(-20000,-20000,100, 100)
    generateRouteByChunksForObject(20000,-20000,100, 100)
}

TEST_CHUNK_AUTO_ROUTS()

addCalibrationDrawing();

setInterval( visualistationSystem, 15 );

//UI

createObject( 0, 0, 5, 5, '#0005', 'fixed on screen NO SCALE' );
