define(['./call-element'], function(CallElement) {
    "use strict";

    class StandardMachine extends CallElement{
        constructor(machine, times) {
            super(machine, times);
        }
    };

    return StandardMachine;
});