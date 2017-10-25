define([
    'bunit',
    'assert',
    'must-throw',
    'src/datafmt',
    'src/model'
], function (
    bunit,
    assert,
    mustThrow,
    datafmt,
    model
) {
    var parse = datafmt.parse,
        serialize = datafmt.serialize;

    function findById(arr, id) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].id == id) {
                return arr[i];
            }
        }
    }

    var d_empty = {
        version: 1,
        main: "main",
        diagrams: [
            {
                name: "main",
                elements: [],
                links: [],
            },
        ],
    };

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



    bunit("datafmt-v1:parse", {
        setUp: function() {
            return [parse(d_simple)];
        },
        "Parsed DiagramSet's diagrams field is object": function(parsed) {
            assert(parsed.diagrams).is('object');
            assert(parsed.diagrams).not().equals(null);
        },
        "Parsed Diagram has right class": function(parsed) {
            var d = parsed.diagrams["main"];
            assert(d).isDefined();
            assert(d.constructor).equals(model.Diagram);
        },
        "Parsed Diagram's elements field is array": function(parsed) {
            var d = parsed.diagrams["main"];
            assert(d.elements).is('array');
            assert(d.elements).not().equals(null);
        },
        "Parsed Diagram's links field is array": function(parsed) {
            var d = parsed.diagrams["main"];
            assert(d.links).is('array');
            assert(d.links).not().equals(null);
        },
        "Parsed Link has right type": function(parsed) {
            var d = parsed.diagrams["main"];
            assert(d.links[0].constructor).equals(model.Link);
        },
        "Parsed Element has integer id": function(parsed) {
            var d = parsed.diagrams["main"];
            d.elements.forEach(function(el) {
                assert(typeof el.id == 'number').equals(true);
            });
        },
        "Parsed Link has integer id": function(parsed) {
            var d = parsed.diagrams["main"];
            d.links.forEach(function(l) {
                assert(typeof l.id == 'number').equals(true);
            });
        },
        "Parsed EnterElement has right type": function(parsed) {
            var d = parsed.diagrams["main"];
            assert(findById(d.elements, 1).constructor).equals(model.EnterElement);
        },
        "Parsed StandardMachine has right type": function(parsed) {
            var d = parsed.diagrams["main"];
            assert(findById(d.elements, 2).constructor).equals(model.StandardMachine);
        },
        "Parsed ExitElement has right type": function(parsed) {
            var d = parsed.diagrams["main"];
            assert(findById(d.elements, 5).constructor).equals(model.ExitElement);
        },
        "Parsed StandardMachine has times field": function(parsed) {
            var d = parsed.diagrams["main"];
            assert(findById(d.elements, 2).times).equals(5);
        },
        "Parsed LetterMachine has right type": function(parsed) {
            var d = parsed.diagrams["main"];
            assert(findById(d.elements, 3).constructor).equals(model.LetterMachine);
        },
        "Parsed LetterMachine has right field letter": function(parsed) {
            var d = parsed.diagrams["main"];
            assert(findById(d.elements, 3).letter).equals("x");
        },
        "Parsed LetterMachine has NOT times field": function(parsed) {
            var d = parsed.diagrams["main"];
            assert(findById(d.elements, 3).times).equals(undefined);
        },
        "Parsed UserMachine has right type": function(parsed) {
            var d = parsed.diagrams["main"];
            assert(findById(d.elements, 4).constructor).equals(model.UserMachine);
        },
        "Parsed StandardMachine's machine field is correct": function(parsed) {
            var d = parsed.diagrams["main"];
            assert(findById(d.elements, 2).machine).equals("r");
        },
        "Parsed DiagramSet has main diagram set": function(parsed) {
            assert(parsed.main).equals(parsed.diagrams["main"]);
        },
        "Parsed Diagram has name": function(parsed) {
            var d = parsed.diagrams["main"];
            assert(d.name).equals("main");
        },
        "Parsed Link's src field is Element": function(parsed) {
            var d = parsed.diagrams["main"];

            var link = findById(d.links, 1);
            var el = findById(d.elements, 1);
            assert(link.src_el_id).not().isDefined();
            assert(link.src).is("object");
            assert(link.src).equals(el);
        },
        "Parsed Link's dst field is Element": function(parsed) {
            var d = parsed.diagrams["main"];

            var link = findById(d.links, 1);
            var el = findById(d.elements, 2);
            assert(link.dst_el_id).not().isDefined();
            assert(link.dst).is("object");
            assert(link.dst).equals(el);
        },
        "Parsed Elements's ins field is array": function(parsed) {
            var d = parsed.diagrams["main"];

            var el = findById(d.elements, 2);
            assert(el.ins).is("array");
            assert(el.ins[0]).isDefined();
        },
        "Parsed Elements's outs field is array": function(parsed) {
            var d = parsed.diagrams["main"];

            var el = findById(d.elements, 1);
            assert(el.outs).is("array");
            assert(el.outs[0]).isDefined();
        },
        
    });

    bunit("datafmt-v1:serialize", {
        setUp: function () {
            var parsed_d_simple = parse(d_simple);
            var serialized = serialize(parsed_d_simple);
            var main_elements_by_id = serialized.
                diagrams["main"].elements.
                reduce(function(res, el) {
                    res[el.id] = el;
                    return res;
                }, {});
            var main_links_by_id = serialized.
                diagrams["main"].links.
                reduce(function(res, link) {
                    res[link.id] = link;
                    return res;
                }, {});
            return [serialized, main_elements_by_id, main_links_by_id];
        },
        "Version added to serialized DiagramSet": function(obj, elements, links) {
            assert(obj.version).isDefined();
        },
        "Serialized Diagram is POJSO": function(obj, elements, links) {
            var d = obj.diagrams["main"];
            assert(d).isDefined();
            assert(d.constructor).equals(Object);
        },
        "Serialized Link is POJSO": function(obj, elements, links) {
            assert(links[0]).isDefined();
            assert(links[0].constructor).equals(Object);
        },
        "Serialized StartElement is POJSO": function(obj, elements, links) {
            assert(elements[0]).isDefined();
            assert(elements[0].constructor).equals(Object);
        },
        "Serialized ExitElement is POJSO": function(obj, elements, links) {
            var d = obj.diagrams["main"];
            assert(elements[4]).isDefined();
            assert(elements[4].constructor).equals(Object);
        },
        "Serialized CallElement is POJSO": function(obj, elements, links) {
            var d = obj.diagrams["main"];
            assert(elements[1]).isDefined();
            assert(elements[1].constructor).equals(Object);
        },

    });

});