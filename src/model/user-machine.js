define(['./call-element'], function(CallElement) {
    "use strict";

    class UserMachine extends CallElement{
        constructor(machine, times) {
            super(machine, times);
        }
    };

    return UserMachine;
});