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
            console.log( 'ERROR CHUNK' )
            return;
        }

        if ( neighboringChunk === 'init chunk' ) {
            neighboringChunk = {};
            neighboringChunk.from = { x: '-', y: '-' }
            neighboringChunk.to = { x: '-', y: '-' }
        }

        //IS DEBUG MODE
        // console.log( `
        //
        //
        //
        // ++++++++++++++++++++++++++++++++++++++
        //                 X: ${neighboringChunk.to.x} Y: ${neighboringChunk.to.y}
        // ---------------0
        // |              |
        // |              |
        // |              |
        // |              |
        // |              |
        // 0---------------
        // X: ${neighboringChunk.from.x} Y: ${neighboringChunk.from.y}
        //
        //
        //
        // ======================================
        // TYPE: ${directionCreated}
        // ======================================
        //
        //
        //
        //                 X: ${this.to.x} Y: ${this.to.y}
        // ---------------0
        // |              |
        // |              |
        // |              |
        // |              |
        // |              |
        // 0---------------
        // X: ${this.from.x} Y: ${this.from.y}
        // ++++++++++++++++++++++++++++++++++++++
        //
        //
        //
        // ` )

    }

    directionCreatedTop = ( neighboringChunk ) => {
        this.from = { x: neighboringChunk.from.x, y: neighboringChunk.from.y + chunkSize };
        this.to = { x: neighboringChunk.to.x, y: neighboringChunk.to.y + chunkSize };
    }

    directionCreatedLeft = ( neighboringChunk ) => {
        this.from = { x: neighboringChunk.from.x - chunkSize, y: neighboringChunk.from.y };
        this.to = { x: neighboringChunk.to.x - chunkSize, y: neighboringChunk.to.y };
    }

    directionCreatedBottom = ( neighboringChunk ) => {
        this.from = { x: neighboringChunk.from.x, y: neighboringChunk.from.y - chunkSize };
        this.to = { x: neighboringChunk.to.x, y: neighboringChunk.to.y - chunkSize };
    }

    directionCreatedRight = ( neighboringChunk ) => {
        this.from = { x: neighboringChunk.from.x + chunkSize, y: neighboringChunk.from.y };
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

function loadingInfSTRING( func, text, isClear ) {
    if ( isClear ) console.clear();
    console.log( `начало ${text}` )
    func();
    console.log( `успешное окончание ${text}` )
}

function loadingInfFUNCTIONS( func, startCall, callout ) {
    const state = {};
    startCall( state );
    func();
    callout( state );
}

//INITS

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

function addCalibrationChunks() {
    chunkList.push( new Chunk( chunkList[0], 'top' ) );   //1
    chunkList.push( new Chunk( chunkList[0], 'left' ) );  //2
    chunkList.push( new Chunk( chunkList[0], 'bottom' ) );//3
    chunkList.push( new Chunk( chunkList[0], 'right' ) ); //4
    chunkList.push( new Chunk( chunkList[4], 'bottom' ) );//5
    chunkList.push( new Chunk( chunkList[4], 'top' ) );   //6
    chunkList.push( new Chunk( chunkList[2], 'bottom' ) );//7
    chunkList.push( new Chunk( chunkList[2], 'top' ) );   //8
}

function addingEvents() {
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
}

function initFirstChunks() {
    chunkList.push( new Chunk( 'init chunk', 'init chunk' ) );
}

function addingCalibrationParams() {
    addCalibrationDrawing();
    addCalibrationChunks();
}

function initIntervalForRerender() {
    setInterval( visualistationSystem, 15 );
}

function addingUI() {
    createObject( 0, 0, 5, 5, '#0005', 'fixed on screen NO SCALE' );

}

function initClientApp() {
    loadingInfSTRING( addingEvents, 'добавления событий' );
    loadingInfSTRING( initFirstChunks, 'инициализации чанков' );
    loadingInfSTRING( addingCalibrationParams, 'добавления калибровочных параметров' );
    loadingInfSTRING( initIntervalForRerender, 'инициализации таймера ререндера' );
    loadingInfSTRING( addingUI, 'добавления UI' );
    console.clear();
}

loadingInfSTRING( initClientApp, 'инициализации событий', true );
