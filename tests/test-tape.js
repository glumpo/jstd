define([
    'bunit',
    'assert',
    'must-throw',
    'src/emulate/tape',
], function (
    bunit,
    assert,
    mustThrow,
    Tape,
) {

    bunit("Tape", {
        "Empty tape creation": function() {
            var t = new Tape();
            // have virtually infinite number of spaces to the right, so trim right
            assert(t.asString().trimRight()).equals("");
        },
        "Tape creation from string": function() {
            var s = " 1243  3      ";
            var t = new Tape(s);
            // have virtually infinite number of spaces to the right, so trim right
            assert(t.asString().trimRight()).equals(s.trimRight());
        },
        "Newly created tape's active cell index is 0": function() {
            // set active cell to the first space after input words is not
            // the tape's job, tape is stupid and by default starts from 0
            assert(new Tape().getActiveCellIndex()).equals(0);
            assert(new Tape(" 232 1   ").getActiveCellIndex()).equals(0);
        },
        "SetActiveCellIndex throws when < 0": mustThrow(function() {
            new Tape().setActiveCellIndex(-10);
        }),
        "SetActiveCellIndex changes active cell": function() {
            var t = new Tape(" 110011 ");
            t.setActiveCellIndex(5);
            assert(t.getActiveCellIndex()).equals(5);
            t.setActiveCellIndex(0);
            assert(t.getActiveCellIndex()).equals(0);
        },
        "GetActiveCellValue works within tape data": function() {
            var t = new Tape(" 110011 ");
            assert(t.getActiveCellValue()).equals(" ");
            t.setActiveCellIndex(5);
            assert(t.getActiveCellValue()).equals("1");
        },
        "SetActiveCellIndex enlarges tape to the right": function() {
            var t = new Tape(" 110011 ");
            t.setActiveCellIndex(50);
            assert(t.getActiveCellIndex()).equals(50);
            assert(t.getActiveCellValue()).equals(" ");
        },
        "Tape asString is long enough to fit active cell": function() {
            var t = new Tape(" 1010");
            t.setActiveCellIndex(50);
            assert(t.asString().length).between(51, null);
        },
        "SetActiveCellValue changes active cell value": function() {
            var t = new Tape("012345");
            t.setActiveCellIndex(3);
            t.setActiveCellValue("x");
            assert(t.getActiveCellValue()).equals("x");
        },
        "SetActiveCellValue changes tape as string": function() {
            var t = new Tape("012345");
            t.setActiveCellIndex(3);
            t.setActiveCellValue("x");
            assert(t.asString().trimRight()).equals("012x45");
        },
        "SetActiveCellValue affects tape size": function() {
            var t = new Tape("012345");
            t.setActiveCellIndex(10);
            t.setActiveCellValue("x");
            t.setActiveCellIndex(0);
            assert(t.asString().trimRight()).equals("012345    x");
        },
        "SetActiveCellIndex notifies listeners": function() {
            var tape = new Tape("");
            var notified = false;
            tape.addListener({
                onActiveCellIndexChanged: function(t, newi, oldi) {
                    notified = true;
                    assert(tape).equals(t);
                    assert(newi).equals(10);
                    assert(oldi).equals(0);
                },
            });
            tape.setActiveCellIndex(10);
            assert(notified).equals(true);
        },
        "SetActiveCellValue notifies listeners": function() {
            var tape = new Tape("");
            var notified = false;
            tape.addListener({
                onActiveCellValueChanged: function(t, idx, newv, oldv) {
                    notified = true;
                    assert(tape).equals(t);
                    assert(idx).equals(0);
                    assert(newv).equals("x");
                    assert(oldv).equals(" ");
                },
            });
            tape.setActiveCellValue("x");
            assert(notified).equals(true);
        },
        "Listener added while notifying ARE NOT notified": function() {
            var l1_notified = false;
            var l2_notified = false;
            var l1 = { onActiveCellIndexChanged: function(t, newi, oldi) {
                l1_notified = true;
                t.addListener(l2);
            } };
            var l2 = { onActiveCellIndexChanged: function(t, newi, oldi) {
                l2_notified = true;
            } };
            var t = new Tape();
            t.addListener(l1);
            t.setActiveCellIndex(10);
            assert(l1_notified).equals(true);
            assert(l2_notified).equals(false);
        },
        "Listener removed while notifying ARE still notified": function() {
            var l1_notified = false;
            var l2_notified = false;
            var l1 = { onActiveCellIndexChanged: function(t, newi, oldi) {
                l1_notified = true;
                t.removeListener(l2);
            } };
            var l2 = { onActiveCellIndexChanged: function(t, newi, oldi) {
                l2_notified = true;
                t.removeListener(l1);
            } };
            var t = new Tape();
            t.addListener(l1);
            t.addListener(l2);
            t.setActiveCellIndex(10);
            assert(l2_notified && l1_notified).equals(true);
        },
    });
});
