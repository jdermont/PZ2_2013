var jsdom = require('jsdom'),
    vm = require('vm');

var js = "console.log(jsdom.createWindow()); ";
var script = vm.createScript(js, 'document.js');
var sandbox = {console: console, require: require, jsdom: jsdom};
sandbox.global = sandbox;
script.runInNewContext(sandbox);

/*
    Embed main script in a function.
    Move window creation code to a separate module.
    Import window creation function.
    Store console and require on global

function() { JS BODY}()
*/

