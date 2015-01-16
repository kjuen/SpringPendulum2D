/**
 * @author Alex Scaliante Coelho / https://github.com/alexscaliante
 * @author K. Juenemann / https://github.com/kjuen
 */


/*global Spring */

$(function() {
    "use strict";

    //* Left-right split
    $("#container").split({
        orientation: 'vertical',
        limit: 350,    // minimum width of plots-panel
        position: '60%',    // size ratio of panels
        invisible: true,
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

    //* init buttons
    $("#control-buttons").buttonset();

    $("#button-start").button({
        icons: { primary: "ui-icon-stop"},
        label: "Stop"
    }).click( function(event){
        if(Spring.Prog.state === Spring.Prog.RUN) {
            // turn RUN state to STOP state
            Spring.Prog.state = Spring.Prog.STOP;
            $(this).button( "option", "label", "Start" );
            $(this).button( "option", "icons", { primary: "ui-icon-play"});
            enableElements();
            $(this).next().button("disable");
        } else if (Spring.Prog.state !== Spring.Prog.RUN) {
            // turn STOP state to RUN state
            Spring.Prog.state = Spring.Prog.RUN;
            $(this).button( "option", "label", "Stop" );
            $(this).button( "option", "icons", { primary: "ui-icon-stop"});
            disableElements();
            $(this).next().button("enable");
        }

    });

    $("#button-pause").button({
        icons: { primary: "ui-icon-pause"}
        // icons: { primary: "ui-icon-pause"}
    }).click( function(event){
        $(this).button("disable");
        disableElements();  // in pause state sliders must not be changed
        Spring.Prog.state = Spring.Prog.PAUSE;
        $(this).prev().button( "option", "label", "Start" );
        $(this).prev().button( "option", "icons", { primary: "ui-icon-play"});
    });

    //* init sliders
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

            if ($("#initveloc-slider").slider("option","value") >
                $("#initveloc-slider").slider("option","max")) {

                $("#initveloc-slider").slider("option","value",
                                              $("#initveloc-slider").slider("option","max"));
            }
            else if ($("#initveloc-slider").slider("option","value") <
                     $("#initveloc-slider").slider("option","min")) {
                $("#initveloc-slider").slider("option","value",
                                              $("#initveloc-slider").slider("option","min"));
            }
            Spring.Graphs.update();
            Spring.redraw(Spring.Prog.getSimTime());
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
            Spring.redraw(Spring.Prog.getSimTime());
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
            Spring.redraw(Spring.Prog.getSimTime());
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
            Spring.redraw(Spring.Prog.getSimTime());
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
            Spring.redraw(Spring.Prog.getSimTime());
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
            Spring.redraw(Spring.Prog.getSimTime());
        }
    });
    $("#extforce-freq").val($("#extforce-freq-slider").slider("value"));


    function enableElements() {
        $("#eigenfrequency-slider").slider("enable");
        $("#damping-slider").slider("enable");
        $("#initpos-slider").slider("enable");
        $("#initveloc-slider").slider("enable");
        $("#extforce-amp-slider").slider("enable");
        $("#extforce-freq-slider").slider("enable");
        $("#mode-select").prop('disabled', false);
    }

    function disableElements() {
        $("#eigenfrequency-slider").slider("disable");
        $("#damping-slider").slider("disable");
        $("#initpos-slider").slider("disable");
        $("#initveloc-slider").slider("disable");
        $("#extforce-amp-slider").slider("disable");
        $("#extforce-freq-slider").slider("disable");
        $("#mode-select").prop('disabled', true);
    }


    //* Freqdomain buttons

    $("#freqdomain-mag-phase").buttonset();
    $("#freqdomain-mag").click(function() {
        $("#freqdomain-mag-db").button("enable");
        $("#freqDomainPhaseGraph").hide();
        $("#freqDomainMag"+(($("#freqdomain-mag-db").prop("checked") === true) ?
                            "Db" : "")+"Graph").show();
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
        Spring.Prog.timeDomainTrace = $(this).prop("checked");
    });

    // Disable all sliders for the first time
    disableElements();
    var canvas = document.getElementById("mycanvas");
    var divcanvas = $("#canvas-container");

    canvas.width = divcanvas.width();
    canvas.height = divcanvas.height();

    //* Language
    var lang_de = {name: "Deutsch", otherLang: "English"};
    lang_de.text = {};
    var lang_en = {name: "English", otherLang: "Deutsch"};
    lang_en.text = {};
    function setText(id, txtde, txten) {
        lang_de.text[id] = txtde;
        lang_en.text[id] = txten;

    }

    setText("text-title", "Federpendel", "Spring Pendulum");
    setText("text-parameters", "Parameter", "Parameters");
    setText("text-initcondforce", "Anfangsbedingungen / Äußere Kraft",
            "Initial Conditions / External Force");
    setText("text-timedomain",
            "Zeitbereich: " + $("#mode-select").find(":selected").text(),
            "Time domain: " + $("#mode-select").find(":selected").text());
    setText("text-freqdomain", "Frequenzbereich", "Frequency Domain");
    setText("text-polezero", "Pol-Nullstellen-Diagramm", "Pole-Zero Map");
    setText("text-eigenfreq", "Eigenfrequenz", "Eigenfrequency");
    setText("text-damping", "Dämpfung", "Damping");
    setText("text-impresp", "Impulsantwort", "Impulse Response");
    setText("text-stepresp", "Sprungantwort", "Step Response");
    setText("text-sineforceinitcond", "Sinuskraft und Anfangsbedingungen",
            "Sine Force and Initial Conditions");
    setText("text-initpos", "Anfangsposition", "Initial Position");
    setText("text-initvel", "Anfangsgeschwindigkeit", "Initial Velocity");
    setText("text-forceamp", "Amplitude der äußeren Kraft", "External Force's Amplitude");
    setText("text-extforcefreq", "Frequenz der äußeren Kraft", "External Force's Frequency");
    setText("text-mag", "Amp.", "Mag.");
    setText("text-trace", "Spur", "Trace");
    setText("text-headline-left", "Federpendel: " + $("#mode-select").find(":selected").text(),
            "Spring Pendulum: " + $("#mode-select").find(":selected").text());

    // this function sets the all text elements according to the chosen language.
    function setLang() {

        // first update text fields based on selected mode
        var selId = $("#mode-select").find(":selected").attr("id");
        setText("text-timedomain",
            "Zeitbereich: " + lang_de.text[selId],
            "Time domain: " + lang_en.text[selId]);
        setText("text-headline-left",
                "Federpendel: " + lang_de.text[selId],
                "Spring Pendulum: " + lang_en.text[selId]);

        // then loop over all ids to replace the text
        for(var id in langObj.text) {
            $("#"+id).text(langObj.text[id].toLocaleString());
        }
        // finally, set label of language button
        $('#button-lang').text(langObj.otherLang);
    }

    // Initialization
    var langObj;
    if(window.location.hash.length == 3 &&
       window.location.hash.substring(1,3).toLocaleLowerCase() == "en")
        langObj = lang_en;
    else langObj = lang_de;
    setLang();

    $("#button-lang").click(function() {
        langObj = (langObj === lang_de) ? lang_en : lang_de;
        setLang();
    });
    $("#mode-select").click(function() {
        var selId = $(this).find(":selected").attr("id");
        if(selId  === "text-impresp") {
            Spring.dyn.mode = Spring.dyn.IMP_RESP;
            $("#initpos-slider").slider("disable");
            $("#initveloc-slider").slider("disable");
        } else if (selId  === "text-stepresp") {
            Spring.dyn.mode = Spring.dyn.STEP_RESP;
            $("#initpos-slider").slider("disable");
            $("#initveloc-slider").slider("disable");
        } else {
            Spring.dyn.mode = Spring.dyn.SINE_RESP;
            $("#initpos-slider").slider("enable");
            $("#initveloc-slider").slider("enable");
        }
        setLang();
        Spring.Graphs.needUpdate = true;
    });
});
