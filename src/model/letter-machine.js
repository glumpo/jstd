define(['./call-element'], function(CallElement) {
    "use strict";

    class LetterMachine extends CallElement{
        constructor(machine, times) {
            super(machine, times);
//            // If someone is going to cheat with alphabet, it will be easy to detect
//            if (!LetterMachine.alphabet)
//            	LetterMachine.alphabet = new Set();
//            LetterMachine.alphabet.add(machine);dd
        }
    };

    return LetterMachine;
});