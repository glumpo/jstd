define(['./enter-element'], function(EnterElement) {
    "use strict";

    class Diagram {
        constructor(name) {
            /** Unique machine name */
            this.name = name || "";
            this.elements = [];
            this.links = [];
            /** Listeners with the following methods:
                • onElementAdded(diagram, element)
                • onLinkAdded(diagram, link)
                • onElementRemoved(diagram, element)
                • onLinkRemoved(diagram, link) */
            this.listeners = [];
            /** UI Properties */
            this.props = {
                /* view: [ x0, y0, w, h ] */
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

        addElement(el) {
            el.diagram = this;
            // generage id as max(id) + 1
            el.id = 1 + this.elements.reduce(function(max, el) {
                return el.id > max ? el.id : max;
            }, 0);
            this.elements.push(el);

            // notify listeners
            this.listeners.forEach(function(l) {
                l.onElementAdded(this, el);
            }, this);
        }

        addLink(link, src, dst) {
            if (src.diagram != this) {
                throw new Error("Source element is not from this diagram");
            }
            if (dst.diagram != this) {
                throw new Error("Destination element is not from this diagram");
            }
            link.diagram = this;
            // generage id as max(id) + 1
            link.id = 1 + this.links.reduce(function(max, link) {
                return link.id > max ? link.id : max;
            }, 0);
            link.src = src;
            link.dst = dst;
            src.outs.push(link);
            dst.ins.push(link);
            this.links.push(link);

            // notify listeners
            this.listeners.forEach(function(l) {
                l.onLinkAdded(this, link);
            }, this);
        }

        removeElement(el) {
            if (el.diagram != this) {
                throw new Error("No such element in diagram");
            }

            [].concat(el.ins).concat(el.outs).forEach(function(link) {
                this.removeLink(link);
            }, this);

            this.elements.splice(this.elements.indexOf(el), 1);

            // notify listeners
            this.listeners.forEach(function(l) {
                l.onElementRemoved(this, el);
            }, this);
        }

        removeLink(link) {
            if (link.diagram != this) {
                throw new Error("No such link in diagram");
            }

            link.src.outs.splice(link.src.outs.indexOf(link), 1);
            link.dst.ins.splice(link.dst.ins.indexOf(link), 1);
            this.links.splice(this.links.indexOf(link), 1);

            // notify listeners
            this.listeners.forEach(function(l) {
                l.onLinkRemoved(this, link);
            }, this);
        }
        
        /**
         *  Returns ARRAY of all EnterElements 
         *  or empty array if no enterElements is found.
         */
        getEnterElements() {
            var elArray = this.elements.filter(
                    function(e) { return e instanceof EnterElement }
                    );
            return elArray;
        }
    };

    return Diagram;
});

