define([
    /* ADD NEWER VERSIONS HERE */
    './datafmt/datafmt-v1'
], function(
    /* ADD NEWER VERSIONS HERE */
    datafmt_v1
) {
    "use strict";

    var latestFmtVersion = -1;
    var formats = [
        /* ADD NEWER VERSIONS HERE */
        datafmt_v1
    ].reduce(function(res, fmt) {
        if (res.fmtVersion > latestFmtVersion) {
            latestFmtVersion = res.fmtVersion;
        }
        res[fmt.fmtVersion] = fmt;
        return res;
    }, {});

    function parse(obj) {
        var fmtVersion = obj.version;
        var datafmt = formats[fmtVersion];
        if (!datafmt) {
            throw new Error("Unsupported format version: '" +
                fmtVersion + "'");
        }
        return datafmt.parse(obj);
    }

    function serialize(diagramSet, fmtVersion) {
        fmtVersion = fmtVersion == null ? latestFmtVersion : obj.version;
        var datafmt = formats[fmtVersion];
        if (!datafmt) {
            throw new Error("Unsupported format version: '" +
                fmtVersion + "'");
        }
        return datafmt.serialize(diagramSet);
    }

    return {
        latestFmtVersion: latestFmtVersion,
        parse: parse,
        serialize: serialize,
    }
});