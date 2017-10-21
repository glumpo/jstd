define(function () {
    "use strict";

    class Element {
        constructor() {
            /** Elements's parent diagram */
            this.diagram = null;
            /** Element id, unique among diagram's elements */
            this.id = -1;
            /** Links ending with this element */
            this.ins = [];
            /** Links starting from this element */
            this.outs = [];
            /** UI Properties */
            this.props = {
                /* location: [x,y] */
            };
        }
    };

    return Element;
});