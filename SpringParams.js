/**
 * @author K. Juenemann / https://github.com/kjuen
*/


var Spring = {
    langObj : [],   // language object, to be set in SpringPendulum_UI.js

    // State of the program, in particular simulation time
    Prog : {
        timeDomainTrace : true,   // Trace button in Spring window
        RUN: 1,
        STOP: 2,
        PAUSE: 3,

        _startTime : Date.now(),
        _stopTime : undefined,
        _offset : 1000,   // time offset in milliseconds

        // return offset in seconds
        get offset() {
            return this._offset / 1000;
        },

        _state : 1,     // initial state = RUN
        get state() {
            return this._state;
        },
        set state(newState) {
            if(newState === this.STOP || newState === this.PAUSE) {
                this._stopTime = Date.now() - this._startTime;
            } else if(newState === this.RUN && this._state === this.STOP) {
                this._startTime = Date.now();
            }
            else if(newState === this.RUN && this._state === this.PAUSE) {
                this._startTime = Date.now() - this._stopTime;
            }
            this._state = newState;
        },

        // returns simulation used in render function
        getSimTime : function() {
            if(this._state === this.RUN) {
                return (Date.now() - this._startTime - this._offset)/1000;
            } else {
                return (this._stopTime - this._offset) / 1000;
            }
        }
    },

    // Spring constants: mainly used for drawing the spring.
    Consts : {
        springLen: 250,     // natural spring length
        massRadius: 30,   // radius of mass
        X : 275,          // x position of motion
        lightX : 10,     // x position of light source
        lightY : 150,
        springN : 9,   // Anzahl Windungen, muss ungerade sein
        windMinHeight: 3,  // Minimale Hoehe einer Windung
        springR : 20,  // Radius der Feder
        smallWheelR : 8,  // Radius kleines Antriebsrad
        bigWheelR : 30,  // Radius großes Antriebsrad
        distWheels : 150,  // Distanz zwischen Mittelpunkten der Raeder
        ceilThickness : 30,   // Dicke der Decke
        ceilX : 100,
        ceilWidth : 400,
        yMount : 120,
        deltaHeight: 80
    }
};
