define(['../model'], function(model) {

    
    /**
     * push it in callStack
     * @construtor
     */
    class stackEl {
        /**
         * @param {Diagram} diagram - Diagram to push
         * @param {integer} iters - Number of iterations
         * @throws
         */
        constructor(diagram, iters) {
            if (!Number.isInteger(iters))
                throw new Error("Not integer.")
            if (iters < 1)
                throw new Error("Too few iterations");
            
            this.diagram = diagram;
            this.iters = iters;
        }
        
    }
    
    
    /**
     * The main guy, who works with user data.
     * Just call doStep (throws) and check state thorow getState.
     * @constructor
     */
    class Execution {
        /**
         * @param {DiagramSet} dSet - All project to navigate
         * @param {Diagram} dMain - The main diagram to start with
         * @param {Tape} tape
         */
        constructor(dSet, dMain, tape) {
            this.tape = tape;
            this.dSet = dSet;
            this.dMain = dMain;
            
            this.callStack = [];
            this.callStack.push(dMain.getEnterElement());
            if (!Execution.statesEnum) {
                Execution.statesEnum = {
                        running : "runing",
                        crashed : "crashed",
                        notstarted : "notstarted",
                        terminated : "terminated",
                        completed : "completed"
                };
                Object.freeze(Execution.statesEnum);
            }
            this.state = this.statesEnum[this.statesEnum.notstarted];
            
            /**
             * Returns one of statesEnum members
             */
            this.getState = function () {
                return state;
            }
        }
        
        /**
         * Returns next element, those will be used next iteration
         * @throws
         */
        predictNextElement() {
            // TODO: impliment;
        }
        
        /**
         * Will execute diagram.
         * @throws
         */
        doStep() {
            //TODO: impliment;
        }
        
    }
    
    return Execution;

});
