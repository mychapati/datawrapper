

/*
 * DataColumn abstracts the functionality of each column
 * of a dataset. A column has a type (text|number|date).
 */
dw.column = function(label, rows, type) {

    function guessType() {

        if (_.every(rows, _.isNumber)) return dw.column.types.number();
        if (_.every(rows, _.isDate)) return dw.column.types.date();
        // guessing column type by counting parsing errors
        // for every known type
        var types = [
                dw.column.types.date(rows.slice(0, 20)),
                dw.column.types.number(rows.slice(0, 20)),
                dw.column.types.text()
            ],
            type,
            k = rows.length,
            tolerance = 0.1; // allowing 10% mis-parsed values

        _.each(rows, function(val) {
            _.each(types, function(t) {
                t.parse(val);
            });
        });
        _.every(types, function(t) {
            if (t.errors() / k < tolerance) type = t;
            return !type;
        });
        return type;
    }

    type = type ? dw.column.types[type](rows.slice(0, 50)) : guessType();

    var range;

    // public interface
    var column = {
        // column label
        label: function() { return label; },
        // number of rows
        length: rows.length,
        // column.val(i) .. returns ith row of the col, parsed
        val: function(i) {
            return type.parse(rows[i]);
        },
        // each
        each: function(f) {
            for (i=0; i<rows.length; i++) {
                f(column.val(i), i);
            }
        },
        // access to raw values
        raw: function() { return rows; },
        // column type
        type: function() { return type.name(); },
        // [min,max] range
        range: function() {
            if (!type.toNum) return false;
            if (!range) {
                range = [Number.MAX_VALUE, -Number.MAX_VALUE];
                column.each(function(v) {
                    v = type.toNum(v);
                    if (v < range[0]) range[0] = v;
                    if (v > range[1]) range[1] = v;
                });
                range[0] = type.fromNum(range[0]);
                range[1] = type.fromNum(range[1]);
            }
            return range;
        }
    };
    return column;
};