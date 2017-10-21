define([], function() {
    "use strict";

    class Diagram {
        constructor() {
            /** Unique machine name */
            this.name = "";
            this.elements = [];
            this.links = [];
            /** UI Properties */
            this.props = {
                /* view: [ x0, y0, w, h ] */
            };
        }

        addElement(el) {
            el.diagram = this;
            el.id = 1 + this.elements.reduce(function(max, el) {
                return el.id > max ? el.id : max;
            }, 0);
            this.elements.push(el);
        }

        addLink(link, src, dst) {
            if (src.diagram != this) {
                throw new Error("Source element is not from this diagram");
            }
            if (dst.diagram != this) {
                throw new Error("Destination element is not from this diagram");
            }
            link.diagram = this;
            link.id = 1 + this.links.reduce(function(max, link) {
                return link.id > max ? link.id : max;
            }, 0);
            link.src = src;
            link.dst = dst;
            src.outs.push(link);
            dst.outs.push(link);
            this.links.push(link);
        }

        deleteElement(el) {
            if (el.diagram != this) {
                throw new Error("No such element in diagram");
            }

            [].concat(el.ins).concat(el.outs).forEach(function(link) {
                this.deleteLink(link);
            }, this);

            this.elements.splice(this.elements.indexOf(el), 1);
        }

        deleteLink(link) {
            if (link.diagram != this) {
                throw new Error("No such link in diagram");
            }

            link.src.outs.splice(link.src.outs.indexOf(link), 1);
            link.dst.ins.splice(link.dst.ins.indexOf(link), 1);
            this.links.splice(this.links.indexOf(link), 1);
        }
    };

    return Diagram;
});

