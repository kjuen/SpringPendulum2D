/*global resize_graphs */

/**
 * @author Alex Scaliante Coelho / https://github.com/alexscaliante
 * @author K. Juenemann / https://github.com/kjuen
*/

/*global Spring, JXG */

Spring.Graphs = {
    graphBoardsArray : [],
    needUpdate : false
};



//* Time domain graphs
Spring.Graphs.timeDomainGraphBoard = JXG.JSXGraph.initBoard('timeDomainGraph',
                                                            {boundingbox:[-0.1, 30, 20, -30],
                                                             keepaspectratio: false,
                                                             axis: true,
                                                             grid: false,
                                                             pan: {
                                                                 needShift: false,
                                                                 enabled: true
                                                             },
                                                             showCopyright: true,
                                                             showNavigation: true});
Spring.Graphs.graphBoardsArray.push(Spring.Graphs.timeDomainGraphBoard);

Spring.Graphs.timeDomainGraph =
    Spring.Graphs.timeDomainGraphBoard.create('functiongraph',
                                              [Spring.dyn.positionFunc,
                                               function() {return Math.max(0, Spring.Graphs.timeDomainGraphBoard.getBoundingBox()[0]);},
                                               function() {return Spring.Graphs.timeDomainGraphBoard.getBoundingBox()[2];}],
                                              {strokeColor:'blue',
                                               strokeWidth:2,
                                               needsRegularUpdate: false,
                                               highlight: false});

Spring.Graphs.timeDomainExtForceGraph =
    Spring.Graphs.timeDomainGraphBoard.create('functiongraph',
                                              [Spring.dyn.extForce,
                                               function() {return Math.max(0, Spring.Graphs.timeDomainGraphBoard.getBoundingBox()[0]);},
                                               function() {return Spring.Graphs.timeDomainGraphBoard.getBoundingBox()[2];}],
                                              {strokeColor:'red',
                                               strokeWidth:2,
                                               needsRegularUpdate: false, highlight: false});

Spring.Graphs.timeDomainGlider =
    Spring.Graphs.timeDomainGraphBoard.create('point',
                                              [0,Spring.dyn.positionFunc(0)],
                                              {fixed: true,
                                               fillColor: 'blue',
                                               strokeColor: 'blue',
                                               highlight: false,
                                               withLabel: false,
                                               showInfobox: false});

