define([
    'bunit',
    'assert',
    'must-throw',
    'src/model',
    './mock-diagrams'
], function (
    bunit,
    assert,
    mustThrow,
    model,
    mock
) {

    bunit("Link", {
        "Match works on single chars: fail on ''": mustThrow(function() {
            var l = new model.Link(null);
            l.matches("");
        }),
        "Match works on single chars: fail on string": mustThrow(function() {
            var l = new model.Link(null);
            l.matches("hello");
        }),
        "Empty string conditions match nothing": function() {
            var l = new model.Link("");
            assert(l.matches("0")).equals(false);
            assert(l.matches(" ")).equals(false);
        },
        "Null conditions match anything": function() {
            var l = new model.Link(null);
            assert(l.matches("0")).equals(true);
            assert(l.matches(" ")).equals(true);
        },
        "Single char condition matches": function() {
            var l = new model.Link("0");
            assert(l.matches("0")).equals(true);
            assert(l.matches(" ")).equals(false);
        },
        "Multi char condition matches": function() {
            var l = new model.Link("0 ");
            assert(l.matches("0")).equals(true);
            assert(l.matches(" ")).equals(true);
            assert(l.matches("1")).equals(false);
        },
    });

    bunit("DiagramSet. Diagram addition and removal", {
        setUp: function() {
            var ds = mock.createBinInvertDiagramSet();
            return [ds];
        },
        "AddDiagram adds diagram": function(ds) {
            var d = new model.Diagram();
            ds.addDiagram(d, "test");
            assert(ds.diagrams["test"]).equals(d);
        },
        "Add duplicate diagram fails": mustThrow(function(ds) {
            ds.addDiagram(new model.Diagram(), "test");
            ds.addDiagram(new model.Diagram(), "test");
        }),
        "RemoveDiagram removes diagram": function(ds) {
            var d = new model.Diagram();
            ds.addDiagram(d, "test");
            ds.removeDiagram(d);
            assert(ds.diagrams["test"]).not().isDefined();
        },
        "Removing last diagram unsets main": function(ds) {
            assert(ds.main).isDefined();
            assert(ds.main).not().equals(null);
            ds.removeDiagram(ds.main);
            assert(ds.main).equals(null);
        },
        "Adding diagram to empty DiagramSet sets main": function() {
            var ds = new model.DiagramSet();
            var d = new model.Diagram();
            ds.addDiagram(d, "first");
            assert(ds.main).equals(d);
            ds.removeDiagram(d);
            d = new model.Diagram();
            ds.addDiagram(d, "first-again");
            assert(ds.main).equals(d);
        },
        "AddDiagram notifies listener": function(ds) {
            var notified = null;
            ds.addListener({
                onDiagramAdded: function(ds, d) { notified = d; },
            });
            var d = new model.Diagram();
            ds.addDiagram(d, "test");
            assert(notified).equals(d);
        },
        "RemoveDiagram notifies listener": function(ds) {
            var notified = null;
            var d = new model.Diagram();
            ds.addDiagram(d);
            ds.addListener({
                onDiagramRemoved: function(ds, d) { notified = d; },
            });
            ds.removeDiagram(d);
            assert(notified).equals(d);
        },
    });

    bunit("Diagram. Elements and Links addition and removal", {
        setUp: function() {
            var ds = mock.createBinInvertDiagramSet();
            return [ds.main];
        },
        "AddElement adds element": function(d) {
            var el = new model.ExitElement();
            d.addElement(el);
            assert(d.elements.indexOf(el)).not().equals(-1);
        },
        "AddLink adds link": function(d) {
            var link = new model.Link("");
            d.addLink(link, d.elements[0], d.elements[1]);
            assert(d.links.indexOf(link)).not().equals(-1);
        },
        "AddLink updates src element's outs": function(d) {
            var link = new model.Link("");
            var src = d.elements[0];
            var dst = d.elements[1];
            d.addLink(link, src, dst);
            assert(src.outs.indexOf(link)).not().equals(-1);
        },
        "AddLink udpates dst element's ins": function(d) {
            var link = new model.Link("");
            var src = d.elements[0];
            var dst = d.elements[1];
            d.addLink(link, src, dst);
            assert(dst.ins.indexOf(link)).not().equals(-1);
        },
        "AddElement notifies listener": function(d) {
            var notified = null;
            d.addListener({
                onElementAdded: function(d, e) { notified = e; },
            });
            var el = new model.ExitElement();
            d.addElement(el);
            assert(notified).equals(el);
        },
        "AddLink notifies listener": function(d) {
            var notified = null;
            d.addListener({
                onLinkAdded: function(d, l) { notified = l; },
            });
            var link = new model.Link("");
            var src = d.elements[0];
            var dst = d.elements[1];
            d.addLink(link, src, dst);
            assert(notified).equals(link);
        },
        "RemoveElement removes element": function(d) {
            var el = d.elements[0];
            d.removeElement(el);
            assert(d.elements.indexOf(el)).equals(-1);
        },
        "RemoveLink removes link": function(d) {
            var link = d.links[0];
            d.removeLink(link);
            assert(d.links.indexOf(link)).equals(-1);
        },
        "RemoveLink udpates src element's outs": function(d) {
            var link = d.links[0];
            var el = link.src;
            d.removeLink(link);
            assert(el.outs.indexOf(link)).equals(-1);
        },
        "RemoveLink updates dst element's ins": function(d) {
            var link = d.links[0];
            var el = link.dst;
            d.removeLink(link);
            assert(el.ins.indexOf(link)).equals(-1);
        },
        "RemoveElement purges its in and out links": function(d) {
            var el = d.elements[1];
            var links = [].concat(el.ins).concat(el.outs);
            d.removeElement(el);
            links.forEach(function(l) {
                assert(d.links.indexOf(l)).equals(-1);
            });
        },
        "RemoveLink notifies listener": function(d) {
            var notified = null;
            d.addListener({
                onLinkRemoved: function(d, l) { notified = l; },
            });
            var link = d.links[0];
            d.removeLink(link);
            assert(notified).equals(link);
        },
        "RemoveElement notifies listener": function(d) {
            var notifiedLinks = [];
            var notifiedEl;
            d.addListener({
                onElementRemoved: function(d, e) { notifiedEl = e; },
                onLinkRemoved: function(d, l) { notifiedLinks.push(l); },
            });
            var el = d.elements[1];
            var expectedLinks = [].concat(el.ins).concat(el.outs);
            d.removeElement(el);
            assert(notifiedEl).equals(el);
            expectedLinks.forEach(function(l) {
                assert(notifiedLinks.indexOf(l)).not().equals(-1);
            });
        },
    });

    bunit("DiagramSet. Listeners", {
        setUp: function() {
            var ds = mock.createBinInvertDiagramSet();
            return [ds];
        },
        "AddListener skips already added listener": function(ds) {
            var listener = {};
            ds.addListener(listener);
            ds.addListener(listener);
            var count = ds.listeners.reduce(function(res, l) {
                return l == listener ? res + 1 : res;
            }, 0);
            assert(count).equals(1);
        },
        "RemoveListener removes listener": function(ds) {
            var listener = {};
            ds.addListener(listener);
            ds.removeListener(listener);
            var count = ds.listeners.reduce(function(res, l) {
                return l == listener ? res + 1 : res;
            }, 0);
            assert(count).equals(0);
        },
        "Listener added while notifying ARE NOT notified": function(ds) {
            var l1 = {
                onDiagramAdded: function(ds, d) { ds.addListener(l2); }
            };
            var l2_notified = false;
            var l2 = {
                onDiagramAdded: function(ds, d) { l2_notified = true; }
            };
            ds.addListener(l1);
            ds.addDiagram(new model.Diagram(), "test");
            assert(l2_notified).equals(false);
        },
        "Listener removed while notifying ARE still notified": function(ds) {
            var l1_notified = false;
            var l2_notified = false;
            var l1 = { onDiagramAdded: function(ds, d) {
                l1_notified = true; ds.removeListener(l2);
            } };
            var l2 = { onDiagramAdded: function(ds, d) {
                l2_notified = true; ds.removeListener(l1);
            } };
            ds.addListener(l1);
            ds.addListener(l2);
            ds.addDiagram(new model.Diagram(), "test");
            assert(l2_notified && l1_notified).equals(true);
        },
    });
        
    bunit("Diagram. Listeners", {
        setUp: function() {
            var ds = mock.createBinInvertDiagramSet();
            return [ds];
        },
        "AddListener skips already added listener": function(ds) {
            var listener = {};
            ds.main.addListener(listener);
            ds.main.addListener(listener);
            var count = ds.main.listeners.reduce(function(res, l) {
                return l == listener ? res + 1 : res;
            }, 0);
            assert(count).equals(1);
        },
        "RemoveListener removes listener": function(ds) {
            var listener = {};
            ds.main.addListener(listener);
            ds.main.removeListener(listener);
            var count = ds.main.listeners.reduce(function(res, l) {
                return l == listener ? res + 1 : res;
            }, 0);
            assert(count).equals(0);
        },
        "Listener added while notifying ARE NOT notified": function(ds) {
            var l1 = {
                onLinkAdded: function(d, l) { ds.main.addListener(l2); }
            };
            var l2_notified = false;
            var l2 = {
                onLinkAdded: function(d, l) { l2_notified = true; }
            };
            ds.main.addListener(l1);
            ds.main.addLink(new model.Link(''),
                ds.main.elements[0], ds.main.elements[7]);
            assert(l2_notified).equals(false);
        },
        "Listener removed while notifying ARE still notified": function(ds) {
            var l1_notified = false;
            var l2_notified = false;
            var l1 = { onLinkAdded: function(d, l) {
                l1_notified = true; ds.main.removeListener(l2);
            } };
            var l2 = { onLinkAdded: function(d, l) {
                l2_notified = true; ds.main.removeListener(l1);
            } };
            ds.main.addListener(l1);
            ds.main.addListener(l2);
            ds.main.addLink(new model.Link(''),
                ds.main.elements[0], ds.main.elements[7]);
            assert(l2_notified && l1_notified).equals(true);
        },
    });
});
