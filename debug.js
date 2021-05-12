"use strict";

class C_DEBUG {
    constructor() {
        this._SCREEN = {
            DEBUG: document.getElementById( "debugScreen" )
        }
        this._ELEM_LIST = {
            screenDebug: this._SCREEN.DEBUG,
            x: null,
            y: null,
            scale: null
        },
       this. _STATE = {
            elemText: {
            },
            prevElemText: {
                x: 0,
                y: 0,
                scale: 100,
            },
            IS_INIT: false
        },
        this._FUNC = {
            RERENDER: () => {
                if ( this._STATE.elemText.x !== screenPosition.x ) {
                    this._STATE.elemText.x = screenPosition.x;
                    this._ELEM_LIST.x.value = Math.floor( this._STATE.elemText.x );
                }
                if ( this._STATE.elemText.y !== screenPosition.y ) {
                    this._STATE.elemText.y = screenPosition.y;
                    this._ELEM_LIST.y.value = Math.floor( this._STATE.elemText.y );
                }
                if ( this._STATE.elemText.scale !== screenPosition.scale ) {
                    this._STATE.elemText.scale = screenPosition.scale;
                    this._ELEM_LIST.scale.value = Math.floor( this._STATE.elemText.scale );
                }
            },
            INIT_DEBG_SCREEN: () => {
                this._ELEM_LIST.x = document.createElement( 'input' );
                this._ELEM_LIST.y = document.createElement( 'input' );
                this._ELEM_LIST.scale = document.createElement( 'input' );
    
                this._ELEM_LIST.x.type = 'number'; 
                this._ELEM_LIST.y.type = 'number';
                this._ELEM_LIST.scale.type = 'number';

                const xText = document.createElement( 'span' );
                const yText = document.createElement( 'span' );
                const scaleText = document.createElement( 'span' );

                xText.innerText = 'X: ';
                yText.innerText = 'Y: ';
                scaleText.innerText = 'SCALE: ';

                const xContainer = document.createElement( 'div' );
                const yContainer = document.createElement( 'div' );
                const scaleContainer = document.createElement( 'div' );

                xContainer.append( xText );
                yContainer.append( yText );
                scaleContainer.append( scaleText );

                xContainer.append( this._ELEM_LIST.x );
                yContainer.append( this._ELEM_LIST.y );
                scaleContainer.append( this._ELEM_LIST.scale );

                this._ELEM_LIST.screenDebug.append( xContainer );
                this._ELEM_LIST.screenDebug.append( yContainer );
                this._ELEM_LIST.screenDebug.append( scaleContainer );

                this._ELEM_LIST.x.addEventListener("change", ( e ) => {
                    const newValue = Number(e.target.value)
                    screenPosition.x = isNaN(newValue) ? screenPosition.x : newValue;
                })
                this._ELEM_LIST.y.addEventListener("change", ( e ) => {
                    const newValue = Number(e.target.value)
                    screenPosition.y = isNaN(newValue) ? screenPosition.y : newValue;
                })
                this._ELEM_LIST.scale.addEventListener("change", ( e ) => {
                    const newValue = Number(e.target.value)
                    screenPosition.scale = isNaN(newValue) ? screenPosition.scale : newValue;
                })
            }
        }
    }
}

const DEBUG = new C_DEBUG();


DEBUG._FUNC.INIT_DEBG_SCREEN();

setInterval( DEBUG._FUNC.RERENDER, 100 );
