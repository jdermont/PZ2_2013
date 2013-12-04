var Npc = function(startX, startY, startImageSrc) {
    var x = startX,
        y = startY,
        imageSrc = startImageSrc,
        itemList,
        desiredItem,
        reward;

    var getX = function() {
        return x;
    };

    var setX = function(newX) {
        x = newX;
    };

    var getY = function() {
        return y;
    };

    var setY = function(newY) {
        y = newY;
    };

    var getImageSrc = function() {
        return imageSrc;
    };

    var setImageSrc = function(newImageSrc) {
        imageSrc = newImageSrc;
    };

    var getItemList = function () {
        return itemList;
    };

    var setItemList = function (itemImageLength) {
        itemList = itemImageLength;
    };

    var getDesiredItem = function() {
        return desiredItem;
    };

    var setDesiredItem = function(newDesiredItem) {
        desiredItem = newDesiredItem;
    };

    var getReward = function() {
        return reward;
    };

    var setReward = function(newReward) {
        reward = newReward;
    };

    var generateQuest = function() {
        var image = Math.floor(Math.random() * itemList + 1);
        desiredItem = 'img/items/' + image + ';/2.png';
        reward  = Math.floor(Math.random() * 20 + 1);
    };

    var drawNpc = function(ctx, xLocal, yLocal) {
        var image = new Image();
        image.src = imageSrc;

        if (!(xLocal > -300)) {
            // LEFT
            if (!(yLocal > -300)) {
                // TOP
                ctx.drawImage(image, x + 300 + canvas.width / 2 - imageCenter, y + 300 + canvas.height / 2 - imageCenter);
            } else if (yLocal < 800 && yLocal > -300) {
                // CENTER
                ctx.drawImage(image, x + 300 + canvas.width / 2 - imageCenter, y - yLocal + canvas.height / 2 - imageCenter);
            } else {
                // BOTTOM
                ctx.drawImage(image, x + 300 + canvas.width / 2 - imageCenter, y - 300 - canvas.height / 2 - imageCenter);
            }
        } else if (xLocal < 800 && xLocal > -300) {
            // CENTER
            if (!(yLocal > -300)) {
                // TOP
                ctx.drawImage(image, x - xLocal + canvas.width / 2 - imageCenter, y + 300 + canvas.height / 2 - imageCenter);
            } else if (yLocal < 800 && yLocal > -300) {
                // CENTER
                ctx.drawImage(image, x - xLocal + canvas.width / 2 - imageCenter, y - yLocal + canvas.height / 2 - imageCenter);
            } else {
                // BOTTOM
                ctx.drawImage(image, x - xLocal + canvas.width / 2 - imageCenter, y - 300 - canvas.height / 2 - imageCenter);
            }
        } else {
            // RIGHT
            if (!(yLocal > -300)) {
                // TOP
                ctx.drawImage(image, x - 300 - canvas.width / 2 - imageCenter, y + 300 + canvas.height / 2 - imageCenter);
            } else if (yLocal < 800 && yLocal > -300) {
                // CENTER
                ctx.drawImage(image, x - 300 - canvas.width / 2 - imageCenter, y - yLocal + canvas.height / 2 - imageCenter);
            } else {
                // BOTTOM
                ctx.drawImage(image, x - 300 - canvas.width / 2 - imageCenter, y - 300 - canvas.height / 2 - imageCenter);
            }
        }
    };

    return {
        getX: getX,
        setX: setX,
        getY: getY,
        setY: setY,
        getImageSrc: getImageSrc,
        setImageSrc: setImageSrc,
        getItemList: getItemList,
        setItemList: setItemList,
        getDesiredItem: getDesiredItem,
        setDesiredItem: setDesiredItem,
        getReward: getReward,
        setReward: setReward,
        generateQuest: generateQuest,
        drawNpc: drawNpc
    }
};

if(typeof(exports) !== 'undefined' && exports !== null) {
    exports.Npc = Npc;
}