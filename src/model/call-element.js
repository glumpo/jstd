define(['./element'], function(Element) {
    "use strict";

    class CallElement extends Element {
        constructor(machine, times) {
            super();
            /** Machine name. Like "l", "R","'0'" or user diagram name */
            this.machine = machine || "";
            /** How many times to execute the machine (>=1) */
            this.times = times == null ? 1 : times;
            if (this.times < 1) {
                throw new Error("Invalid 'times' attribute < 1: " +
                    this.times);
            }
        }
    };

    return CallElement;
});