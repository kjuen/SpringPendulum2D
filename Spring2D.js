// obtain 2d drawing context as global(!) variable
var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");

// SpringConsts defined in SpringParams.js

/**
 * draw pendulum mass at position (SpringConsts.X,y).
 * @param {number} y vertical position of pendulum mass
 * @param {boolean} withLighSource flag whether or not to use the light source
 *                  with position defined in SpringConsts.
*/
function drawMass(y, withLighSource) {
    withLighSource = (withLighSource===undefined) ? true : withLighSource;

    ctx.beginPath();
    ctx.arc(SpringConsts.X, y, SpringConsts.massRadius, 0, 2*Math.PI);

    if(withLighSource) {
        var distML = Math.sqrt( (SpringConsts.X-SpringConsts.lightX)*(SpringConsts.X-SpringConsts.lightX) +
                                (y-SpringConsts.lightY)*(y-SpringConsts.lightY));
        var gradCenterX = SpringConsts.X  - 0.5*SpringConsts.massRadius*(SpringConsts.X-SpringConsts.lightX)/distML;
        var gradCenterY = y  - 0.5*SpringConsts.massRadius*(y-SpringConsts.lightY)/distML;

        var grad = ctx.createRadialGradient(gradCenterX, gradCenterY, 5,
                                            gradCenterX, gradCenterY, 1.75*SpringConsts.massRadius);
        grad.addColorStop(0,"rgb(100, 100, 200");
        grad.addColorStop(1,"rgb(0,0,0");
        ctx.fillStyle = grad;
    } else {
        ctx.fillStyle="black";
    }
    ctx.fill();
}


/**
 * draw the entire antrieb.
 * @param {number} om angular frequency of turning wheels
 * @param {number} t current time
 * @param {number} yup vertical position of mount point of spring
*/
function drawAntrieb(om, t, yup) {
    ctx.fillStyle = "rgba(60,10,10,0.8)";
    ctx.shadowColor = "rgba(60, 10, 10, 0.3)";
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 1;
    ctx.fillRect(SpringConsts.ceilX,0,SpringConsts.ceilWidth, SpringConsts.ceilThickness-1);

    ctx.strokeStyle="black";

    var distWheelCeil = 10;
    // Mittelpunkt kleines Rad
    var smallWheelX = SpringConsts.X+SpringConsts.smallWheelR;
    var smallWheelY = SpringConsts.ceilThickness + distWheelCeil + SpringConsts.smallWheelR;
    // Mittelpunkt grosses Rad
    var bigWheelX = smallWheelX + SpringConsts.distWheels;
    var bigWheelY = SpringConsts.ceilThickness + distWheelCeil + SpringConsts.bigWheelR;


    ctx.beginPath();
    ctx.moveTo(SpringConsts.X+SpringConsts.smallWheelR, SpringConsts.ceilThickness);
    ctx.lineTo(SpringConsts.X+SpringConsts.smallWheelR, SpringConsts.ceilThickness + distWheelCeil);
    ctx.moveTo(bigWheelX, SpringConsts.ceilThickness);
    ctx.lineTo(bigWheelX, SpringConsts.ceilThickness + distWheelCeil);
    ctx.stroke();

    // wheels
    ctx.fillStyle = "rgba(150,150,150,1)";
    ctx.strokeStyle = "rgba(100,100,100,1)";
    ctx.beginPath();
    ctx.arc(smallWheelX, smallWheelY, SpringConsts.smallWheelR, 0, 2*Math.PI);
    ctx.arc(bigWheelX, bigWheelY, SpringConsts.bigWheelR, 0, 2*Math.PI);
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(smallWheelX, smallWheelY, 0.8, 0, 2*Math.PI);
    ctx.arc(bigWheelX, bigWheelY, 1, 0, 2*Math.PI);
    ctx.fill();


    var phase = SpringConsts.bigWheelR / SpringConsts.distWheels;
    var dotX = bigWheelX - 0.8*SpringConsts.bigWheelR*Math.sin(om * t - phase);
    var dotY = bigWheelY - 0.8*SpringConsts.bigWheelR*Math.cos(om * t - phase);
    ctx.beginPath();
    ctx.moveTo(dotX, dotY);
    ctx.arc(dotX, dotY, 4, 0, 2*Math.PI);
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fill();

    var phi = om*t;//  + 2*Math.PI/2;
    var psi = (1-Math.cos(phi))/(SpringConsts.distWheels/(0.8*SpringConsts.bigWheelR) + Math.sin(phi));
    ctx.beginPath();
    ctx.moveTo(dotX, dotY);
    ctx.arc(smallWheelX, smallWheelY, SpringConsts.smallWheelR, 3*Math.PI/2+psi, Math.PI, true);

    ctx.lineTo(SpringConsts.X, yup);
    ctx.lineWidth=1.5;
    ctx.strokeStyle="black";
    ctx.stroke();
}



/**
 * draw the spring.
 * @param {number} yup vertical position of upper spring end.
 * @param {number} yup vertical position of lower spring end.
*/
function drawSpring(yup, ydown) {
    var topRadius = 5;
    var y1 = yup + 1.5*topRadius;
    var springLen = ydown - y1;


    // mount point
    ctx.beginPath();
    ctx.arc(SpringConsts.X, yup, topRadius, 0, 2*Math.PI);
    ctx.fillStyle = "rgb(210,0,0)";
    ctx.fill();

    // spring
    ctx.strokeStyle = "rgba(75,75,75,1)";
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.shadowOffsetX =2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 2;
    ctx.shadowColor = "rgba(0, 0, 155, 0.5)";
    ctx.lineWidth=4;
    ctx.beginPath();
    ctx.moveTo(SpringConsts.X, yup + topRadius/2);
    ctx.lineTo(SpringConsts.X, y1);

    var N = 150;   // Dieser Wert ist sehr kritisch fuer die Laufzeit
    var om = 2*Math.PI/springLen*SpringConsts.springN;
    for(var k=1; k<=N; ++k) {
        var d = k/N*springLen;
        var corrFac = 1+0.02*Math.cos(om*(d-springLen/2));
        ctx.lineTo(SpringConsts.X+ SpringConsts.springR * Math.sin(om*(d-springLen/2))*corrFac,
                   y1+d*corrFac);
    }
    ctx.lineTo(SpringConsts.X, ydown);
    ctx.stroke();
}

/**
 * draw the trace of a moving object
 * @param {function} func function that describes the trace
 * @param {number} t current time
 * @param {number} yup vertical position of upper spring end.
*/
function drawTrace(func, t, strokeStyle) {
    var vx = 30;
    var N0 = 100;
    var DeltaX = vx*t;
    var x = SpringConsts.X - DeltaX;
    var dx, dt;
    if(x<0) {
        x = 0;
        dx = SpringConsts.X/N0;
        var DeltaT = SpringConsts.X/vx;
        t = t - DeltaT;
        dt = DeltaT/ N0;
    } else {
        dx = DeltaX / N0;
        dt = t/N0;
        t = 0;
    }
    ctx.beginPath();
    ctx.moveTo(x, func(t));
    for(var k = 1; k<=N0; ++k) {
        x+= dx;
        t+=dt;
        ctx.lineTo(x, func(t));
    }
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
}
