
var graphBoardsArray = [];

//* Time domain graphs
var timeDomainGraphBoard = JXG.JSXGraph.initBoard('timeDomainGraph',
                                                  {boundingbox:[-0.1, 30, 20, -30],
                                                   keepaspectratio: false,
                                                   axis: true,
                                                   grid: false,
                                                   pan: {
                                                       needShift: false,
                                                       needTwoFingers: true,
                                                       enabled: true
                                                   },
                                                   showCopyright: false,
                                                   showNavigation: true});
graphBoardsArray.push(timeDomainGraphBoard);

var timeDomainGraph = timeDomainGraphBoard.create('functiongraph',
                                                  [springDyn.positionFunc, 0],
                                                  {strokeColor:'blue',
                                                   strokeWidth:2,
                                                   needsRegularUpdate: false,
                                                   highlight: false});

var timeDomainExtForceGraph = timeDomainGraphBoard.create('functiongraph',
                                                          [springDyn.extForce, 0],
                                                          {strokeColor:'red',
                                                           strokeWidth:2,
                                                           needsRegularUpdate: false, highlight: false});

var timeDomainGlider = timeDomainGraphBoard.create('point',
                                                   [0,springDyn.positionFunc(0)],
                                                   {fixed: true,
                                                    fillColor: 'blue',
                                                    strokeColor: 'blue',
                                                    highlight: false,
                                                    withLabel: false,
                                                    showInfobox: false});

var timeDomainExtForceGlider = timeDomainGraphBoard.create('point',
                                                           [0,0],
                                                           {fixed: true,
                                                            fillColor: 'red',
                                                            strokeColor: 'red',
                                                            highlight: false,
                                                            withLabel: false,
                                                            showInfobox: false});


//* Frequency domain graphs
//** Magnitude plot (non-log)

// attributes of point showing external frequency
// TODO: infoboxtext klappt nicht!
var extFreqPointAttr = {fixed: true,
                        fillColor: 'red',
                        strokeColor: 'red',
                        highlight: false,
                        withLabel: false,
                        showInfobox: true,
                        infoboxtext: 'External frequency'};

var eigenFreqPointAttr = {fixed: true,
                          fillColor: 'green',
                          strokeColor: 'green',
                          size: 1,
                          highlight: false,
                          withLabel: false,
                          showInfobox: true,
                          infoboxtext: 'Eigenfrequency'};



var freqDomainMagGraphBoard = JXG.JSXGraph.initBoard('freqDomainMagGraph',
                                                     {boundingbox:[-0.1, 10, 10, -10],
                                                      keepaspectratio: false,
                                                      axis: true,
                                                      grid: true,
                                                      pan: {
                                                          needShift: false,
                                                          needTwoFingers: true,
                                                          enabled: true
                                                      },
                                                      showCopyright: false,
                                                      showNavigation: true});
graphBoardsArray.push(freqDomainMagGraphBoard);

var freqDomainMagGraph = freqDomainMagGraphBoard.create('functiongraph',
                                                        [springDyn.magResp, 0],
                                                        {strokeColor:'blue', strokeWidth:2, highlight: false});

var freqDomainMagPointExtFreq = freqDomainMagGraphBoard.create('point',
                                                               [springDyn.we, springDyn.magResp(springDyn.we)],
                                                               extFreqPointAttr);
var freqDomainMagPointEigenFreq = freqDomainMagGraphBoard.create('point',
                                                                 [springDyn.w0, springDyn.magResp(springDyn.w0)],
                                                                 eigenFreqPointAttr);


//** Helper functions for log plots

// This is a copy from the JXGGraph source
function generateLogLabels (tick, zero, value) {
    var Mat = JXG.Math;
    var Type = JXG;

    var labelText,
        distance = this.getDistanceFromZero(zero, tick);

    if (Math.abs(distance) < Mat.eps) { // Point is zero
        labelText = '0';
    } else {
        // No value provided, equidistant, so assign distance as value
        if (!Type.exists(value)) { // could be null or undefined
            value = distance / this.visProp.scale;
        }

        labelText = value.toString();

        // if value is Number
        if (Type.isNumber(value)) {
            if (labelText.length > this.visProp.maxlabellength || labelText.indexOf('e') !== -1) {
                labelText = value.toPrecision(this.visProp.precision).toString();
            }
            if (labelText.indexOf('.') > -1 && labelText.indexOf('e') === -1) {
                // trim trailing zeros
                labelText = labelText.replace(/0+$/, '');
                // trim trailing .
                labelText = labelText.replace(/\.$/, '');
            }
        }

        if (this.visProp.scalesymbol.length > 0) {
            if (labelText === '1') {
                labelText = this.visProp.scalesymbol;
            } else if (labelText === '-1') {
                labelText = '-' + this.visProp.scalesymbol;
            } else if (labelText !== '0') {
                labelText = labelText + this.visProp.scalesymbol;
            }
        }

        // add log scale
        labelText = '10<sup>'+ labelText + '</sup>';
    }

    return labelText;
}


