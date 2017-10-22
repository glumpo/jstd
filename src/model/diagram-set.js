define(['./diagram'], function(Diagram) {
    "use strict";

    class DiagramSet {
        constructor() {
            /** Listeners with the following methods:
                • onDiagramAdded(diagramset, diagram)
                • onDiagramRenamed(diagramset, diagram, newName, oldName)
                • onDiagramRemoved(diagramset, diagram)
                • onMainDiagramChanged(diagramset, newMain, oldMain) */
            this.listeners = [];
            this.diagrams = {};
            this.main = null;
            /** UI Properties */
            this.props = {
                /* current: "name" */
            };
        }

        addListener(listener) {
            if (this.listeners.indexOf(listener) < 0) {
                this.listeners = this.listeners.concat([listener]);
            }
        }

        removeListener(listener) {
            this.listeners = this.listeners.filter(function(l) {
                return l != listener;
            });
        }

        addDiagram(diagram, name) {
            if (this.diagrams[name]) {
                throw new Error("Diagram '" + name +
                    "' already exists in this set");
            }
            this.diagrams[name] = diagram;
            diagram.name = name;

            this.listeners.forEach(function(l) {
                l.onDiagramAdded(this, diagram);
            }, this);

            if (!this.main) {
                this.setMainDiagram(diagram);
            }
        }

        renameDiagram(diagram, newName) {
            var oldName = diagram.name;
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

            this.listeners.forEach(function(l) {
                l.onDiagramRenamed(this, diagram, newName, oldName);
            }, this);
        }

        setMainDiagram(diagram) {
            if (diagram != null && this.diagrams[diagram.name] != diagram) {
                throw new Error("Diagram '" + diagram.name +
                    "' is not from this set");
            }

            var oldMain = this.main;
            this.main = diagram;

            this.listeners.forEach(function(l) {
                l.onMainDiagramChanged(this, diagram, oldMain);
            }, this);
        }

        removeDiagram(diagram) {
            if (this.diagrams[diagram.name] != diagram) {
                throw new Error("Diagram '" + diagram.name +
                    "' is not from this set");
            }

            if (diagram == this.main) {
                var newMain = null;
                for (name in this.diagrams) {
                    if (this.diagrams[name] != diagram) {
                        newMain = this.diagrams[name];
                    }
                }
                this.setMainDiagram(newMain);
            }

            delete this.diagrams[diagram.name];

            this.listeners.forEach(function(l) {
                l.onDiagramRemoved(this, diagram);
            }, this);
        }
    };

    return DiagramSet;
});

