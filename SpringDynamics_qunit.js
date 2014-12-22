/**
 * @author K. Juenemann / https://github.com/kjuen
*/


// qunit tests for SpringDynamics object

function compareNumbers(a,b,tol) {
    var ok = (Math.abs(a-b)<tol);
    if(!ok) {
        console.log(a);
        console.log(b);
    }
    return ok;
}
var TOL = 0.0000001;


test( "getInitCondFunc(d=1)", function() {
    var w0 = 2;
    var d = 1;
    var x0 = 0.5;
    var v0 = -1;
    var sd = new Spring.Dynamics(w0, d, x0, v0);
    sd.d = 1;   // check update functionality in Spring.Dynamics
    var func = sd.positionFunc;
    equal(func(0), x0, 't=0');
    ok(compareNumbers(func(1), 0.067667641618306, TOL, 't=1'));
    ok(compareNumbers(func(2), 0.009157819444367, TOL, 't=2'));
});


test( "getInitCondFunc(d>1)", function() {
    var w0 = 2;
    var d = 2;
    var x0 = 0.5;
    var v0 = -1;
    var sd = new Spring.Dynamics(w0, d, x0, v0);
    sd.d = 2;  // check update functionality in Spring.Dynamics
    var func = sd.positionFunc;
    equal(func(0), x0, 't=0');
    ok(compareNumbers(func(1), 0.230804589304752, TOL, 't=1'));
    ok(compareNumbers(func(2), 0.135018364127106, TOL, 't=2'));
});

test( "getInitCondFunc(d<1)", function() {
    var w0 = 2;
    var d = 0.2;
    var x0 = 0.5;
    var v0 = -1;
    var sd = new Spring.Dynamics(w0, d, x0, v0);
    var func = sd.positionFunc;
    equal(func(0), x0, 't=0');
    ok(compareNumbers(func(1), -0.380283457385479, TOL, 't=1'));
    ok(compareNumbers(func(2), -0.031403714840043, TOL, 't=2'));
});


test( "impResp(d>1)", function() {
    var w0 = 2;
    var d = 1.8;
    var sd = new Spring.Dynamics(w0, d);
    sd.d = 1.8;    // check update functionality in Spring.Dynamics
    var func = sd.impResp;
    equal(func(0), 0, 't=0');
    ok(compareNumbers(func(1.2), 0.322385975270813, TOL, 't=1.2'));
    ok(compareNumbers(func(2.2), 0.175885363842198, TOL, 't=2.2'));
});


test( "impResp(d=1)", function() {
    var w0 = 2;
    var d = 1;
    var sd = new Spring.Dynamics(w0, d);
    var func = sd.impResp;
    equal(func(0), 0, 't=0');
    ok(compareNumbers(func(1.1), 0.487533896794269, TOL, 't=1.1'));
    ok(compareNumbers(func(2.1), 0.125962845292012, TOL, 't=2.1'));
});


test( "impResp(d<1)", function() {
    var w0 = 2;
    var d = 0.2;
    var sd = new Spring.Dynamics(w0, d);
    var func = sd.impResp;
    equal(func(0), 0, 't=0');
    ok(compareNumbers(func(1.1), 1.096204199192467, TOL, 't=1.1'));
    ok(compareNumbers(func(2.1), -0.728674183145747, TOL, 't=2.1'));
});


test( "stepResp(d>1)", function() {
    var w0 = 2;
    var d = 1.8;
    var sd = new Spring.Dynamics(w0, d);
    var func = sd.stepResp;
    equal(func(0), 0, 't=0');
    ok(compareNumbers(func(1.1), 0.435007551666120, TOL, 't=1.1'));
    ok(compareNumbers(func(2.2), 0.710082116699747, TOL, 't=2.2'));
    ok(compareNumbers(func(100), 1, TOL, 'infty'));
});


test( "stepResp(d=1)", function() {
    var w0 = 2;
    var d = 1;
    var sd = new Spring.Dynamics(w0, d);
    sd.d = 1;  // check update functionality in Spring.Dynamics
    var func = sd.stepResp;
    equal(func(0), 0, 't=0');
    ok(compareNumbers(func(1.1), 0.645429893240531, TOL, 't=1.1'));
    ok(compareNumbers(func(2.1), 0.922023000533515, TOL, 't=2.1'));
    ok(compareNumbers(func(100), 1, TOL, 'infty'));
});


test( "stepResp(d<1)", function() {
    var w0 = 2;
    var d = 0.2;
    var sd = new Spring.Dynamics(w0, d);
    var func = sd.stepResp;
    equal(func(0), 0, 't=0');
    ok(compareNumbers(func(1.1), 1.245884343147375, TOL, 't=1.1'));
    ok(compareNumbers(func(2.1), 1.315647401829405, TOL, 't=2.1'));
    ok(compareNumbers(func(100), 1, TOL, 'infty'));
});


test("getExtForceFunc(d<1)", function() {
    var w0 = 2;
    var d = 0.2;
    var u0 = 1.4;
    var we = 1.6;
    var sd = new Spring.Dynamics(w0, d, 0, 0, u0, we);
    var func = sd.positionFunc;
    ok(compareNumbers(func(0), 0, TOL, 't=0'));
    ok(compareNumbers(func(1.1), 1.069453652474765, TOL, 't=1.1'));
    ok(compareNumbers(func(2.1), 1.438119182278491, TOL, 't=2.1'));
});


test("getExtForceFunc(d=1)", function() {
    var w0 = 2;
    var d = 1;
    var u0 = 1.4;
    var we = 1.6;
    var sd = new Spring.Dynamics(w0, d, 0, 0, u0, we);
    var func = sd.positionFunc;
    ok(compareNumbers(func(0), 0, TOL, 't=0'));
    ok(compareNumbers(func(1.1), 0.599437871990220, TOL, 't=1.1'));
    ok(compareNumbers(func(2.1), 0.827950693852250, TOL, 't=2.1'));
});



test("getExtForceFunc(d>1)", function() {
    var w0 = 2;
    var d = 1.8;
    var u0 = 1.4;
    var we = 1.6;
    var sd = new Spring.Dynamics(w0, d, 0, 0, u0, we);
    var func = sd.positionFunc;
    ok(compareNumbers(func(0), 0, TOL, 't=0'));
    ok(compareNumbers(func(1.1), 0.411012118655958, TOL, 't=1.1'));
    ok(compareNumbers(func(2.1), 0.597269188231116, TOL, 't=2.1'));
});


test("getFreqRespFunc", function() {
    var w0 = 2;
    var d = 1.8;
    var sd = new Spring.Dynamics(w0, d);
    sd.d = 1.8;   // check update functionality in Spring.Dynamics
    var magResp = sd.magResp;
    var magRespDb = sd.magRespDb;
    var phaseResp = sd.phaseResp;
    ok(compareNumbers(magResp(0), 1, TOL, 'magResp(0)'));
    ok(compareNumbers(magRespDb(0), 0, TOL, 'magRespDb(0)'));
    ok(compareNumbers(phaseResp(0), 0, TOL, 'phaseResp(0)'));
    ok(compareNumbers(magResp(3), 0.180414618181500, TOL, 'magResp(0)'));
    ok(compareNumbers(magRespDb(3), -14.874565528968585, TOL, 'magRespDb(0)'));
    ok(compareNumbers(phaseResp(3), -103.0333563259139, TOL, 'phaseResp(0)'));
    ok(compareNumbers(phaseResp(w0), -90, TOL, 'phaseResp(0)'));
    ok(compareNumbers(phaseResp(100000), -180, 0.01, 'phaseResp(0)'));
});