// create log ticks
function createLogXTicks(graph) {
    for(var i=2; i<10; i++)
    {
        var line = graph.create('line',[[Math.LOG10E*Math.log(i), 0],[2,0]],{visible: false});
        var tick = graph.create('ticks', [line,1],
                                {insertTicks: false,
                                 minorTicks: 0,
                                 drawZero: true,
                                 strokeColor: '#666666',
                                 strokeOpacity: 0.125,
                                 majorHeight: -1,
                                 fixed: true,
                                 highlight: false});
    }
}

//** Magnitude plot (log-scale)
var freqDomainMagDbGraphBoard = JXG.JSXGraph.initBoard('freqDomainMagDbGraph',
                                                       {boundingbox:[-1, 50, 2, -50],
                                                        keepaspectratio: false,
                                                        //axis: true,
                                                        //grid: true,
                                                        pan: {
                                                            needShift: false,
                                                            needTwoFingers: true,
                                                            enabled: true
                                                        },
                                                        showCopyright: false,
                                                        showNavigation: true});

// x-axis:
var xAxisMagDb = freqDomainMagDbGraphBoard.create('axis', [[0,0],[1,0]],
                                                  {
                                                      ticks:
                                                      {
                                                          insertTicks: false,
                                                          minorTicks: 0
                                                      }
                                                  });

xAxisMagDb.defaultTicks.generateLabelText = generateLogLabels;
createLogXTicks(freqDomainMagDbGraphBoard);

// y-axis
freqDomainMagDbGraphBoard.create('axis', [[0,0],[0,1]],
                                 {ticks: {
                                     label: {
                                         anchorX: 'right',
                                         offset: [20,0]
                                     },
                                     insertTicks: false,
                                     ticksDistance: 10,
                                     minorTicks: 1
                                 }});
freqDomainMagDbGraphBoard.fullUpdate();


var freqDomainMagDbGraph =
        freqDomainMagDbGraphBoard.create('curve',
                                         [function(t){ return Math.LOG10E*Math.log(t);},
                                          springDyn.magRespDb,
                                          -100,100],
                                         {strokeColor:'blue',
                                          strokeWidth:2,
                                          highlight: false});

var freqDomainMagDbPointExtFreq = freqDomainMagDbGraphBoard.create('point',
                                                                   [Math.LOG10E*Math.log(springDyn.we), springDyn.magRespDb(springDyn.we)],
                                                                   extFreqPointAttr);
var freqDomainMagDbPointEigenFreq = freqDomainMagDbGraphBoard.create('point',
                                                                     [Math.LOG10E*Math.log(springDyn.w0), springDyn.magRespDb(springDyn.w0)],
                                                                     eigenFreqPointAttr);

$("#freqDomainMagDbGraph").hide();

//** Phase plot
var freqDomainPhaseGraphBoard = JXG.JSXGraph.initBoard('freqDomainPhaseGraph',
                                                       {boundingbox:[-1, 50, 2, -220],
                                                        keepaspectratio: false,
                                                        // axis: true,
                                                        // grid: false,
                                                        pan: {
                                                            needShift: false,
                                                            needTwoFingers: true,
                                                            enabled: true
                                                        },
                                                        showCopyright: false,
                                                        showNavigation: true});
// x-axis:
var xAxisPhase = freqDomainPhaseGraphBoard.create('axis', [[0,0],[1,0]],
                                                  {
                                                      ticks:
                                                      {
                                                          insertTicks: false,
                                                          minorTicks: 0
                                                      }
                                                  });
xAxisPhase.defaultTicks.generateLabelText = generateLogLabels;
createLogXTicks(freqDomainPhaseGraphBoard);
// y-axis
freqDomainPhaseGraphBoard.create('axis', [[0,0],[0,1]],
                                 {ticks: {
                                     insertTicks: false,
                                     ticksDistance: 45
                                 }});
