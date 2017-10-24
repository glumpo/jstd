define(['./element'], function(Element) {
    "use strict";
    class LetterMachine extends Element {
        constructor(letter) {
            super();
            var _letter = letter || "";
            
//        If someone is going to cheat with alphabet, it will be easy to detect
          if (!LetterMachine.alphabet)
          	LetterMachine.alphabet = new Set();
          if (_letter != "")
        	  LetterMachine.alphabet.add(_letter);
            
            this.setLetter = function(letter) {
            	if (!letter)
            		throw new Error("Where is my fucking letter?");
            	
            	LetterMachine.alphabet.delete(_letter);
            	LetterMachine.alphabet.add(letter);
            	
            	_letter = letter;
            }
            this.getLetter = function() { return _letter }
        }
    };

    return LetterMachine;
});