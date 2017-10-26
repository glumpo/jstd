define([], function() {

    class Tape {
        constructor(string) {
            if (string != undefined) {
                this.string = string.toString();
            } else {
                this.string = "";
            }
            this.activeCellIndex = 0;
            /** Listeners with the following methods:
                • onActiveCellIndexChanged(t, newi, oldi)
                • onActiveCellValueChanged(t, idx, newv, oldv)*/
            this.listeners = [];
        }

        asString() {
            return (
                this.string 
                + Array(
                    (this.activeCellIndex - this.string.length >= 0) 
                    ? (this.activeCellIndex - this.string.length + 2)
                    : (1)
                ).join(" ")
            );
        }

        setActiveCellIndex(newACI) { //ACI -- active cell index
            if (newACI >= 0) {
                var oldACI = this.activeCellIndex;
                this.activeCellIndex = newACI;
                this.listeners.forEach(function(l) {
                    l.onActiveCellIndexChanged(this, this.activeCellIndex, oldACI);
                }, this);
            } else {
                throw new Error(
                    "setActiveCellIndex(): Unacceptable input data {new active cell index == " 
                    + newACI.toString() 
                    + "}"
                );
                //throw new Exception("Active cell index can't be < 0");
            }
        }
        
        setActiveCellValue(value) {
            if (this.activeCellIndex - this.string.length >= 0) {
                this.string = 
                    this.string 
                    + Array(
                        this.activeCellIndex - this.string.length + 2
                    ).join(" ")
                ;
            }
            var oldValue = this.string.charAt(this.activeCellIndex);

            this.string = 
                this.string.slice(0, this.activeCellIndex)
                + value.charAt(0)
                + this.string.slice(this.activeCellIndex + 1, this.string.length)
            ;

            this.listeners.forEach(function(l) {
                l.onActiveCellValueChanged(
                    this
                    , this.activeCellIndex
                    , this.string.charAt(this.activeCellIndex)
                    , oldValue
                );
            }, this);
        }

        getActiveCellIndex() {
            return this.activeCellIndex;
        }

        getActiveCellValue() {
            if (this.activeCellIndex < this.string.length) {
                return this.string[this.activeCellIndex];
            } else {
                return ' ';
            }
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
    };

    return Tape;
});
