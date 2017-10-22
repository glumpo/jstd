define(['src/model'], function(model) {
    "use strict";

    function createBinInvertDiagramSet() {
        var ds = new model.DiagramSet();
        var main = new model.Diagram();
        ds.addDiagram(main, "main");
        var e1, e2, e3, e4, e5, e6, e7, e8;
        e1 = new model.EnterElement();
        e2 = new model.CallElement("l");
        e3 = new model.CallElement("'0'");
        e4 = new model.CallElement("'1'");
        e5 = new model.CallElement("R", 2);
        e6 = new model.CallElement("'+'");
        e7 = new model.CallElement("r");
        e8 = new model.ExitElement();
        main.addElement(e1);
        main.addElement(e2);
        main.addElement(e3);
        main.addElement(e4);
        main.addElement(e5);
        main.addElement(e6);
        main.addElement(e7);
        main.addElement(e8);
        main.addLink(new model.Link(null), e1, e2);
        main.addLink(new model.Link("0"), e2, e3);
        main.addLink(new model.Link("1"), e2, e4);
        main.addLink(new model.Link(" "), e2, e5);
        main.addLink(new model.Link(null), e5, e6);
        main.addLink(new model.Link(null), e6, e7);
        main.addLink(new model.Link(null), e7, e8);
        main.addLink(new model.Link(null), e2, e1);
        main.addLink(new model.Link(null), e3, e1);
        return ds;
    }

    return {
        createBinInvertDiagramSet: createBinInvertDiagramSet,
    }
});

