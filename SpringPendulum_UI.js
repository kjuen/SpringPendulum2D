/**
 * @author Alex Scaliante Coelho / https://github.com/alexscaliante
 * @author K. Juenemann / https://github.com/kjuen
 */


/*global Spring */

$(function() {
    "use strict";

    $("#container").split({
        orientation: 'vertical',
        limit: 350,    // minimum width of plots-panel
        position: '60%',    // size ratio of panels
        invisible: true,
        // onDrag: function () {
        //     resize_canvas();
        // },
        onDragEnd: function () {
            Spring.Graphs.resize();
        }
    });

    // control initial visibility of tabs
    // see here: http://www.primefaces.org/primeui/accordion.html
    // jquery doesn't allow to have multiple tabs open
    $("#tabs").puiaccordion({
        // activeIndex: [0,1,2,3,4],   // all tabs open
        activeIndex: [2,3],
        multiple: true,
        change:  function(event, panel) {
            // make sure, the opened graph gets updated
            Spring.Graphs.needUpdate = true;
        }
    });

    // init buttons
    $("#control-buttons").buttonset();

    $("#button-start").button({
        icons: { primary: "ui-icon-play"},
        disabled: true
    }).click( function(event){
        $(this).button("disable");
        $(this).next().button("enable");
        disableSliders();
        Spring.ProgState.runningFlag = true;
        Spring.ProgState.startTime = undefined;
    });

    $("#button-stop").button({
        icons: { primary: "ui-icon-stop"}
    }).click( function(event){
        $(this).button("disable");
        $(this).prev().button("enable");
        enableSliders();
        Spring.ProgState.runningFlag = false;
        Spring.ProgState.resetTime = Date.now() - Spring.ProgState.startTime;
    });

    // init sliders
    $("#eigenfrequency-slider").slider({
        value: Spring.dyn.w0,
        min: 0.1,
        max: 5,
        step: 0.1,
        slide: function( event, ui ) {
            $("#eigenfrequency").val(ui.value);
            Spring.dyn.w0 = ui.value;
            $("#initveloc-slider").slider("option", "min", Spring.Consts.springLen * ui.value * -0.4);
            $("#initveloc-slider").slider("option", "max", Spring.Consts.springLen * ui.value * 0.4);

            if ($("#initveloc-slider").slider("option","value") > $("#initveloc-slider").slider("option","max")) {

                $("#initveloc-slider").slider("option","value",$("#initveloc-slider").slider("option","max"));
            }
            else if ($("#initveloc-slider").slider("option","value") < $("#initveloc-slider").slider("option","min")) {

                $("#initveloc-slider").slider("option","value",$("#initveloc-slider").slider("option","min"));
            }
            Spring.Graphs.update();
            Spring.redraw(Spring.ProgState.resetTime/1000);
        }
    });
    $("#eigenfrequency").val($("#eigenfrequency-slider").slider("value"));

    $("#damping-slider").slider({
        value: Spring.dyn.d,
        min: 0.05,
        max: 1.2,
        step: 0.01,
        slide: function( event, ui ) {
            $("#damping").val(ui.value);
            Spring.dyn.d = ui.value;
            Spring.Graphs.update();
            Spring.redraw(Spring.ProgState.resetTime/1000);
        }
    });
    $("#damping").val($("#damping-slider").slider("value"));

    $("#initpos-slider").slider({
        value: Spring.dyn.y0,
        min: Spring.Consts.springLen * -0.4,
        max: Spring.Consts.springLen * 0.4,
        step: 1,
        slide: function( event, ui ) {
            $("#initpos").val(ui.value);
            Spring.dyn.y0 = ui.value;
            Spring.Graphs.update();
            Spring.redraw(Spring.ProgState.resetTime/1000);
        }
    });
    $("#initpos").val($("#initpos-slider").slider("value"));

    $("#initveloc-slider").slider({
        value: Spring.dyn.v0,
        min: Spring.Consts.springLen * Spring.dyn.w0 * -0.4,
        max: Spring.Consts.springLen * Spring.dyn.w0 * 0.4,
        step: 1,
        slide: function( event, ui ) {
            $("#initveloc").val(ui.value);
            Spring.dyn.v0 = ui.value;
            Spring.Graphs.update();
            Spring.redraw(Spring.ProgState.resetTime/1000);
        }
    });
    $("#initveloc").val($("#initveloc-slider").slider("value"));

    $("#extforce-amp-slider").slider({
        value: Spring.dyn.u0,
        min: 0,
        max: 50,
        step: 1,
        slide: function( event, ui ) {
            $("#extforce-amp").val(ui.value);
            Spring.Consts.bigWheelR = ui.value;
            Spring.dyn.u0 = ui.value;
            Spring.Graphs.update();
            Spring.redraw(Spring.ProgState.resetTime/1000);
        }
    });
    $("#extforce-amp").val($("#extforce-amp-slider").slider("value"));

    $("#extforce-freq-slider").slider({
        value: Spring.dyn.we,
        min: 0,
        max: 5,
        step: 0.01,
        slide: function( event, ui ) {
            $("#extforce-freq").val(ui.value);
            Spring.dyn.we = ui.value;
            Spring.Graphs.update();
            Spring.redraw(Spring.ProgState.resetTime/1000);
        }
    });
    $("#extforce-freq").val($("#extforce-freq-slider").slider("value"));

    $("#freqdomain-mag-phase").buttonset();
    $("#freqdomain-mag").click(function() {
        $("#freqdomain-mag-db").button("enable");
        $("#freqDomainPhaseGraph").hide();
        $("#freqDomainMag"+(($("#freqdomain-mag-db").prop("checked") === true) ? "Db" : "")+"Graph").show();
        Spring.Graphs.needUpdate = true;
    });
    $("#freqdomain-phase").click(function() {
        $("#freqdomain-mag-db").button("disable");
        $("#freqDomainMagGraph").hide();
        $("#freqDomainMagDbGraph").hide();
        $("#freqDomainPhaseGraph").show();
        Spring.Graphs.needUpdate = true;
    });
    $("#freqdomain-mag-db").button().click(function() {
        if ($(this).prop("checked") === true) {
            $("#freqDomainMagGraph").hide();
            $("#freqDomainMagDbGraph").show();
        } else {
            $("#freqDomainMagDbGraph").hide();
            $("#freqDomainMagGraph").show();
        }
        Spring.Graphs.needUpdate = true;
    });

    // $("#timedomain-trace").prop("checked") = true;
    $("#timedomain-trace").button().click(function() {
        Spring.ProgState.timeDomainTrace = $(this).prop("checked");
    });

    // Disable all sliders for the first time
    disableSliders();
    var canvas = document.getElementById("mycanvas");
    var divcanvas = $("#canvas-container");

    canvas.width = divcanvas.width();
    canvas.height = divcanvas.height();
    // resize_canvas();
});

function enableSliders() {
    $("#eigenfrequency-slider").slider("enable");
    $("#damping-slider").slider("enable");
    $("#initpos-slider").slider("enable");
    $("#initveloc-slider").slider("enable");
    $("#extforce-amp-slider").slider("enable");
    $("#extforce-freq-slider").slider("enable");
}

function disableSliders() {
    $("#eigenfrequency-slider").slider("disable");
    $("#damping-slider").slider("disable");
    $("#initpos-slider").slider("disable");
    $("#initveloc-slider").slider("disable");
    $("#extforce-amp-slider").slider("disable");
    $("#extforce-freq-slider").slider("disable");
}
