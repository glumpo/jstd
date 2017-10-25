define(['./element'], function(Element) {
    "use strict";
    class LetterMachine extends Element {
        constructor(letter) {
        	super();
            this.letter = letter || "";
        }
    };

    return LetterMachine;
});