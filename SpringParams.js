/**
 * @author K. Juenemann / https://github.com/kjuen
*/


var Spring = {

    // State of the program
    ProgState : {
        runningFlag : true,     // state of Start/Reset buttons
        startTime : undefined,
        resetTime : undefined,
        timeDomainTrace : true   // Trace button in Spring window
    },

    // Spring constants: mainly used for drawing the spring.
    Consts : {
        springLen: 200,     // natural spring length
        massRadius: 30,   // radius of mass
        X : 275,          // x position of motion
        lightX : 10,     // x position of light source
        lightY : 150,
        springN : 7,   // Anzahl Windungen
        springR : 20,  // Radius der Feder
        smallWheelR : 8,  // Radius kleines Antriebsrad
        bigWheelR : 30,  // Radius großes Antriebsrad
        distWheels : 150,  // Distanz zwischen Mittelpunkten der Raeder
        ceilThickness : 30,   // Dicke der Decke
        ceilX : 100,
        ceilWidth : 400,
        yMount : 120
    }
};
