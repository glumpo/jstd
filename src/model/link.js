define(function() {
    "use strict";

    class Link {
        constructor() {
            /** Link's parent diagram */
            this.diagram = null;
            /** Link id, unique among diagram's links */
            this.id = -1;
            /** Characters this link matches
              * Emtry string matches none, null matches any */
            this.conditions = "";
            /** Element this link comes out from */
            this.src = null;
            /** Element this link comes into */
            this.dst = null;
            /** UI Properties */
            this.props = {
                /* bezierP01: [ dx, dy ] */
                /* bezierP32: [ dx, dy ] */
            };
        }

        matches(condition) {
            return this.conditions == null ||
                this.conditions.indexOf(condition) >= 0;
        }
    };

    return Link;
})