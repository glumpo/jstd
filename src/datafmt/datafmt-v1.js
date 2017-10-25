define(['../model'], function(model) {
    "use strict";

    var fmtVersion = 1;

    class Parser {
        parse(obj) {
            if (obj.version != fmtVersion) {
                throw new Error("Version '" + obj.version + 
                    "' does not match parser version: '" + fmtVersion + "'");
            }

            this.diagramSet = new model.DiagramSet();
            obj.diagrams.forEach(function(dObj) {
                var d = this.parseDiagram(dObj);
                this.diagramSet.addDiagram(d, d.name);
            }, this);
            this.diagramSet.setMainDiagram(
                this.diagramSet.diagrams[obj.main]);
            return this.diagramSet;
        }
    
        parseDiagram(dObj) {
            this.diagram = new model.Diagram();
            this.diagram.name = dObj.name;
            this.diagram.props = dObj.props;

            this.elementMap = [];
            dObj.elements.forEach(function(elObj) {
                var el = this.parseElement(elObj);
                this.diagram.elements.push(el);
                if (this.elementMap[el.id]) {
                    throw new Error("Duplicate element id: '" + el.id + "'");
                }
                this.elementMap[el.id] = el;
            }, this);

            this.linkMap = [];
            dObj.links.forEach(function(linkObj) {
                var link = this.parseLink(linkObj);
                this.diagram.links.push(link);
                if (this.linkMap[link.id]) {
                    throw new Error("Duplicate link id: '" + link.id + "'");
                }
                this.linkMap[link.id] = link;
            }, this);

            return this.diagram;
        }
    
        parseElement(elObj) {
            var el;
            switch (elObj.type) {
                case "enter":
                    el = new model.EnterElement();
                    break;
                case "exit":
                    el = new model.ExitElement();
                    break;
                case "user":
                	el = new model.UserMachine();
                    el.machine = elObj.machine;
                    el.times = elObj.times == null ? 1 : elObj.times;
                    break;
                case "letter":
                	el = new model.LetterMachine(elObj.letter);
                    break;
                case "standard":
                    el = new model.StandardMachine();
                    el.machine = elObj.machine;
                    el.times = elObj.times == null ? 1 : elObj.times;
                    break;
                default:
                    throw new Error("Error parsing diagram '" + 
                        this.diagram.name + "': unknown element type '" + 
                        elObj.type + "'");
            }
            el.diagram = this.diagram;
            el.id = elObj.id;
            el.props = elObj.props;
            return el;
        }

        parseLink(linkObj) {
            var link = new model.Link();

            link.src = this.elementMap[linkObj.src_el_id];
            if (!link.src) {
                throw new Error("Error parsing diagram '" +
                    this.diagram.name + "': source element '" +
                    linkObj.src_el_id + "' for link '" + linkObj.id +
                    "' not found");
            }
            link.src.outs.push(link);

            link.dst = this.elementMap[linkObj.dst_el_id];
            if (!link.dst) {
                throw new Error("Error parsing diagram '" +
                    this.diagram.name + "': destination element " +
                    linkObj.dst_el_id + "' for link '" + linkObj.id +
                    "' not found");
            }
            link.dst.ins.push(link);

            link.diagram = this.diagram;
            link.id = linkObj.id;
            link.conditions = linkObj.conditions;
            return link;
        }

    }

    function parse(obj) {
        return new Parser().parse(obj);
    }

    function serialize() {
        // TODO
    }

    return {
        fmtVersion: fmtVersion,
        parse: parse,
        serialize: serialize,
    }
});