define(['./element'], function(Element) {
    "use strict";

    /** DEPRECATED< NEVER USE IT!!! */
    class CallElement extends Element {
        constructor(machine, times) {
            super();
            throw new Error("CallElement is depricated. Never use it.");
        }
    };

    return CallElement;
});