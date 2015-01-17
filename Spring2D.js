/**
 *
 * @author K. Juenemann / https://github.com/kjuen
*/

/*global Spring */

Spring.canvas = document.getElementById("mycanvas");
Spring.ctx = Spring.canvas.getContext("2d");

/**
 * draw pendulum mass at position (Spring.Consts.X,y).
 * @param {number} y vertical position of pendulum mass
 * @param {boolean} withLighSource flag whether or not to use the light source
 *                  with position defined in Spring.Consts.
*/
Spring.drawMass = function(y, withLighSource) {
    withLighSource = (withLighSource===undefined) ? true : withLighSource;
    var ctx = this.ctx;

    ctx.beginPath();
    ctx.arc(Spring.Consts.X, y, Spring.Consts.massRadius, 0, 2*Math.PI);

    if(withLighSource) {
        var distML =
                Math.sqrt( (Spring.Consts.X-Spring.Consts.lightX)*
                           (Spring.Consts.X-Spring.Consts.lightX) +
                           (y-Spring.Consts.lightY)*(y-Spring.Consts.lightY));
        var gradCenterX = Spring.Consts.X  -
                0.5*Spring.Consts.massRadius*(Spring.Consts.X-Spring.Consts.lightX)/distML;
        var gradCenterY = y  - 0.5*Spring.Consts.massRadius*(y-Spring.Consts.lightY)/distML;

        var grad = ctx.createRadialGradient(gradCenterX, gradCenterY, 5,
                                            gradCenterX, gradCenterY, 1.75*Spring.Consts.massRadius);
        grad.addColorStop(0,"rgb(100, 100, 200");
        grad.addColorStop(1,"rgb(0,0,0");
        ctx.fillStyle = grad;
    } else {
        ctx.fillStyle="black";
    }
    ctx.fill();
};


/**
 * draw the entire antrieb.
 * @param {number} om angular frequency of turning wheels
 * @param {number} t current time
 * @param {number} yup vertical position of mount point of spring
*/
Spring.drawAntrieb = function(om, t, yup) {
    var ctx = this.ctx;
    ctx.fillStyle = "rgba(60,10,10,0.8)";
    ctx.shadowColor = "rgba(60, 10, 10, 0.3)";
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 1;
    ctx.fillRect(Spring.Consts.ceilX,0,Spring.Consts.ceilWidth, Spring.Consts.ceilThickness-1);

    ctx.strokeStyle="black";

    var distWheelCeil = 10;
    // Mittelpunkt kleines Rad
    var smallWheelX = Spring.Consts.X+Spring.Consts.smallWheelR;
    var smallWheelY = Spring.Consts.ceilThickness + distWheelCeil + Spring.Consts.smallWheelR;
    // Mittelpunkt grosses Rad
    var bigWheelX = smallWheelX + Spring.Consts.distWheels;
    var bigWheelY = Spring.Consts.ceilThickness + distWheelCeil + Spring.Consts.bigWheelR;


    ctx.beginPath();
    ctx.moveTo(Spring.Consts.X+Spring.Consts.smallWheelR, Spring.Consts.ceilThickness);
    ctx.lineTo(Spring.Consts.X+Spring.Consts.smallWheelR, Spring.Consts.ceilThickness + distWheelCeil);
    ctx.moveTo(bigWheelX, Spring.Consts.ceilThickness);
    ctx.lineTo(bigWheelX, Spring.Consts.ceilThickness + distWheelCeil);
    ctx.stroke();

    // wheels
    ctx.fillStyle = "rgba(150,150,150,1)";
    ctx.strokeStyle = "rgba(100,100,100,1)";
    ctx.beginPath();
    ctx.arc(smallWheelX, smallWheelY, Spring.Consts.smallWheelR, 0, 2*Math.PI);
    ctx.arc(bigWheelX, bigWheelY, Spring.Consts.bigWheelR, 0, 2*Math.PI);
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(smallWheelX, smallWheelY, 0.8, 0, 2*Math.PI);
    ctx.arc(bigWheelX, bigWheelY, 1, 0, 2*Math.PI);
    ctx.fill();


    var phase = Spring.Consts.bigWheelR / Spring.Consts.distWheels;
    var dotX = bigWheelX - 0.8*Spring.Consts.bigWheelR*Math.sin(om * t - phase);
    var dotY = bigWheelY - 0.8*Spring.Consts.bigWheelR*Math.cos(om * t - phase);
    ctx.beginPath();
    ctx.moveTo(dotX, dotY);
    ctx.arc(dotX, dotY, 4, 0, 2*Math.PI);
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fill();

    var phi = om*t;//  + 2*Math.PI/2;
    var psi = (1-Math.cos(phi))/(Spring.Consts.distWheels/(0.8*Spring.Consts.bigWheelR) + Math.sin(phi));
    ctx.beginPath();
    ctx.moveTo(dotX, dotY);
    ctx.arc(smallWheelX, smallWheelY, Spring.Consts.smallWheelR, 3*Math.PI/2+psi, Math.PI, true);

    ctx.lineTo(Spring.Consts.X, yup);
    ctx.lineWidth=1.5;
    ctx.strokeStyle="black";
    ctx.stroke();
};



