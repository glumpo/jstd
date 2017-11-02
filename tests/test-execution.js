define([
    'bunit',
    'assert',
    'must-throw',
    'src/datafmt',
    'src/model',
    'src/emulate/execution',
    'src/emulate/tape'
], function (
    bunit,
    assert,
    mustThrow,
    datafmt,
    model,
    Execution,
    Tape
) {
    var parse = datafmt.parse
    
    function findById(arr, id) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].id == id) {
                return arr[i];
            }
        }
    }
    
    var d_simple = {
            version: 1,
            main: "main",
            diagrams: [
                {
                    name: "main",
                    elements: [
                        {id: 1, type: "enter"},
                        {id: 2, type: "standard", machine: "r", times: 5},
                        {id: 3, type: "letter", letter: "x"},
                        {id: 4, type: "user", machine: "trivial"},
                        {id: 5, type: "exit"},
                    ],
                    links: [
                        {id: 1, conditions: null, src_el_id: 1, dst_el_id: 2},
                        {id: 2, conditions: null, src_el_id: 2, dst_el_id: 3},
                        {id: 3, conditions: null, src_el_id: 3, dst_el_id: 4},
                        {id: 4, conditions: null, src_el_id: 4, dst_el_id: 5},
                    ],
                },
                {
                    name: "trivial",
                    elements: [
                        {id: 1, type: "enter"},
                        {id: 2, type: "user", machine: "main"},
                        {id: 3, type: "exit"},
                        {id: 4, type: "user", machine: "trivial"},
                    ],
                    links: [
                        {id: 1, conditions: "1",  src_el_id: 1, dst_el_id: 2},
                        {id: 3, conditions: "0",  src_el_id: 1, dst_el_id: 3},
                        {id: 2, conditions: null, src_el_id: 2, dst_el_id: 4},
                        {id: 4, conditions: null, src_el_id: 4, dst_el_id: 3},
                    ],
                },
            ],
        };
    
    
    var d_double_enter = {
            version: 1,
            main: "main",
            diagrams: [
                {
                    name: "main",
                    elements: [
                        {id: 1, type: "enter"},
                        {id: 2, type: "enter"},
                        {id: 3, type: "letter", letter: "x"},
                        {id: 3, type: "exit"},
                    ],
                    links: [
                        {id: 1, conditions: null, src_el_id: 1, dst_el_id: 2},
                        {id: 2, conditions: null, src_el_id: 2, dst_el_id: 3},
                        {id: 3, conditions: null, src_el_id: 3, dst_el_id: 4},
                    ],
                },
            ],
        };
    
    
    
    bunit('Execution callStack', {
        setUp: function() {
            var parsed = datafmt.parse(d_simple);
            return [parsed,
                new Execution(parsed, new Tape("test"))];
        },
        "callStack.get returns object with el and iters fields)": function(parsed, exec) {
            assert(exec.callStack.get().el).not().equals(undefined);
            assert(exec.callStack.get().iters).not().equals(undefined);
        },
        "callStack.get doesn`t pop": function(parsed, exec) {
            let el1 = exec.callStack.get().el;
            let el2 = exec.callStack.get().el;
            assert(el1).equals(el2);
        },
        "EnterElement on top of the stack, check by get": function(parsed, exec) {
            assert(exec.callStack.get().el).equals(findById(parsed.main.elements, 1));
            assert(exec.callStack.get().el instanceof model.EnterElement).equals(true);
        },
        "EnterElement on top of the stack, check by pop": function(parsed, exec) {
            let el = exec.callStack.pop().el;
            assert(el).equals(findById(parsed.main.elements, 1));
            assert(el instanceof model.EnterElement).equals(true);
        },
        "EnterElement is only on element on stack, check throw data.length": function(parsed, exec) {
            exec.callStack.pop();
            assert(exec.callStack.data.length).equals(0);
        },
        "EnterElement is only on element on stack, check throw isEmpty": function(parsed, exec) {
            exec.callStack.pop();
            assert(exec.callStack.isEmpty()).equals(true);
        },
        "Number of iterations === 1": function(parsed, exec) {
            assert(exec.callStack.get().iters).equals(1);
        },
        "push to stack without iters specified works": function(parsed, exec) {
            let el = findById(parsed.diagrams["main"].elements, 2);
            exec.callStack.push(el);
            assert(exec.callStack.get().iters).equals(1);
            assert(exec.callStack.get().el).equals(el);
        },
        "push to stack with iters works": function(parsed, exec) {
            let el = findById(parsed.diagrams["main"].elements, 2);
            let iters = 3;
            exec.callStack.push(el, iters);
            assert(exec.callStack.get().iters).equals(iters);
            assert(exec.callStack.get().el).equals(el);
        },
        "push throws if needed": function(parsed, exec) {
            mustThrow(exec.callStack.push);
            let el = findById(parsed.diagrams["main"].elements, 2);
            mustThrow(exec.callStack.push, el, 0);
            mustThrow(exec.callStack.push, el, "lol");
            mustThrow(exec.callStack.push, el, el);
            mustThrow(exec.callStack.push, el, "2");
        },
    });
});