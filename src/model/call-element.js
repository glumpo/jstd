define(['./element'], function(Element) {
    "use strict";

    class CallElement extends Element {
        constructor() {
            super();
            /** Machine name. Like "l", "R","'0'" or user diagram name */
            this.machine = "";
            /** How many times to execute the machine (>=1) */
            this.times = 1;
        }
    };

    return CallElement;
});