/**
 * @author K. Juenemann / https://github.com/kjuen
 */

/*global Spring */

/**
 * This object represents the dynamics of an ideal spring.
 * The methods of this object create functions (closures) of t implementing the different
 * dynamic behaviors of the pendulum.
 *
 * @constructor
 * @this {Spring.Dynamics}
 * @param {number} w0 eigenfrequency of the spring, must be > 0.
 * @param {number} d dimensionless friction constant, must be >= 0.
 * @param {number} y0 initial position y(0) (default: 0)
 * @param {number} v0 initial speed y'(0) (default: 0)
 * @param {number} u0 amplitude of suspension point (default: 0)
 * @param {number} we external frequency (default: 0)
 * @param {number} mode integer determining the kind of position function
 *                      0 (default): Response to sine force and initial conditions
 *                      1: impulse response
 *                      2: step response
 */
Spring.Dynamics = function (_w0, _d, _y0, _v0, _u0, _we, _mode) {
    "use strict";

    // mode values
    var _SINE_RESP = 0;
    var _IMP_RESP = 1;
    var _STEP_RESP = 2;
    var _TOL = 0.00001;

    // set default values
    _y0 = (_y0 === undefined ? 0 : _y0);
    _v0 = (_v0 === undefined ? 0 : _v0);
    _u0 = (_u0 === undefined ? 0 : _u0);
    _we = (_we === undefined ? 0 : _we);
    _mode = (_mode === undefined ? _SINE_RESP : _mode);



    //* Function properties
    var that = this;
    that.extForce = getExtForce();
    that.positionFunc = getPositionFunc();
    that.magResp = getMagResp();
    that.magRespDb = getMagRespDb();
    that.phaseResp = getPhaseResp();
    that.poles = getPoles();

    //* Parameters

    Object.defineProperty(this, 'TOL', {
        get: function() {return _TOL;}
    });


    Object.defineProperty(this, 'mode', {
        set: function(newMode) {
            _mode = newMode;
            that.extForce = getExtForce();
            that.positionFunc = getPositionFunc();
        }
    });


    Object.defineProperty(this, 'w0', {
        get: function() {return _w0;},
        set: function(neww0) {
            _w0=neww0;
            that.extForce = getExtForce();
            that.positionFunc = getPositionFunc();
            that.magResp = getMagResp();
            that.magRespDb = getMagRespDb();
            that.phaseResp = getPhaseResp();
            that.poles = getPoles();

        }
    });
    Object.defineProperty(this, 'd', {
        get: function() {return _d;},
        set: function(newd) {
            _d=newd;
            that.extForce = getExtForce();
            that.positionFunc = getPositionFunc();
            that.magResp = getMagResp();
            that.magRespDb = getMagRespDb();
            that.phaseResp = getPhaseResp();
            that.poles = getPoles();
        }
    });
    Object.defineProperty(this, 'y0', {
        get: function() {return _y0;},
        set: function(newy0) {
            _y0=newy0;
            that.positionFunc = getPositionFunc();
        }
    });
    Object.defineProperty(this, 'v0', {
        get: function() {return _v0;},
        set: function(newv0) {
            _v0=newv0;
            that.positionFunc = getPositionFunc();
        }
    });
    Object.defineProperty(this, 'u0', {
        get: function() {return _u0;},
        set: function(newu0) {
            _u0=newu0;
            that.extForce = getExtForce();
            that.positionFunc = getPositionFunc();
        }
    });
    Object.defineProperty(this, 'we', {
        get: function() {return _we;},
        set: function(newwe) {
            _we=newwe;
            that.extForce = getExtForce();
            that.positionFunc = getPositionFunc();
        }
    });



    //* The actual calculations

     function stepFunc(t) {
         if(t<0) return 0;
         else return _u0;
     }

    // approxiamte delta function as narrow rectangle
    var deltaHeight = 20;
    function deltaFunc(t) {
        if((t>=0) && (t<=1/deltaHeight)) return _u0*deltaHeight;
        else return 0;
    }

    function sineFunc(t) {
        if(t<0) return 0;
        else return _u0* Math.sin(_we*t);
    }


    /**
     * creates function calculating the external force as function of t,
     * depending on the value of the mode property. The corresponding system response
     * is stored in the positionFunc field.
     * @returns {function} function of a single parameter t giving the external at time t
     */
    function getExtForce() {
        switch(_mode) {
        case _IMP_RESP:
            return deltaFunc;
        case _STEP_RESP:
            return stepFunc;
        default:
            return sineFunc;
        }
    }

    /**
     * creates function y(t) calculating the pendulum position as function of t,
     * depending on the value of the mode property. This function is the system response
     * to the external force stored in the extForce field.
     * @returns {function} function y(t) of a single parameter t giving the pendulum position at time t
     */
    function getPositionFunc() {
        switch(_mode) {
        case _IMP_RESP:
            return getImpResp();
        case _STEP_RESP:
            return getStepResp();
        default:
            var f1 = getInitCondResp();
            var f2 = getSineResp();
            return function(t) {
                if(t<0)
                    return _y0;
                else
                    return f1(t) + f2(t);
            };

        }
    }



    /**
     * creates function y(t) calculating the pendulum position as function of t for given
     * initial conditions y(0) = y0 and y'(0) = v0 without external force.
     * @returns {function} function y(t) of a single parameter t giving the pendulum position at time t
     */
    function getInitCondResp() {
        var ret;
        var tmp, tmp2, tmp3, tmp4, tmp5;

        if(_d < 1 - _TOL) {
            // weak friction
            tmp = Math.sqrt(1-_d*_d);
            tmp2 = _w0 * _d;
            tmp3 = _w0 * tmp;
            tmp4 = (_v0 + _d*_w0*_y0)/(_w0*tmp);
            ret = function(t) {
                return _y0*Math.exp(-tmp2*t)*Math.cos(tmp3*t) +
                    tmp4*Math.exp(-tmp2*t)*Math.sin(tmp3*t);
            };
        } else if(_d > 1 + _TOL) {
            // strong friction
            tmp = Math.sqrt(_d*_d-1);
            tmp2 = _w0 * (_d- tmp);
            tmp3 = _w0 * (_d+ tmp);
            tmp4 = (_v0 +_d*_w0*_y0+_w0*_y0*tmp) / (2*_w0*tmp);
            tmp5 = (_v0 +_d*_w0*_y0-_w0*_y0*tmp) / (2*_w0*tmp);
            ret = function(t) {
                return tmp4 *Math.exp(-t*tmp2) - tmp5 * Math.exp(-t*tmp3);
            };
        } else {
            // limit case
            tmp = _v0 + _y0*_w0;
            ret = function(t) {
                return (_y0 + t * tmp)* Math.exp(-_w0 * t);
            };
        }
        return ret;
    }


    /**
     * creates function h(t) calculating the impulse response of the pendulum, scaled by u0.
     * I.e. h(t) is the system response to u0 * delta(t).
     * @returns {function} function h(t) of a single parameter t giving the pendulum position at time t
     */
    function getImpResp() {
        var ret;
        var tmp, tmp2, tmp3, tmp4;


        if(_d < 1 - _TOL) {
            // _weak friction
            tmp = _w0 * Math.sqrt(1-_d*_d);
            tmp2 = _w0 * _d;
            tmp3 = _w0 / Math.sqrt(1-_d*_d);
            ret = function(t) {
                if(t<0) return 0;
                else return _u0 * tmp3 * Math.exp(-tmp2*t)*Math.sin(tmp*t);
            };
        } else if(_d > 1 + _TOL) {
            // strong friction
            tmp = Math.sqrt(_d*_d-1);
            tmp2 = _w0/(2 * tmp);
            tmp3 = _w0*(tmp-_d);
            tmp4 = _w0*(-tmp-_d);
            ret = function(t) {
                if(t<0) return 0;
                else return _u0 * tmp2*(Math.exp(tmp3*t) - Math.exp(tmp4*t));
            };
        } else {
            // limit case
            ret = function(t) {
                if(t<0) return 0;
                else return _u0* t*_w0*_w0*Math.exp(-_w0*t);
            };
        }
        return ret;
    }

    /**
     * creates function g(t) calculating the step response of the pendulum, scaled by u0.
     * I.e. g(t) is the system response to u0 * sigma(t).
     * @returns {function} function g(t) of a single parameter t giving the pendulum position at time t
     */
    function getStepResp(){
        var ret;
        var tmp, tmp2, tmp3, tmp4;

        if(_d < 1 - _TOL) {
            // _weak friction
            tmp = Math.sqrt(1-_d*_d);
            tmp2 = _w0 * tmp;
            tmp3 = _d/tmp;
            ret = function(t) {
                if(t<0) return 0;
                else return _u0*(1 - Math.exp(-_d*_w0*t)*(Math.cos(tmp2*t) + tmp3*Math.sin(tmp2*t)));
            };
        } else if(_d > 1 + _TOL) {
            // strong friction
            tmp = Math.sqrt(_d*_d-1);
            tmp2 = 1+_d / tmp;
            tmp3 = 1-_d / tmp;
            tmp4 = _w0*tmp;
            ret = function(t) {
                if(t<0) return 0;
                else return _u0*(1- 0.5*Math.exp(-_d*_w0*t)*(tmp2* Math.exp(tmp4*t) +
                                                             tmp3* Math.exp(-tmp4*t) ));
            };
        } else {
            // limit case
            ret = function(t) {
                if(t<0) return 0;
                else return _u0*(1-(t*_w0+1)*Math.exp(-_w0*t));
            };
        }
        return ret;
    }


    /**
     * creates function y(t) calculating the pendulum position as function of t for vanishing
     * initial conditions but with external force exerted by motion u(t) = u0*sin(_we*t) of the
     * upper suspension point of the pendulum.
     * @returns {function} function y(t) of a single parameter t giving the pendulum position at time t
     */
    function getSineResp(){
        var ret;
        var tmp, tmp2, tmp3, tmp4;

        if(_d < 1 - _TOL) {
            tmp = Math.sqrt(1-_d*_d);  // tmp=D
            tmp2 = _w0*_d;
            // tmp3=A
            tmp3 = _u0 * _w0*_w0 / ((4*_d*_d-2)*_w0*_w0*_we*_we + _w0*_w0*_w0*_w0 +_we*_we*_we*_we);
            tmp4 = ((2*_d*_d-1)*_w0*_w0+_we*_we)/(2*tmp2*_w0*tmp);

            ret = function(t) {
                return 2*tmp2*_we*tmp3*Math.exp(-tmp2*t) *
                    (Math.cos(_w0*tmp*t) + tmp4*Math.sin(_w0*tmp*t)) -
                    tmp3 * (_we*_we-_w0*_w0)*Math.sin(_we*t) -
                    2 * tmp3 *tmp2*_we*Math.cos(_we*t);
            };
        } else if(_d > 1 + _TOL) {

            tmp = Math.sqrt(_d*_d-1);   // = D
            tmp2 = _u0*_w0*_w0/(4 * _d*_d*_w0*_w0*_we*_we+_w0*_w0*_w0*_w0-2*_w0*_w0*_we*_we+_we*_we*_we*_we);  // A
            tmp3 = ((2*_d*_d-1)*_w0*_w0+_we*_we)/(2*_d*_w0*_w0*tmp);

            ret = function(t) {
                return _d*tmp2*_w0*_we*Math.exp(-t*_d*_w0)*(Math.exp(t*_w0*tmp)*(1+tmp3)+
                                                            Math.exp(-t*_w0*tmp)*(1-tmp3))+
                    tmp2*((_w0*_w0-_we*_we)*Math.sin(_we*t)-2*_d*_w0*_we*Math.cos(_we*t));
            };
        } else {
            // limit case
            tmp = _w0*_w0 + _we*_we;
            tmp2 = _u0*_w0*_w0/tmp;   // = B
            tmp3 = tmp2 / tmp;  // = A

            ret = function(t) {
                return (2*tmp3*_w0+t*tmp2)*_we*Math.exp(-t*_w0)+
                    tmp3 * (_w0*_w0 - _we*_we) * Math.sin(t*_we)-
                    2 * tmp3 * _w0*_we* Math.cos(t*_we);
            };
        }

        return ret;
    }



    /**
     * creates function func(w) calculating the magnitude response |H| of the system as a
     * function of the  frequency w.
     * @returns {function} function func w of a single parameter w giving the magnitude response
     */
    function getMagResp() {

        var ret;
        var _w02 = _w0*_w0;
        var d2 = _d*_d;

        ret = function(w) {
            var w2 = w*w;
            var absH = _w02 / Math.sqrt((4*d2-2)*_w02*w2 + w2*w2 + _w02*_w02);
            return absH;
        };
        return ret;
    }


    /**
     * creates function func(w) calculating the logarithmic magnitude response of the system
     * as a function of the frequency w, i.e. the quanity -20*log10(|H|).
     * @returns {function} function func w of a single parameter w giving the magnitude response
     */
    function getMagRespDb() {

        var ret;
        var _w02 = _w0*_w0;
        var d2 = _d*_d;

        ret = function(w) {
            var w2 = w*w;
            var absH = _w02 / Math.sqrt((4*d2-2)*_w02*w2 + w2*w2 + _w02*_w02);
            return 20*Math.LOG10E*Math.log(absH);
        };
        return ret;
    }



    /**
     * creates function func(w) calculating the phase response in degrees of the system as a
     * function of the frequency w.
     * @returns {function} function func w of a single parameter w giving the phase response
     */
    function getPhaseResp() {
        var ret;
        var _w02 = _w0*_w0;
        var d2 = _d*_d;

        ret = function(w) {
            var w2 = w*w;
            var den = (_w02-w2)*(_w02-w2) + 4*d2*w2*_w02;
            var real =  _w02*(_w02-w2)/den;
            var imag = -2*_d*w*_w02*_w0 / den;
            return Math.atan2(imag, real) * 180 / Math.PI;
        };
        return ret;
    }



    /**
     * calculates the poles of the transfer function in the complex plane.
     *
     * @returns {Array} A two-element array, each element of which is again a
     *          two-element array containing real and imaginary parts of the poles
     */
    function getPoles() {

        var poles = new Array(2);
        poles[0] = [0,0];
        poles[1] = [0,0];

        if(_d < 1 - _TOL) {
            // _weak friction: poles with imaginary parts
            poles[0][0] = -_w0*_d;
            poles[0][1] =  _w0*Math.sqrt(1-_d*_d);
            poles[1][0] = -_w0*_d;
            poles[1][1] = -_w0*Math.sqrt(1-_d*_d);

        } else if(_d > 1 + _TOL) {
            // strong friction: no imaginary parts
            poles[0][0] = -_w0*(_d - Math.sqrt(_d*_d-1));
            poles[1][0] = -_w0*(_d + Math.sqrt(_d*_d-1));
        } else {
            // limit case:  real double pole at -_w0
            poles[0][0] = -_w0;
            poles[1][0] = -_w0;
        }
        return poles;
    }

};


// create SpringDynamics object with useful default parameters
Spring.dyn = new Spring.Dynamics(
    1.9, // w0
    0.1, // d
    0,   // y0
    0,   // v0
    25,  // u0
    3   // we
);
