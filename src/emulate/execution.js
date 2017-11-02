define(['../model'], function(model) {

    
    class StackForElements {
        constructor() {
            this.data = [];
        }
        
        /**
         * There are some checks. They are useless.
         * But let them be.
         * @throws
         */
        push(el, iters) {
            if (!el)
                throw new Error("What should I push, u, idiot?");
            
            iters = iters || 1;
            if (!Number.isInteger(iters))
                throw new Error("Iters is not integer");
            if (iters < 1) 
                throw new Error("Too few iterations (less then 1)");
            
            this.data.push(new StackEl(el, iters));
        }
        /**
         * Pops and retunrs StackEl
         */
        pop() {
            return this.data.pop();
        }
        
        /**
         * Returns StackEl without poping
         */
        get() {
            return this.data[this.data.length - 1];
        }
        
        isEmpty() {
            return this.data.length === 0;
        }
    }
    
    
    
    /**
     * Element and number of iterations
     * 
     * @construtor
     */
    class StackEl {
        /**
         * @param {Element} el
         * @param {Integer} iters
         */
        constructor(el, iters) {
            if (!Number.isInteger(iters))
                throw new Error("Number of iterations not integer.")
            if (iters < 1)
                throw new Error("Too few iterations");
            
            this.el = el;
            this.iters = iters;
        }
        
    }
    
    
    /**
     * The main guy, who works with user data. Just call doStep (throws) and
     * check state thorow getState.
     * 
     * @constructor
     */
    class Execution {
        /**
         * @param {DiagramSet}
         *            dSet - All project to navigate
         * @param {Tape}
         *            tape
         */
        constructor(dSet, tape) {
            this.tape = tape;
            this.dSet = dSet;
            this.dMain = dSet.main;
            
            let enterEls = this.dMain.getEnterElements();
            if (enterEls.length !== 1)
                throw new Error("getEnterElements length " + enterEls.length);
            
            this.callStack = new StackForElements();
            this.callStack.push(enterEls[0]);
            
            this.state = Execution.StatesEnum[Execution.StatesEnum.notstarted];
            
            /**
             * Returns one of StatesEnum members
             */
            this.getState = function () {
                return this.state;
            }
        }
        
        /**
         * Returns next element, those will be used next iteration
         * 
         * @throws
         */
        predictNextElement() {
            // TODO: impliment;
        }
        
        /**
         * Will execute diagram.
         * 
         * @throws
         */
        doStep() {
            //TODO: impliment;
        }
        
    }
    
    Execution.StatesEnum = {
            running : "runing",
            crashed : "crashed",
            notstarted : "notstarted",
            terminated : "terminated",
            completed : "completed"
    };
    Object.freeze(Execution.StatesEnum);
    
    return Execution;

});
