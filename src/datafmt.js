define(['require', './datafmt/datafmt-v1'], function(require) {
    "use strict";

    var latestFmtVersion = 1;

    function parse(obj) {
        var fmtVersion = obj.version;
        var datafmt = require('./datafmt/datafmt-v' + fmtVersion);
        return datafmt.parse(obj);
    }

    function serialize(diagramSet, fmtVersion) {
        fmtVersion = fmtVersion || latestFmtVersion;
        var datafmt = require('./datafmt/datafmt-v' + fmtVersion);
        return datafmt.serialize(diagramSet);
    }

    return {
        latestFmtVersion: latestFmtVersion,
        parse: parse,
        serialize: serialize,
    }
});