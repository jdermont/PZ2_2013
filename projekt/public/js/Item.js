var Item = function(startX, startY, startImageSrc) {
    var x = startX,
        y = startY,
        imageSrc = startImageSrc;

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

    var drawItem = function(ctx, xLocal, yLocal) {
        var image = new Image(),
            date = new Date(),
            guard = date.getSeconds();

        switch (guard % 4) {
            case 0:
                imageSrc = imageSrc.slice(0, imageSrc.indexOf(';')) + ';/1.png';
                break;
            case 1:
                imageSrc = imageSrc.slice(0, imageSrc.indexOf(';')) + ';/2.png';
                break;
            case 2:
                imageSrc = imageSrc.slice(0, imageSrc.indexOf(';')) + ';/3.png';
                break;
            case 3:
                imageSrc = imageSrc.slice(0, imageSrc.indexOf(';')) + ';/2.png';
                break;
        }

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
        drawItem: drawItem
    }
};

if(typeof(exports) !== 'undefined' && exports !== null) {
    exports.Item = Item;
}
