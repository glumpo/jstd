define(['bunit', 'assert', 'must-throw', 'src/datafmt', 'src/model'], function (bunit, assert, mustThrow, datafmt, model) {
    var parse = datafmt.parse,
        serialize = datafmt.serialize;

    var d_empty = {
        version: 1,
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
        diagrams: [
            {
                name: "main",
                elements: [
                    {id: 0, type: "enter"},
                    {id: 1, type: "call", machine: "r", times: 5},
                    {id: 2, type: "call", machine: "'x'"},
                    {id: 3, type: "call", machine: "trivial"},
                    {id: 4, type: "exit"},
                ],
                links: [
                    {id: 0, conditions: null, src_el_id: 0, dst_el_id: 1},
                    {id: 1, conditions: null, src_el_id: 1, dst_el_id: 2},
                    {id: 2, conditions: null, src_el_id: 2, dst_el_id: 3},
                    {id: 3, conditions: null, src_el_id: 3, dst_el_id: 4},
                ],
            },
            {
                name: "trivial",
                elements: [
                    {id: 0, type: "enter"},
                    {id: 1, type: "call", machine: "main"},
                    {id: 2, type: "exit"},
                    {id: 3, type: "call", machine: "trivial"},
                ],
                links: [
                    {id: 0, conditions: "1",  src_el_id: 0, dst_el_id: 1},
                    {id: 2, conditions: "0",  src_el_id: 0, dst_el_id: 2},
                    {id: 1, conditions: null, src_el_id: 1, dst_el_id: 3},
                    {id: 3, conditions: null, src_el_id: 3, dst_el_id: 2},
                ],
            },
        ],
    };



    bunit("datafmt-v1:parse. Парсер парсит правильные типы данных", {
        setUp: function() {
            return [parse(d_simple)];
        },
        diagramsAreObject: function(parsed) {
            assert(parsed.diagrams).is('object');
            assert(parsed.diagrams).not().equals(null);
        },
        diagramHasRightType: function(parsed) {
            var d = parsed.diagrams["main"];
            assert(d).isDefined();
            assert(d.constructor).equals(model.Diagram);
        },
        elementsAreArray: function(parsed) {
            var d = parsed.diagrams["main"];
            assert(d.elements).is('array');
            assert(d.elements).not().equals(null);
        },
        linksAreArray: function(parsed) {
            var d = parsed.diagrams["main"];
            assert(d.links).is('array');
            assert(d.links).not().equals(null);
        },
        linkHasRightType: function(parsed) {
            var d = parsed.diagrams["main"];
            assert(d.links[0].constructor).equals(model.Link);
        },
        enterHasRightType: function(parsed) {
            var d = parsed.diagrams["main"];
            assert(d.elements[0].constructor).equals(model.EnterElement);
        },
        callHasRightType: function(parsed) {
            var d = parsed.diagrams["main"];
            assert(d.elements[1].constructor).equals(model.CallElement);
        },
        exitHasRightType: function(parsed) {
            var d = parsed.diagrams["main"];
            assert(d.elements[4].constructor).equals(model.ExitElement);
        },
        callHasTimes: function(parsed) {
            var d = parsed.diagrams["main"];
            assert(d.elements[1].times).equals(5);
        },
        defaultTimesIs1: function(parsed) {
            var d = parsed.diagrams["main"];
            assert(d.elements[2].times).equals(1);
        },
        callMachineParsed: function(parsed) {
            var d = parsed.diagrams["main"];
            assert(d.elements[1].machine).equals("r");
        },
    });

    bunit("datafmt-v1:parse. Прописываются id и name", {
        setUp: function () {
            return [parse(d_simple)];
        },
        diagramHasName: function(parsed) {
            var d = parsed.diagrams["main"];
            assert(d.name).equals("main");
        },
        elementHasIntegerId: function(parsed) {
            var d = parsed.diagrams["main"];
            // Тут внимательно, "0" как строка не подойдёт:
            // после парсинга поле id должно быть целым числом
            assert(d.elements[0].id).equals(0);
            assert(d.elements[1].id).equals(1);
            assert(d.elements[2].id).equals(2);
            assert(d.elements[3].id).equals(3);
            assert(d.elements[4].id).equals(4);
        },
        linkHasIntegerId: function(parsed) {
            var d = parsed.diagrams["main"];
            // Тут внимательно, "0" как строка не подойдёт:
            // после парсинга поле id должно быть целым числом
            assert(d.links[0].id).equals(0);
            assert(d.links[1].id).equals(1);
            assert(d.links[2].id).equals(2);
            assert(d.links[3].id).equals(3);
        },
    });

    bunit("datafmt-v1:parse. Проставляются ссылки на элементы и линки", {
        setUp: function () {
            return [parse(d_simple)];
        },
        linkSrcElementIdChangedToLinks: function(parsed) {
            var d = parsed.diagrams["main"];

            assert(d.links[0].src_el_id).not().isDefined();
            assert(d.links[0].src).is("object");
            assert(d.links[0].src).equals(d.elements[0]);
        },
        linkDstElementIdChangedToLinks: function(parsed) {
            var d = parsed.diagrams["main"];

            assert(d.links[0].dst_el_id).not().isDefined();
            assert(d.links[0].dst).is("object");
            assert(d.links[0].dst).equals(d.elements[1]);
        },
        elementHasInsLinkList: function(parsed) {
            var d = parsed.diagrams["main"];

            assert(d.elements[1].ins).is("array");
            assert(d.elements[1].ins[0]).isDefined();
        },
        elementHasOutsLinkList: function(parsed) {
            var d = parsed.diagrams["main"];

            assert(d.elements[0].outs).is("array");
            assert(d.elements[0].outs[0]).isDefined();
        },
    });
    

    bunit("datafmt-v1:serialize. Формируется правильный объект", {
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
        versionAdded: function(obj, elements, links) {
            assert(obj.version).isDefined();
        },
        diagramHasRightType: function(obj, elements, links) {
            var d = obj.diagrams["main"];
            assert(d).isDefined();
            assert(d.constructor).not().equals(model.Diagram);
        },
        linkHasRightType: function(obj, elements, links) {
            assert(links[0]).isDefined();
            assert(links[0].constructor).equals(Object);
        },
        enterHasRightType: function(obj, elements, links) {
            assert(elements[0]).isDefined();
            assert(elements[0].constructor).equals(Object);
        },
        exitHasRightType: function(obj, elements, links) {
            var d = obj.diagrams["main"];
            assert(elements[4]).isDefined();
            assert(elements[4].constructor).equals(Object);
        },
        callHasRightType: function(obj, elements, links) {
            var d = obj.diagrams["main"];
            assert(elements[1]).isDefined();
            assert(elements[1].constructor).equals(Object);
        },

    });

});