/**
 * draw the spring.
 * @param {number} yup vertical position of upper spring end.
 * @param {number} ydown vertical position of lower spring end.
*/
Spring.drawSpring = function(yup, ydown) {
    if(ydown - Spring.Consts.windMinHeight * Spring.Consts.springN <= yup) {
        alert(Spring.langObj.largeOscErr);
    }

    var topRadius = 5;
    var y1 = yup + 1.5*topRadius;
    var springLen = ydown - y1;
    var ctx = this.ctx;

    // mount point
    ctx.beginPath();
    ctx.arc(Spring.Consts.X, yup, topRadius, 0, 2*Math.PI);
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
    ctx.moveTo(Spring.Consts.X, yup + topRadius/2);
    ctx.lineTo(Spring.Consts.X, y1);

    var N = 200;   // Dieser Wert ist sehr kritisch fuer die Laufzeit
    var om = 2*Math.PI/springLen*Spring.Consts.springN;
    for(var k=1; k<=N; ++k) {
        var d = k/N*springLen;
        var corrFac = 1+0.02*Math.cos(om*(d-springLen/2));
        ctx.lineTo(Spring.Consts.X+ Spring.Consts.springR * Math.sin(om*(d-springLen/2))*corrFac,
                   y1+d*corrFac);
    }
    ctx.lineTo(Spring.Consts.X, ydown);
    ctx.stroke();
};

/**
 * draw the trace of a moving object
 * @param {function} func function that describes the trace
 * @param {number} t current time
 * @param {number} yup vertical position of upper spring end.
*/
Spring.drawTrace = function(func, t, strokeStyle) {
    var ctx = this.ctx;
    var vx = 30;    // trace speed
    var N0 = 100;
    var DeltaX = vx*(t+ Spring.Prog.offset);
    var x = Spring.Consts.X - DeltaX;
    var dx, dt;
    if(x<0) {
        x = 0;
        dx = Spring.Consts.X/N0;
        var DeltaT = Spring.Consts.X/vx;
        t = t - DeltaT;
        dt = DeltaT/ N0;
    } else {
        dx = DeltaX / N0;
        dt = (t + Spring.Prog.offset)/N0;
        t = - Spring.Prog.offset;
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
};


/**
 * draw the trace of a delta function
 * @param {number} height (in pixel) of delta peak
 * @param {number} yOffset y coordinate of zero-line of delta function
 * @param {number} t current time
 * @param {number} yup vertical position of upper spring end.
*/
Spring.drawDeltaTrace = function(height, yOffset, t, strokeStyle) {
    var ctx = this.ctx;
    var vx = 30;   // trace speed
    var arrowLen = 5;
    var DeltaX = vx*(t+ Spring.Prog.offset);
    var peakX =  Spring.Consts.X - vx*t;  // peak position
    var x = Spring.Consts.X - DeltaX;
    var dx, dt;
    if(x<0) {
        x = 0;
    }
    ctx.beginPath();
    ctx.moveTo(x, yOffset);
    ctx.lineTo(Spring.Consts.X, yOffset);
    if(t > 0 && peakX > 0 && Spring.dyn.u0 > 0) {
        // draw the delta peak
        ctx.moveTo(peakX, yOffset);
        ctx.lineTo(peakX, yOffset-height);
        ctx.lineTo(peakX+arrowLen, yOffset-height+arrowLen);
        ctx.moveTo(peakX, yOffset-height);
        ctx.lineTo(peakX-arrowLen, yOffset-height+arrowLen);
    }
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
};

/**
 * redraw everything at time t
*/
Spring.redraw = function() {
    var t = Spring.Prog.getSimTime();
    var deltaForce = Spring.dyn.mode === Spring.dyn.IMP_RESP;
    Spring.ctx.clearRect(0,0,Spring.ctx.canvas.width, Spring.ctx.canvas.height);
    var y = Spring.Consts.yMount + Spring.Consts.springLen - Spring.dyn.positionFunc(t);
    var yup = Spring.Consts.yMount - Spring.dyn.extForce(t);

    Spring.drawAntrieb(-Spring.dyn.we, t, yup);
    Spring.drawSpring(yup, y - Spring.Consts.massRadius);
    Spring.drawMass(y);
    if(Spring.Prog.timeDomainTrace) {
        // draw trace in spring plot
        Spring.drawTrace(function(t) {return Spring.Consts.yMount + Spring.Consts.springLen -
                                      Spring.dyn.positionFunc(t);},
                         t, 'rgba(0,0,255, 0.6)');
        if(deltaForce) {
            Spring.drawDeltaTrace(Spring.Consts.deltaHeight, Spring.Consts.yMount,
                                  t, 'rgba(255,0,0, 0.6)');
        } else {
            Spring.drawTrace(function(t) {return Spring.Consts.yMount -
                                          Spring.dyn.extForce(t);},
                             t, 'rgba(255,0,0, 0.6)');
        }
    }
};
