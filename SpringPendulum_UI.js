// TODO: Die hier raus aus dem globalen Namespace
function resize_canvas()
{
    // TODO:  Hier die Spring2D neu zeichnen
    var canvas = document.getElementById("mycanvas");
    var divcanvas = $("#canvas-container");

    canvas.width = divcanvas.width();
    canvas.height = divcanvas.height();

    // redraw spring when not in run loop
    if(!Spring.ProgState.runningFlag) {
        var t = (Spring.ProgState.resetTime === undefined) ? 0 : Spring.ProgState.resetTime;
        Spring.redraw(t/1000);
    }

}

function resize_graphs() {
    Spring.Graphs.graphBoardsArray.forEach(function (board){
        if($(board.containerObj).is(":hidden") === false) {
            var oldWidth = board.canvasWidth;
            var newWidth = $(board.containerObj).width();
            var ratio = newWidth / oldWidth;
            var oldHeight = $(board.containerObj).height();
            var newHeight = newWidth * (2/3);
            $(board.containerObj).height(newHeight);
            board.renderer.resize(newWidth, newHeight);
            var bb = board.getBoundingBox();
            bb[2] *= ratio;
            board.setBoundingBox(bb, board.attr.keepaspectratio);
            board.fullUpdate();
        }
    });
}


$(function() {


    $("#container").split({
        orientation: 'vertical',
        limit: 350,
        position: '60%',
        invisible: true,
        onDrag: function () {
            resize_canvas();
        },
        onDragEnd: function () {
            resize_graphs();
        }
    });

    // control initial visibility of tabs
    // see here: http://www.primefaces.org/primeui/accordion.html
    $("#tabs").puiaccordion({
        // activeIndex: [0,1,2,3,4],   // all tabs open
        activeIndex: [2,3],
        multiple: true,
        change:  function(event, panel) {
            // update all graphs when tabs get active
            // TODO: How can we detect which tab has been opened?
            Spring.Graphs.update(true);
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
        Spring.Graphs.update();
    });
    $("#freqdomain-phase").click(function() {
        $("#freqdomain-mag-db").button("disable");
        $("#freqDomainMagGraph").hide();
        $("#freqDomainMagDbGraph").hide();
        $("#freqDomainPhaseGraph").show();
        Spring.Graphs.update();
    });
    $("#freqdomain-mag-db").button().click(function() {
        if ($(this).prop("checked") === true) {
            $("#freqDomainMagGraph").hide();
            $("#freqDomainMagDbGraph").show();
        } else {
            $("#freqDomainMagDbGraph").hide();
            $("#freqDomainMagGraph").show();
        }
        Spring.Graphs.update();
    });

    // $("#timedomain-trace").prop("checked") = true;
    $("#timedomain-trace").button().click(function() {
        Spring.ProgState.timeDomainTrace = $(this).prop("checked");
    });

    // Disable all sliders for the first time
    disableSliders();
    resize_canvas();
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