var freqDomainPhaseGraph = freqDomainPhaseGraphBoard.create('curve',
                                                            [function(t){ return Math.LOG10E*Math.log(t);},
                                                             springDyn.phaseResp,
                                                             -100,100],
                                                            {strokeColor:'blue',
                                                             strokeWidth:2,
                                                             highlight: false});
var freqDomainPhasePointExtFreq = freqDomainPhaseGraphBoard.create('point',
                                                                   [Math.LOG10E*Math.log(springDyn.we),
                                                                    springDyn.phaseResp(springDyn.we)],
                                                                   extFreqPointAttr);
var freqDomainPhasePointEigenFreq = freqDomainPhaseGraphBoard.create('point',
                                                                     [Math.LOG10E*Math.log(springDyn.w0),
                                                                      springDyn.phaseResp(springDyn.w0)],
                                                                     eigenFreqPointAttr);


$("#freqDomainPhaseGraph").hide();



//* Pole zero map
var poleZeroGraphBoard = JXG.JSXGraph.initBoard('poleZeroGraph',
                                                {boundingbox:[-3, 3, 1, -3],
                                                 keepaspectratio: false,
                                                 axis: true,
                                                 grid: true,
                                                 pan: {
                                                     needShift: false,
                                                     needTwoFingers: true,
                                                     enabled: true
                                                 },
                                                 showCopyright: false,
                                                 showNavigation: true});

graphBoardsArray.push(poleZeroGraphBoard);
poleZeroGraphBoard.create('axis', [[0,0],[1,0]],
                          {ticks:
                           { minorTicks: 0,
                             minTicksDistance: 18,
                             insertTicks: true,
                             ticksDistance: 1}
                          });
poleZeroGraphBoard.create('axis', [[0,0],[0,1]],
                          {ticks: {
                              minorTicks: 0,
                              minTicksDistance: 18,
                              insertTicks: true,
                              ticksDistance: 1}
                          });

var poleZeroPole1 = poleZeroGraphBoard.create('point',
                                              [springDyn.poles[0]],
                                              {
                                                  fixed: true,
                                                  face: "cross",
                                                  label: {strokeColor: "red"},
                                                  withLabel: false,
                                                  showInfobox: true,
                                                  name: "1"
                                              });
var poleZeroPole2 = poleZeroGraphBoard.create('point',
                                              [springDyn.poles[1]],
                                              {
                                                  fixed: true,
                                                  face: "cross",
                                                  label: {strokeColor: "red"},
                                                  withLabel: false,
                                                  showInfobox: true,
                                                  name: "2"
                                              });

//* Rendering

