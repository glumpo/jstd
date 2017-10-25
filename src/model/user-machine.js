define(['./element'], function(Element) {
    "use strict";

    class UserMachine extends Element{
        constructor(machine, times) {
            super();
            /** User machine name*/
            this.machine = machine || "";
            /** How many times to execute the machine (>=1) */
            this.times = times == null ? 1 : times;
            if (this.times < 1) {
                throw new Error("Invalid 'times' attribute < 1: " +
                    this.times);
            }
        }
    };

    return UserMachine;
});