
function resize_canvas()
{
    var canvas = document.getElementById("mycanvas");
    var divcanvas = $("#canvas-container");

    canvas.width = divcanvas.width();
    canvas.height = divcanvas.height();

}

function resize_graphs() {
    graphBoardsArray.forEach(function (board, index){
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
    $("#tabs").puiaccordion({
        // activeIndex: [0,1,2,3,4],   // all tabs open
        activeIndex: [2,3],
        multiple: true
    });

    $("#dialog-message").puidialog({
        //autoOpen: false,
        showEffect: 'fade',
        hideEffect: 'fade',
        minimizable: false,
        maximizable: false,
        buttons: [{
            text: 'OK',
            //icon: 'ui-icon-check',
            click: function(p1,p2) {
                $("#dialog-message").puidialog("hide");
            }
        }],
        resizable: false
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
        ProgState.runningFlag = true;
        ProgState.startTime = undefined;
    });

    $("#button-stop").button({
        icons: { primary: "ui-icon-stop"}
    }).click( function(event){
        $(this).button("disable");
        $(this).prev().button("enable");
        enableSliders();
        ProgState.runningFlag = false;
    });

    // init sliders
    $("#eigenfrequency-slider").slider({
        value: springDyn.w0,
        min: 0.1,
        max: 5,
        step: 0.1,
        slide: function( event, ui ) {
            $("#eigenfrequency").val(ui.value);
            springDyn.w0 = ui.value;
            $("#initveloc-slider").slider("option", "min", SpringConsts.springLen * ui.value * -0.4);
            $("#initveloc-slider").slider("option", "max", SpringConsts.springLen * ui.value * 0.4);

            if ($("#initveloc-slider").slider("option","value") > $("#initveloc-slider").slider("option","max")) {

                $("#initveloc-slider").slider("option","value",$("#initveloc-slider").slider("option","max"));
            }
            else if ($("#initveloc-slider").slider("option","value") < $("#initveloc-slider").slider("option","min")) {

                $("#initveloc-slider").slider("option","value",$("#initveloc-slider").slider("option","min"));
            }
            updateSpringDynamics();
        }
    });
    $("#eigenfrequency").val($("#eigenfrequency-slider").slider("value"));

    $("#damping-slider").slider({
        value: springDyn.d,
        min: 0.02,
        max: 1.5,
        step: 0.02,
        slide: function( event, ui ) {
            $("#damping").val(ui.value);
            springDyn.d = ui.value;
            updateSpringDynamics();
        }
    });
    $("#damping").val($("#damping-slider").slider("value"));

    $("#initpos-slider").slider({
        value: springDyn.y0,
        min: SpringConsts.springLen * -0.4,
        max: SpringConsts.springLen * 0.4,
        step: 1,
        slide: function( event, ui ) {
            $("#initpos").val(ui.value);
            springDyn.y0 = ui.value;
            updateSpringDynamics();
        }
    });
    $("#initpos").val($("#initpos-slider").slider("value"));

    $("#initveloc-slider").slider({
        value: springDyn.v0,
        min: SpringConsts.springLen * springDyn.w0 * -0.4,
        max: SpringConsts.springLen * springDyn.w0 * 0.4,
        step: 1,
        slide: function( event, ui ) {
            $("#initveloc").val(ui.value);
            springDyn.v0 = ui.value;
            updateSpringDynamics();
        }
    });
    $("#initveloc").val($("#initveloc-slider").slider("value"));

    $("#extforce-amp-slider").slider({
        value: springDyn.u0,
        min: 0,
        max: 50,
        step: 1,
        slide: function( event, ui ) {
            $("#extforce-amp").val(ui.value);
            springDyn.u0 = ui.value;
            updateSpringDynamics();
        }
    });
    $("#extforce-amp").val($("#extforce-amp-slider").slider("value"));

    $("#extforce-freq-slider").slider({
        value: springDyn.we,
        min: 0,
        max: 5,
        step: 0.01,
        slide: function( event, ui ) {
            $("#extforce-freq").val(ui.value);
            springDyn.we = ui.value;
            updateSpringDynamics();
        }
    });
    $("#extforce-freq").val($("#extforce-freq-slider").slider("value"));

    $("#freqdomain-mag-phase").buttonset();
    $("#freqdomain-mag").click(function() {
        $("#freqdomain-mag-db").button("enable");
        $("#freqDomainPhaseGraph").hide();
        $("#freqDomainMag"+(($("#freqdomain-mag-db").prop("checked") === true) ? "Db" : "")+"Graph").show();
        updateSpringDynamics();
   });
    $("#freqdomain-phase").click(function() {
        $("#freqdomain-mag-db").button("disable");
        $("#freqDomainMagGraph").hide();
        $("#freqDomainMagDbGraph").hide();
        $("#freqDomainPhaseGraph").show();
        updateSpringDynamics();
    });
    $("#freqdomain-mag-db").button().click(function() {
        if ($(this).prop("checked") === true) {
            $("#freqDomainMagGraph").hide();
            $("#freqDomainMagDbGraph").show();
        } else {
            $("#freqDomainMagDbGraph").hide();
            $("#freqDomainMagGraph").show();
        }
        updateSpringDynamics();
    });

    // $("#timedomain-trace").prop("checked") = true;
    $("#timedomain-trace").button().click(function() {
        ProgState.timeDomainTrace = $(this).prop("checked");
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
