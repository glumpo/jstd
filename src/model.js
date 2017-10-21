/**
 * Модуль, объединяющий все классы модели для упрощения импорта
 */
define(function(require) {
    "use strict";

    return {
        DiagramSet   : require('./model/diagram-set'),
        Diagram      : require('./model/diagram'),
        Link         : require('./model/link'),
        Element      : require('./model/element'),
        EnterElement : require('./model/enter-element'),
        ExitElement  : require('./model/exit-element'),
        CallElement  : require('./model/call-element'),
    }
});

