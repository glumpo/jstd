define(['./diagram'], function(Diagram) {
    "use strict";

    class DiagramSet {
        constructor() {
            this.diagrams = {};
        }

        addDiagram(diagram) {
            this.diagrams[diagram.name] = diagram;
        }

        renameDiagram(diagram, newName) {
            if (this.diagrams[diagram.name] != diagram) {
                throw new Error("Diagram '" + diagram.name +
                    "' is not from this set");
            }
            if (this.diagrams[newName]) {
                throw new Error("Diagram '" + newName +
                    "' already exists in this set");
            }
            delete this.diagrams[diagram.name];
            diagram.name = newName;
            this.diagrams[newName] = diagram;
        }
    };

    return DiagramSet;
});

