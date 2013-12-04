var Keys = function(kup, kleft, kright, kdown, kone, ktwo, kthree, kfour, kfive, ksix, kq, kt) {
    var up = kup || false,
        left = kleft || false,
        right = kright || false,
        down = kdown || false,
        one = kone || false,
        two = ktwo || false,
        three = kthree || false,
        four = kfour || false,
        five = kfive || false,
        six = ksix || false,
        q = kq || false,
        t = kt || false;

    var onKeyDown = function(parameter) {
        var that = this,
            key = parameter.keyCode;

        switch (key) {
            case 37:
                // LEFT
                that.left = true;
                break;
            case 38:
                // UP
                that.up = true;
                break;
            case 39:
                // RIGHT
                that.right = true;
                break;
            case 40:
                // DOWN
                that.down = true;
                break;
        }
    };

    var onKeyUp = function(parameter) {
        var that = this,
            key = parameter.keyCode;

        switch (key) {
            case 37:
                // LEFT
                that.left = false;
                break;
            case 38:
                // UP
                that.up = false;
                break;
            case 39:
                // RIGHT
                that.right = false;
                break;
            case 40:
                // DOWN
                that.down = false;
                break;
            case 49:
                // 1
                that.one = true;
                break;
            case 50:
                // 2
                that.two = true;
                break;
            case 51:
                // 3
                that.three = true;
                break;
            case 52:
                // 4
                that.four = true;
                break;
            case 53:
                // 5
                that.five = true;
                break;
            case 54:
                // 6
                that.six = true;
                break;
            case 81:
                // Q
                that.q = true;
                break;
            case 84:
                // T
                that.t = true;
                break;
        };
    };

    return {
        up: up,
        left: left,
        right: right,
        down: down,
        onKeyDown: onKeyDown,
        onKeyUp: onKeyUp,
        one: one,
        two: two,
        three: three,
        four: four,
        five: five,
        six: six,
        q: q,
        t: t
    };
};