function updateGraphs() {

    if($(timeDomainGraphBoard.containerObj).is(":hidden") === false)
    timeDomainGraph.Y = springDyn.positionFunc;
    //timeDomainGraph.updateCurve();   // TODO: Ist das hier noetig (unten ist doch fullUpdate)?
    if(ProgState.timeDomainTrace) {
        timeDomainGlider.visible(true);
        timeDomainExtForceGlider.visible(true);
        timeDomainGlider.setPosition(JXG.COORDS_BY_USER,[0,springDyn.positionFunc(0)]);
        timeDomainExtForceGlider.setPosition(JXG.COORDS_BY_USER,[0,0]);
    } else {
        timeDomainGlider.visible(false);
        timeDomainExtForceGlider.visible(false);
    }
    timeDomainGraphBoard.fullUpdate();


    if($(freqDomainMagGraphBoard.containerObj).is(":hidden") === false)
    {
        freqDomainMagGraph.Y = springDyn.magResp;
        freqDomainMagGraph.updateCurve();
        freqDomainMagGraphBoard.update();
        freqDomainMagPointExtFreq.setPosition(JXG.COORDS_BY_USER,[springDyn.we,
                                                                  freqDomainMagGraph.Y(springDyn.we)]);
        freqDomainMagPointEigenFreq.setPosition(JXG.COORDS_BY_USER,[springDyn.w0,
                                                                    freqDomainMagGraph.Y(springDyn.w0)]);
    }
    else if($(freqDomainMagDbGraphBoard.containerObj).is(":hidden") === false)
    {
        freqDomainMagDbGraph.Y = springDyn.magRespDb;
        freqDomainMagDbGraph.updateCurve();
        freqDomainMagDbGraphBoard.update();
        freqDomainMagDbPointExtFreq.setPosition(JXG.COORDS_BY_USER,[Math.LOG10E*Math.log(springDyn.we),
                                                                    freqDomainMagDbGraph.Y(springDyn.we)]);
        freqDomainMagDbPointEigenFreq.setPosition(JXG.COORDS_BY_USER,[Math.LOG10E*Math.log(springDyn.w0),
                                                                      freqDomainMagDbGraph.Y(springDyn.w0)]);
    }
    else if($(freqDomainPhaseGraphBoard.containerObj).is(":hidden") === false)
    {
        freqDomainPhaseGraph.Y = springDyn.phaseResp;
        freqDomainPhaseGraph.updateCurve();
        freqDomainPhaseGraphBoard.update();
        freqDomainPhasePointExtFreq.setPosition(JXG.COORDS_BY_USER,
                                                [Math.LOG10E*Math.log(springDyn.we),
                                                 freqDomainPhaseGraph.Y(springDyn.we)]);
        freqDomainPhasePointEigenFreq.setPosition(JXG.COORDS_BY_USER,
                                                  [Math.LOG10E*Math.log(springDyn.w0),
                                                   freqDomainPhaseGraph.Y(springDyn.w0)]);
    }
    else if($(poleZeroGraphBoard.containerObj).is(":hidden") === false) {
        // FIXME: Das hier sollte doch nur ausgeführt werden, wenn der Plot aktiv ist!!
        poleZeroPole1.setPosition(JXG.COORDS_BY_USER , springDyn.poles[0]);
        poleZeroPole2.setPosition(JXG.COORDS_BY_USER , springDyn.poles[1]);
        poleZeroGraphBoard.update();

        // poleZeroGraphBoard.zoomElements([poleZeroPole1, poleZeroPole2]);
        // poleZeroGraphBoard.moveOrigin(poleZeroGraphBoard.origin.scrCoords[1],
        //                               poleZeroGraphBoard.canvasHeight / 2);
    }

}

function render() {

    requestAnimationFrame(render);

    if(ProgState.startTime === undefined) {
        ProgState.startTime = Date.now();
    }
    var t = 0;
    if(ProgState.runningFlag === true) {
        t = (Date.now() - ProgState.startTime)/1000;
    }


    var ut = springDyn.extForce(t);

    if(ProgState.timeDomainTrace) {
        timeDomainGlider.visible(true);
        timeDomainExtForceGlider.visible(true);
        timeDomainGlider.setPosition(JXG.COORDS_BY_USER,[t,springDyn.positionFunc(t)]);
        timeDomainExtForceGlider.setPosition(JXG.COORDS_BY_USER,[t,ut]);
        timeDomainGraphBoard.update();
        // timeDomainGraphBoard.moveOrigin(timeDomainGraphBoard.containerObj.clientWidth/2 - (timeDomainGraphBoard.unitX * t), timeDomainGraphBoard.canvasHeight / 2);
    } else {
        timeDomainGlider.visible(false);
        timeDomainExtForceGlider.visible(false);
    }


    // externe Kraft:
    // var u0 = 25;
    SpringConsts.bigWheelR = springDyn.u0;
    // var we = 0.8*3*Math.PI/4;
    // var extForceFunc = function(t) {return springDyn.u0
    //     * Math.sin(springDyn.we*t);};
    // var sd = new SpringDynamics(3*Math.PI/4, 0.25);
    // var v0 = 0;
    // var yfunc = springDyn.getPositionFunc(springDyn.u0, springDyn.we,50, v0);

    var y = SpringConsts.yMount + SpringConsts.springLen - springDyn.positionFunc(t);
    var yup = SpringConsts.yMount - ut;

    ctx.clearRect(0,SpringConsts.ceilThickness, canvas.width,
                  canvas.height-SpringConsts.ceilThickness);
    drawAntrieb(-springDyn.we, t, yup);
    // outerRect();
    drawSpring(yup, y - SpringConsts.massRadius);
    drawMass(y);
    if(ProgState.timeDomainTrace) {
        drawTrace(function(t) {return SpringConsts.yMount + SpringConsts.springLen -
                               springDyn.positionFunc(t);},
                  t, 'rgba(0,0,255, 0.6)');
        drawTrace(function(t) {return SpringConsts.yMount -
                               springDyn.extForce(t);},
                  t, 'rgba(255,0,0, 0.6)');
    }
}
render();