Spring.Graphs.timeDomainExtForceGlider =
    Spring.Graphs.timeDomainGraphBoard.create('point',
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
var extFreqPointAttr = {fixed: true,
                        fillColor: 'red',
                        strokeColor: 'red',
                        highlight: false,
                        withLabel: false,
                        showInfobox: true,  // klappt nicht !?!
                        infoboxtext: 'External frequency'};

var eigenFreqPointAttr = {fixed: true,
                          fillColor: 'green',
                          strokeColor: 'green',
                          size: 1,
                          highlight: false,
                          withLabel: false,
                          showInfobox: true,
                          infoboxtext: 'Eigenfrequency'};



Spring.Graphs.freqDomainMagGraphBoard = JXG.JSXGraph.initBoard('freqDomainMagGraph',
                                                               {boundingbox:[-0.1, 10, 10, -10],
                                                                keepaspectratio: false,
                                                                axis: true,
                                                                grid: true,
                                                                pan: {
                                                                    needShift: false,
                                                                    enabled: true
                                                                },
                                                                showCopyright: true,
                                                                showNavigation: true});
Spring.Graphs.graphBoardsArray.push(Spring.Graphs.freqDomainMagGraphBoard);

Spring.Graphs.freqDomainMagGraph =
    Spring.Graphs.freqDomainMagGraphBoard.create('functiongraph',
                                                 [Spring.dyn.magResp,
                                                  function() {return Math.max(0,Spring.Graphs.freqDomainMagGraphBoard.getBoundingBox()[0]);},
                                                  function() {return Spring.Graphs.freqDomainMagGraphBoard.getBoundingBox()[2];}],
                                                 {strokeColor:'blue',
                                                  strokeWidth:2,
                                                  highlight: false});

Spring.Graphs.freqDomainMagPointExtFreq =
    Spring.Graphs.freqDomainMagGraphBoard.create('point',
                                                   [Spring.dyn.we,
                                                    Spring.dyn.magResp(Spring.dyn.we)],
                                                   extFreqPointAttr);
Spring.Graphs.freqDomainMagPointEigenFreq =
    Spring.Graphs.freqDomainMagGraphBoard.create('point',
                                                   [Spring.dyn.w0,
                                                    Spring.dyn.magResp(Spring.dyn.w0)],
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
Spring.Graphs.freqDomainMagDbGraphBoard = JXG.JSXGraph.initBoard('freqDomainMagDbGraph',
                                                                 {boundingbox:[-1, 25, 2, -50],
                                                                  keepaspectratio: false,
                                                                  //axis: true,
                                                                  //grid: true,
                                                                  pan: {
                                                                      needShift: false,
                                                                      enabled: true
                                                                  },
                                                                  showCopyright: true,
                                                                  showNavigation: true});
Spring.Graphs.graphBoardsArray.push(Spring.Graphs.freqDomainMagDbGraphBoard);
// x-axis:
Spring.Graphs.xAxisMagDb =
    Spring.Graphs.freqDomainMagDbGraphBoard.create('axis', [[0,0],[1,0]],
                                                   {
                                                       ticks:
                                                       {
                                                           insertTicks: false,
                                                           minorTicks: 0
                                                       }
                                                   });

Spring.Graphs.xAxisMagDb.defaultTicks.generateLabelText = generateLogLabels;
createLogXTicks(Spring.Graphs.freqDomainMagDbGraphBoard);

// y-axis
Spring.Graphs.freqDomainMagDbGraphBoard.create('axis', [[0,0],[0,1]]);
                                               // {ticks: {
                                               //     label: {
                                               //         anchorX: 'right',
                                               //         offset: [20,0]
                                               //     },
                                               //     insertTicks: false,
                                               //     ticksDistance: 10,
                                               //     minorTicks: 1
                                               // }});



// Spring.Graphs.freqDomainMagDbGraph =
//     Spring.Graphs.freqDomainMagDbGraphBoard.create('curve',
//                                                    [function(t){ return Math.LOG10E*Math.log(t);},
//                                                     Spring.dyn.magRespDb,
//                                                     -100,100],
//                                                    {strokeColor:'blue',
//                                                     strokeWidth:2,
//                                                     highlight: false});
Spring.Graphs.freqDomainMagDbGraph =
    Spring.Graphs.freqDomainMagDbGraphBoard.create('functiongraph',
                                                   [function(logw){ return Spring.dyn.magRespDb(Math.pow(10,logw));},
                                                    function() {return Spring.Graphs.freqDomainMagDbGraphBoard.getBoundingBox()[0];},
                                                    function() {return Spring.Graphs.freqDomainMagDbGraphBoard.getBoundingBox()[2];}],
                                                   {strokeColor:'blue',
                                                    strokeWidth:2,
                                                    highlight: false});

Spring.Graphs.freqDomainMagDbPointExtFreq =
    Spring.Graphs.freqDomainMagDbGraphBoard.create('point',
                                                   [Math.LOG10E*Math.log(Spring.dyn.we),
                                                    Spring.dyn.magRespDb(Spring.dyn.we)],
                                                   extFreqPointAttr);
Spring.Graphs.freqDomainMagDbPointEigenFreq =
    Spring.Graphs.freqDomainMagDbGraphBoard.create('point',
                                                   [Math.LOG10E*Math.log(Spring.dyn.w0),
                                                    Spring.dyn.magRespDb(Spring.dyn.w0)],
                                                   eigenFreqPointAttr);
// Spring.Graphs.freqDomainMagDbGraphBoard.fullUpdate();
$("#freqDomainMagDbGraph").hide();

//** Phase plot
Spring.Graphs.freqDomainPhaseGraphBoard = JXG.JSXGraph.initBoard('freqDomainPhaseGraph',
                                                                 {boundingbox:[-1, 50, 2, -220],
                                                                  keepaspectratio: false,
                                                                  // axis: true,
                                                                  // grid: false,
                                                                  pan: {
                                                                      needShift: false,
                                                                      enabled: true
                                                                  },
                                                                  showCopyright: true,
                                                                  showNavigation: true});
Spring.Graphs.graphBoardsArray.push(Spring.Graphs.freqDomainPhaseGraphBoard);
// x-axis:
Spring.Graphs.xAxisPhase =
    Spring.Graphs.freqDomainPhaseGraphBoard.create('axis', [[0,0],[1,0]],
                                                   {
                                                       ticks:
                                                       {
                                                           insertTicks: false,
                                                           minorTicks: 0
                                                       }
                                                   });
Spring.Graphs.xAxisPhase.defaultTicks.generateLabelText = generateLogLabels;
createLogXTicks(Spring.Graphs.freqDomainPhaseGraphBoard);
// y-axis
Spring.Graphs.freqDomainPhaseGraphBoard.create('axis', [[0,0],[0,1]],
                                               {ticks: {
                                                   insertTicks: false,
                                                   ticksDistance: 45
                                               }});
Spring.Graphs.freqDomainPhaseGraph =
    Spring.Graphs.freqDomainPhaseGraphBoard.create('functiongraph',
                                                   [function(logw){ return Spring.dyn.phaseResp(Math.pow(10,logw));},
                                                    function() {return Spring.Graphs.freqDomainPhaseGraphBoard.getBoundingBox()[0];},
                                                    function() {return Spring.Graphs.freqDomainPhaseGraphBoard.getBoundingBox()[2];}],
                                                   {strokeColor:'blue',
                                                    strokeWidth:2,
                                                    highlight: false});



Spring.Graphs.freqDomainPhasePointExtFreq =
    Spring.Graphs.freqDomainPhaseGraphBoard.create('point',
                                                   [Math.LOG10E*Math.log(Spring.dyn.we),
                                                    Spring.dyn.phaseResp(Spring.dyn.we)],
                                                   extFreqPointAttr);
Spring.Graphs.freqDomainPhasePointEigenFreq =
    Spring.Graphs.freqDomainPhaseGraphBoard.create('point',
                                                   [Math.LOG10E*Math.log(Spring.dyn.w0),
                                                    Spring.dyn.phaseResp(Spring.dyn.w0)],
                                                   eigenFreqPointAttr);


$("#freqDomainPhaseGraph").hide();



//* Pole zero map
Spring.Graphs.poleZeroGraphBoard = JXG.JSXGraph.initBoard('poleZeroGraph',
                                                          {boundingbox:[-3, 3, 1, -3],
                                                           keepaspectratio: false,
                                                           axis: true,
                                                           grid: true,
                                                           pan: {
                                                               needShift: false,
                                                               enabled: true
                                                           },
                                                           showCopyright: true,
                                                           showNavigation: true});

Spring.Graphs.graphBoardsArray.push(Spring.Graphs.poleZeroGraphBoard);
Spring.Graphs.poleZeroGraphBoard.create('axis', [[0,0],[1,0]],
                                        {ticks:
                                         { minorTicks: 0,
                                           minTicksDistance: 18,
                                           insertTicks: true,
                                           ticksDistance: 1}
                                        });
Spring.Graphs.poleZeroGraphBoard.create('axis', [[0,0],[0,1]],
                                        {ticks: {
                                            minorTicks: 0,
                                            minTicksDistance: 18,
                                            insertTicks: true,
                                            ticksDistance: 1}
                                        });

Spring.Graphs.poleZeroPole1 = Spring.Graphs.poleZeroGraphBoard.create('point',
                                                                      [Spring.dyn.poles[0]],
                                                                      {
                                                                          fixed: true,
                                                                          face: "cross",
                                                                          label: {strokeColor: "red"},
                                                                          withLabel: false,
                                                                          showInfobox: true,
                                                                          name: "1"
                                                                      });
Spring.Graphs.poleZeroPole2 = Spring.Graphs.poleZeroGraphBoard.create('point',
                                                                      [Spring.dyn.poles[1]],
                                                                      {
                                                                          fixed: true,
                                                                          face: "cross",
                                                                          label: {strokeColor: "red"},
                                                                          withLabel: false,
                                                                          showInfobox: true,
                                                                          name: "2"
                                                                      });



//* Graph resize and update

/**
 * resizes graphs
*/
Spring.Graphs.resize = function() {
    "use strict";
    this.graphBoardsArray.forEach(function (board){
        if($(board.containerObj).is(":hidden") === false) {
            var ar = board.canvasHeight / board.canvasWidth;

            var newWidth = 0.9*$('#right').width();
            var newHeight = newWidth * ar;

            board.resizeContainer(newWidth, newHeight);
            board.fullUpdate();
        }
    });
}


/**
 * updates graphs, by default only when they are active
 * @param{boolean} force also update hidden panels (default false)
 */
Spring.Graphs.update = function (force) {
    "use strict";
    force = (force === undefined ? false : force);

    if(force || $(this.timeDomainGraphBoard.containerObj).is(":hidden") === false) {
        this.timeDomainGraph.Y = Spring.dyn.positionFunc;
        if(Spring.ProgState.timeDomainTrace) {
            var t = ((Spring.ProgState.resetTime === undefined) ? 0 : Spring.ProgState.resetTime)/1000;
            this.timeDomainGlider.visible(true);
            this.timeDomainExtForceGlider.visible(true);
            this.timeDomainGlider.setPosition(JXG.COORDS_BY_USER,[t,Spring.dyn.positionFunc(t)]);
            this.timeDomainExtForceGlider.setPosition(JXG.COORDS_BY_USER,[t,Spring.dyn.extForce(t)]);
        } else {
            this.timeDomainGlider.visible(false);
            this.timeDomainExtForceGlider.visible(false);
        }
        this.timeDomainGraphBoard.fullUpdate();
    }

    if(force || $(this.freqDomainMagGraphBoard.containerObj).is(":hidden") === false)
    {
        this.freqDomainMagGraph.Y = Spring.dyn.magResp;
        this.freqDomainMagGraph.updateCurve();
        this.freqDomainMagGraphBoard.update();
        this.freqDomainMagPointExtFreq.setPosition(JXG.COORDS_BY_USER,[Spring.dyn.we,
                                                                       this.freqDomainMagGraph.Y(Spring.dyn.we)]);
        this.freqDomainMagPointEigenFreq.setPosition(JXG.COORDS_BY_USER,[Spring.dyn.w0,
                                                                         this.freqDomainMagGraph.Y(Spring.dyn.w0)]);
        this.freqDomainMagGraphBoard.fullUpdate();
    }
    else if(force || $(this.freqDomainMagDbGraphBoard.containerObj).is(":hidden") === false)
    {
        this.freqDomainMagDbGraph.Y = function(logw){ return Spring.dyn.magRespDb(Math.pow(10,logw));};
        // this.freqDomainMagDbGraph.updateCurve();
        // this.freqDomainMagDbGraphBoard.update();
        this.freqDomainMagDbPointExtFreq.setPosition(JXG.COORDS_BY_USER,[Math.LOG10E*Math.log(Spring.dyn.we),
                                                                         Spring.dyn.magRespDb(Spring.dyn.we)]);
        this.freqDomainMagDbPointEigenFreq.setPosition(JXG.COORDS_BY_USER,[Math.LOG10E*Math.log(Spring.dyn.w0),
                                                                           Spring.dyn.magRespDb(Spring.dyn.w0)]);
        this.freqDomainMagDbGraphBoard.fullUpdate();
    }
    else if(force || $(this.freqDomainPhaseGraphBoard.containerObj).is(":hidden") === false)
    {
        this.freqDomainPhaseGraph.Y = function(logw){ return Spring.dyn.phaseResp(Math.pow(10,logw));};
        // this.freqDomainPhaseGraph.updateCurve();
        // this.freqDomainPhaseGraphBoard.update();
        this.freqDomainPhasePointExtFreq.setPosition(JXG.COORDS_BY_USER,
                                                     [Math.LOG10E*Math.log(Spring.dyn.we),
                                                      Spring.dyn.phaseResp(Spring.dyn.we)]);
        this.freqDomainPhasePointEigenFreq.setPosition(JXG.COORDS_BY_USER,
                                                       [Math.LOG10E*Math.log(Spring.dyn.w0),
                                                        Spring.dyn.phaseResp(Spring.dyn.w0)]);
        this.freqDomainPhaseGraphBoard.fullUpdate();
    }

    if(force || $(this.poleZeroGraphBoard.containerObj).is(":hidden") === false) {
        this.poleZeroPole1.setPosition(JXG.COORDS_BY_USER , Spring.dyn.poles[0]);
        this.poleZeroPole2.setPosition(JXG.COORDS_BY_USER , Spring.dyn.poles[1]);
        this.poleZeroGraphBoard.update();
    }
};


//* Rendering
function render() {

    requestAnimationFrame(render);

    if(Spring.Graphs.needUpdate) {
        Spring.Graphs.needUpdate = false;
        Spring.Graphs.update();
        Spring.Graphs.resize();
    }

    if(Spring.ProgState.runningFlag) {
        if(Spring.ProgState.startTime === undefined) {
            Spring.ProgState.startTime = Date.now();
        }
        var t = (Date.now() - Spring.ProgState.startTime)/1000;
        Spring.redraw(t);

        if(Spring.ProgState.timeDomainTrace) {
            Spring.Graphs.timeDomainGlider.visible(true);
            Spring.Graphs.timeDomainExtForceGlider.visible(true);
            Spring.Graphs.timeDomainGlider.setPosition(JXG.COORDS_BY_USER,[t,Spring.dyn.positionFunc(t)]);
            Spring.Graphs.timeDomainExtForceGlider.setPosition(JXG.COORDS_BY_USER,[t,Spring.dyn.extForce(t)]);
            Spring.Graphs.timeDomainGraphBoard.update();
        } else {
            Spring.Graphs.timeDomainGlider.visible(false);
            Spring.Graphs.timeDomainExtForceGlider.visible(false);
        }
    }
}
render();
