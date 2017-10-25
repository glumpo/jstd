/**
 * Модуль, объединяющий все классы модели для упрощения импорта
 */
define(function(require) {
    "use strict";

    return {
        DiagramSet      : require('./model/diagram-set'),
        Diagram         : require('./model/diagram'),
        Link            : require('./model/link'),
        Element         : require('./model/element'),
        EnterElement    : require('./model/enter-element'),
        ExitElement     : require('./model/exit-element'),
        StandardMachine : require('./model/standard-machine'),
        UserMachine     : require('./model/user-machine'),
        LetterMachine   : require('./model/letter-machine'),
    }
});

