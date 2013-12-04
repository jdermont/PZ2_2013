var Player = function(startX, startY, startImageSrc, startInventory, startPoints) {
    var x = startX,
        y = startY,
        imageSrc = startImageSrc,
        inventory = startInventory,
        points = startPoints,
        inventorySize = 6,
        moveAmount = 2,
        counterUp = 0,
        counterDown = 0,
        counterLeft = 0,
        counterRight = 0,
        id;

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

    var getInventory = function() {
        return inventory;
    };

    var setInventory = function(newInventory) {
        inventory = newInventory;
    };

    var getPoints = function() {
        return points;
    };

    var setPoints = function(newPoints) {
        points = newPoints;
    };

    var usedSpace = function(x, y, keys) {
        var i, j, k, src, inventoryId;

        for (i = 0; i < remotePlayers.length; i += 1) {
            if (collision(x, y, remotePlayers[i])) {
                src = remotePlayers[i].getImageSrc().slice(0, remotePlayers[i].getImageSrc().indexOf(';')) + '/down-2.png';

                $('#player').empty();
                $('#nick').html('other player');

                $('<img>').attr('src', src).appendTo('#player');
                $('#nick').html(remotePlayers[i].id.slice(0, 8));

                if (keys.one) {
                    $('#trade1local').empty();
                    $('<img>').attr('src', inventory[0]).appendTo('#trade1local');
                    socket.emit("insert item", {to: remotePlayers[i].id, item: inventory[0]});
                    onSale = 0;
                } else if (keys.two) {
                    $('#trade1local').empty();
                    $('<img>').attr('src', inventory[1]).appendTo('#trade1local');
                    socket.emit("insert item", {to: remotePlayers[i].id, item: inventory[1]});
                    onSale = 1;
                } else if (keys.three) {
                    $('#trade1local').empty();
                    $('<img>').attr('src', inventory[2]).appendTo('#trade1local');
                    socket.emit("insert item", {to: remotePlayers[i].id, item: inventory[2]});
                    onSale = 2;
                } else if (keys.four) {
                    $('#trade1local').empty();
                    $('<img>').attr('src', inventory[3]).appendTo('#trade1local');
                    socket.emit("insert item", {to: remotePlayers[i].id, item: inventory[3]});
                    onSale = 3;
                } else if (keys.five) {
                    $('#trade1local').empty();
                    $('<img>').attr('src', inventory[4]).appendTo('#trade1local');
                    socket.emit("insert item", {to: remotePlayers[i].id, item: inventory[4]});
                    onSale = 4;
                } else if (keys.six) {
                    $('#trade1local').empty();
                    $('<img>').attr('src', inventory[5]).appendTo('#trade1local');
                    socket.emit("insert item", {to: remotePlayers[i].id, item: inventory[5]});
                    onSale = 5;
                }

                if (keys.t && $('#trade1local').html() != '') {
                    socket.emit("accept trade", {to: remotePlayers[i].id});
                    makeTrade = true;
                }

                if (tradeGuard && makeTrade) {
                    outcomeItem = inventory[onSale];

                    socket.emit("send item", {to: remotePlayers[i].id});
                    $('#trade1local').empty();
                    $('#trade1').empty();

                    tradeGuard = makeTrade = false;
                }

                keys.one = keys.two = keys.three = keys.four = keys.five = keys.six = keys.t = false;

                break;
            } else {
                $('#player').empty();
                $('#nick').html('other player');
                $('#trade1').empty();
                $('#trade1local').empty();
            }
        }

        keys.one = keys.two = keys.three = keys.four = keys.five = keys.six = keys.t = false;

        for (i = 0; i < remoteNpcs.length; i += 1) {
            if (collision(x, y, remoteNpcs[i])) {
                $('#npc').empty();
                $('#lookUpItem').empty();
                $('#reward').html('');

                $('<img>').attr('src', remoteNpcs[i].getImageSrc()).appendTo('#npc');
                $('<img>').attr('src', remoteNpcs[i].getDesiredItem()).appendTo('#lookUpItem');
                $('#reward').html(remoteNpcs[i].getReward());

                if (keys.q) {
                    for (j = 0; j < inventory.length; j += 1) {
                        if (inventory[j] == remoteNpcs[i].getDesiredItem()) {
                            for (k = j; k < inventory.length - 1; k += 1) {
                                inventoryId = '#item' + (k + 1);
                                $(inventoryId).empty();
                                $('<img>').attr('src', inventory[k + 1]).appendTo(inventoryId);
                            }

                            inventoryId = '#item' + (k + 1);
                            $(inventoryId).empty();

                            inventory.splice(j, 1);
                            points += remoteNpcs[i].getReward();
                            socket.emit("update points", {points: points});

                            remoteNpcs[i].generateQuest();
                            socket.emit("change quest", {id: i, desiredItem: remoteNpcs[i].getDesiredItem(), reward: remoteNpcs[i].getReward()});

                            keys.q = false;

                            break;
                        }
                    }
                }

                break;
            } else {
                $('#npc').empty();
                $('#lookUpItem').empty();
                $('#reward').html('');
            }
        }

        keys.q = false;

        for (i = 0; i < remoteItems.length; i += 1) {
            if (collision(x, y, remoteItems[i]) && inventory.length < inventorySize) {
                inventoryId = '#item' + (inventory.length + 1);
                src = remoteItems[i].getImageSrc().slice(0, remoteItems[i].getImageSrc().indexOf(';')) + ';/2.png';

                inventory.push(src);
                $('<img>').attr('src', inventory[inventory.length - 1]).appendTo(inventoryId);

                socket.emit("collect item", {id: i});
                remoteItems.splice(i, 1);
                socket.emit("generate item");
            }
        }
    };

    var update = function(keys) {
        var prevX = x,
            prevY = y;

        usedSpace(x, y, keys);

        // UP KEY PRIORITY
        if (keys.up && y > -510) {
            if ((keys.left && x > -510) || (keys.right && x < 1010)) {
                y -= moveAmount / 2;
            } else {
                y -= moveAmount;
            }

            counterUp += 1;

            switch (counterUp % 40) {
                case 1:
                    imageSrc = imageSrc.slice(0, imageSrc.indexOf(';')) + ';/up-1.png';
                    break;
                case 11:
                    imageSrc = imageSrc.slice(0, imageSrc.indexOf(';')) + ';/up-2.png';
                    break;
                case 21:
                    imageSrc = imageSrc.slice(0, imageSrc.indexOf(';')) + ';/up-3.png';
                    break;
                case 31:
                    imageSrc = imageSrc.slice(0, imageSrc.indexOf(';')) + ';/up-2.png';
                    break;
            }
        } else if (keys.down && y < 1010) {
            if ((keys.left && x > -510) || (keys.right && x < 1010)) {
                y += moveAmount / 2;
            } else {
                y += moveAmount;
            }

            counterDown += 1;

            switch (counterDown % 40) {
                case 1:
                    imageSrc = imageSrc.slice(0, imageSrc.indexOf(';')) + ';/down-1.png';
                    break;
                case 11:
                    imageSrc = imageSrc.slice(0, imageSrc.indexOf(';')) + ';/down-2.png';
                    break;
                case 21:
                    imageSrc = imageSrc.slice(0, imageSrc.indexOf(';')) + ';/down-3.png';
                    break;
                case 31:
                    imageSrc = imageSrc.slice(0, imageSrc.indexOf(';')) + ';/down-2.png';
                    break;
            }
        };

        // LEFT KEY PRIORITY
        if (keys.left && x > -510) {
            if ((keys.up && y > -510) || (keys.down && y < 1010)) {
                x -= moveAmount / 2;
            } else {
                x -= moveAmount;
                counterLeft += 1;

                switch (counterLeft % 40) {
                    case 1:
                        imageSrc = imageSrc.slice(0, imageSrc.indexOf(';')) + ';/left-1.png';
                        break;
                    case 11:
                        imageSrc = imageSrc.slice(0, imageSrc.indexOf(';')) + ';/left-2.png';
                        break;
                    case 21:
                        imageSrc = imageSrc.slice(0, imageSrc.indexOf(';')) + ';/left-3.png';
                        break;
                    case 31:
                        imageSrc = imageSrc.slice(0, imageSrc.indexOf(';')) + ';/left-2.png';
                        break;
                }
            }
        } else if (keys.right && x < 1010) {
            if ((keys.up && y > -510) || (keys.down && y < 1010)) {
                x += moveAmount / 2;
            } else {
                x += moveAmount;
                counterRight += 1;

                switch (counterRight % 40) {
                    case 1:
                        imageSrc = imageSrc.slice(0, imageSrc.indexOf(';')) + ';/right-1.png';
                        break;
                    case 11:
                        imageSrc = imageSrc.slice(0, imageSrc.indexOf(';')) + ';/right-2.png';
                        break;
                    case 21:
                        imageSrc = imageSrc.slice(0, imageSrc.indexOf(';')) + ';/right-3.png';
                        break;
                    case 31:
                        imageSrc = imageSrc.slice(0, imageSrc.indexOf(';')) + ';/right-2.png';
                        break;
                }
            }
        }

        $('#coordsX').html('X :  ' + x);
        $('#coordsY').html('Y :  ' + y);

        if (prevX != x || prevY != y) {
            return true
        } else {
            imageSrc = imageSrc.slice(0, imageSrc.indexOf('-')) + '-2.png';
            socket.emit("stop player", {image: imageSrc});
            counterUp = counterDown = counterLeft = counterRight = 0;
            return false;
        }
    };

    var drawLocalPlayer = function(ctx) {
        var image = new Image();
        image.src = imageSrc;

        if (!(x > -300)) {
            // LEFT
            if (!(y > -300)) {
                // TOP
                ctx.fillRect(0, 0, canvas.width, 1);
                ctx.fillRect(0, 0, 1, canvas.height);
                ctx.drawImage(image, x + 300 + canvas.width / 2 - imageCenter, y + 300 + canvas.height / 2 - imageCenter);
            } else if (y < 800 && y > -300) {
                // CENTER
                ctx.fillRect(0, 0, 1, canvas.height);
                ctx.drawImage(image, x + 300 + canvas.width / 2 - imageCenter, canvas.height / 2 - imageCenter);
            } else {
                // BOTTOM
                ctx.fillRect(0, canvas.height - 1, canvas.width, 1);
                ctx.fillRect(0, 0, 1, canvas.height);
                ctx.drawImage(image, x + 300 + canvas.width / 2 - imageCenter, y - 300 - canvas.height / 2 - imageCenter);
            }
        } else if (x < 800 && x > -300) {
            // CENTER
            if (!(y > -300)) {
                // TOP
                ctx.fillRect(0, 0, canvas.width, 1);
                ctx.drawImage(image, canvas.width / 2 - imageCenter, y + 300 + canvas.height / 2 - imageCenter);
            } else if (y < 800 && y > -300) {
                // CENTER
                ctx.drawImage(image, canvas.width / 2 - imageCenter, canvas.height / 2 - imageCenter);
            } else {
                // BOTTOM
                ctx.fillRect(0, canvas.height - 1, canvas.width, 1);
                ctx.drawImage(image, canvas.width / 2 - imageCenter, y - 300 - canvas.height / 2 - imageCenter);
            }
        } else {
            // RIGHT
            if (!(y > -300)) {
                // TOP
                ctx.fillRect(0, 0, canvas.width, 1);
                ctx.fillRect(canvas.width - 1, 0, 1, canvas.height);
                ctx.drawImage(image, x - 300 - canvas.width / 2 - imageCenter, y + 300 + canvas.height / 2 - imageCenter);
            } else if (y < 800 && y > -300) {
                // CENTER
                ctx.fillRect(canvas.width - 1, 0, 1, canvas.height);
                ctx.drawImage(image, x - 300 - canvas.width / 2 - imageCenter, canvas.height / 2 - imageCenter);
            } else {
                // BOTTOM
                ctx.fillRect(0, canvas.height - 1, canvas.width, 1);
                ctx.fillRect(canvas.width - 1, 0, 1, canvas.height);
                ctx.drawImage(image, x - 300 - canvas.width / 2 - imageCenter, y - 300 - canvas.height / 2 - imageCenter);
            }
        }
    };

    var drawPlayer = function(ctx, xLocal, yLocal) {
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
        getInventory: getInventory,
        setInventory: setInventory,
        getPoints: getPoints,
        setPoints: setPoints,
        update: update,
        drawLocalPlayer: drawLocalPlayer,
        drawPlayer: drawPlayer,
        id: id
    }
};

if(typeof(exports) !== 'undefined' && exports !== null) {
    exports.Player = Player;
}
