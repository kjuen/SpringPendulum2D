// --- Definition of constants and program state ---

// State of the program
var ProgState = {
    runningFlag : true,     // state of Start/Reset buttons
    startTime : undefined,
    timeDomainTrace : true   // Trace button in Spring window
};

// Spring constants: mainly used for drawing the spring.
var SpringConsts = {
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
};

// create SpringDynamics object with useful default parameters
var springDyn = new SpringDynamics(
    1.9, // w0
    0.1, // d
    0,   // y0
    0,   // v0
    25,  // u0
    3   // we
);
