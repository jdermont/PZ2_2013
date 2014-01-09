var socket,
    canvas,
    ctx,
    keys,
    localPlayer,
    remotePlayers,
    remotePlayersPoints,
    remoteItems,
    remoteNpcs,
    imageSize = 32,
    imageCenter = imageSize / 2,
    characterImageLength = 2, // 48,
    you,
    tradeGuard = false,
    makeTrade = false,
    onSale,
    outcomeItem,
    incomeItem,
    handlerek,
    seconds = Math.round(Math.random()*100)+800;

var init = function() {
    var name = window.prompt("Enter your name:","Player");
    if (name.indexOf("T") != 0) $('#sterowanie').empty();
    else {
     document.getElementById("up_arrow").addEventListener("mousedown", onKeyDown, false);
    document.getElementById("right_arrow").addEventListener("mousedown", onKeyDown, false);
    document.getElementById("left_arrow").addEventListener("mousedown", onKeyDown, false);
    document.getElementById("down_arrow").addEventListener("mousedown", onKeyDown, false); 
    }
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    canvas.width = 500;
    canvas.height = 500;

    keys = new Keys();

    remotePlayers = [];
    remotePlayersPoints = [];
    remoteItems = [];
    remoteNpcs = [];

    socket = io.connect(window.location.host.name);

    var startX = Math.round((Math.random() * (1586 - imageSize)) - 543 + imageCenter),
        startY = Math.round((Math.random() * (1586 - imageSize)) - 543 + imageCenter),
        startImage = Math.floor(Math.random() * characterImageLength + 1),
        startImageSrc = 'img/characters/' + startImage + ';/down-2.png',
        startInventory = [];

    localPlayer = new Player(startX, startY, startImageSrc, startInventory, 0);
    localPlayer.name = name;
    //localPlayer.setCoordGuard(false);

    //socket.emit("generate coords");

    setEventHandlers();
    handlerek = setInterval(function(){
      $('#stopwatch').empty();
      seconds--;
      var minutes = Math.floor(seconds / 60);
      var sec = seconds % 60;
      if (sec < 10) sec = "0"+sec;
      document.getElementById("stopwatch").innerHTML="This rounds ends in... "+minutes+":"+sec;
      if (seconds == 0) {
	window.clearInterval(handlerek);
	alert("Round is over!");
      }
    },1000);
    
};

var setEventHandlers = function() {
    window.addEventListener("keydown", onKeyDown, false);
    window.addEventListener("mouseup", onKeyUp, false);
    window.addEventListener("keyup", onKeyUp, false);
    window.addEventListener("resize", onResize, false);

    //socket.on("coords generated", onCoordsGenerated);
    socket.on("id", onId);
    socket.on("connect", onSocketConnected);
    socket.on("disconnect", onSocketDisconnect);
    socket.on("new player", onNewPlayer);
    socket.on("move player", onMovePlayer);
    socket.on("remove player", onRemovePlayer);
    socket.on("new item", onNewItem);
    socket.on("new npc", onNewNpc);
    socket.on("item collected", onItemCollected);
    socket.on("clear players points", onClearPlayersPoints);
    socket.on("points updated", onPointsUpdated);
    socket.on("sort players points", onSortPlayersPoints);
    socket.on("quest changed", onQuestChanged);
    socket.on("player stopped", onPlayerStopped);
    socket.on("local winner", onLocalWinner);
    socket.on("winner", onWinner);
    socket.on("item inserted", onItemInserted);
    socket.on("trade accepted", onTradeAccepted);
    socket.on("item sent", onItemSent);
    socket.on("exchange", onExchange);
};

/*var onCoordsGenerated = function(data) {
    localPlayer.setX(data.x);
    localPlayer.setY(data.y);
    localPlayer.setCoordGuard(true);
}*/

var onKeyDown = function(e) {
  if (e.target.id == "up_arrow") e.keyCode = 38;
  else if (e.target.id == "left_arrow") e.keyCode = 37;
  else if (e.target.id == "right_arrow") e.keyCode = 39;
  else if (e.target.id == "down_arrow") e.keyCode = 40;
    if (localPlayer) {
        keys.onKeyDown(e);
    }
};

var onKeyUp = function(e) {
    if (e.target.id == "up_arrow") e.keyCode = 38;
  else if (e.target.id == "left_arrow") e.keyCode = 37;
  else if (e.target.id == "right_arrow") e.keyCode = 39;
  else if (e.target.id == "down_arrow") e.keyCode = 40;
    if (localPlayer) {
        keys.onKeyUp(e);
    }
};

var onResize = function() {
    canvas.width = 500;
    canvas.height = 500;
};

var onId = function (data) {
    you = data.id;
};

var onSocketConnected = function() {
    console.log("Connected to socket server");

    socket.emit("new player", {x: localPlayer.getX(), y: localPlayer.getY(),
        image: localPlayer.getImageSrc(),
        inventory: localPlayer.getInventory(),
        points: localPlayer.getPoints(),
        name: localPlayer.name
    });

    socket.emit("update points", {points: localPlayer.getPoints()});
};

var onSocketDisconnect = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!alert("Server is unavailable")) {
        location.reload();
    }
    console.log("Disconnected from socket server");
};

var onNewPlayer = function(data) {
    var newPlayer = new Player(data.x, data.y, data.image, data.inventory, data.points);
    newPlayer.id = data.id;
    newPlayer.name = data.name

    console.log("New player connected: " + data.id);

    remotePlayers.push(newPlayer);
};

var onNewItem = function(data) {
    var newItem = new Item(data.x, data.y, data.image);

    remoteItems.push(newItem);
};

var onNewNpc = function(data) {
    var newNpc = new Npc(data.x, data.y, data.image);
    newNpc.setItemList(data.itemList);
    newNpc.setDesiredItem(data.desiredItem);
    newNpc.setReward(data.reward);

    remoteNpcs.push(newNpc);
};

var onMovePlayer = function(data) {
    var movePlayer = playerById(data.id);

    if (!movePlayer) {
        console.log("Player not found: " + data.id);
        return;
    }

    movePlayer.setX(data.x);
    movePlayer.setY(data.y);
    movePlayer.setImageSrc(data.image);
};

var onItemCollected = function(data) {
    remoteItems.splice(data.id, 1);
};

var onQuestChanged = function(data) {
    remoteNpcs[data.id].setDesiredItem(data.desiredItem);
    remoteNpcs[data.id].setReward(data.reward);
};

var onClearPlayersPoints = function() {
    remotePlayersPoints = [];
};

var onPointsUpdated = function(data) {
    remotePlayersPoints.push({player: data.player, points: data.points, name: data.name});
};

var onSortPlayersPoints = function() {
    var i;

    $('#scoreboard').empty();
    $('<tr><th style="border-right: 1px solid black;">Player</th><th>Points</th></tr>').appendTo('#scoreboard');

    remotePlayersPoints.sort(comparePlayersPoints);

    for (i = 0; i < remotePlayersPoints.length; i += 1) {
        if (remotePlayersPoints[i].player == you) {
            $('<tr  style="font-weight:bold"><td style="border-right: 1px solid black;">' + remotePlayersPoints[i].name + '</td>' +
              '<td>' + remotePlayersPoints[i].points + '</td></tr>').appendTo('#scoreboard');
        } else {
            $('<tr><td style="border-right: 1px solid black;">' + remotePlayersPoints[i].name + '</td>' +
              '<td>' + remotePlayersPoints[i].points + '</td></tr>').appendTo('#scoreboard');
        }
    }
};

var onPlayerStopped = function(data) {
    var stopPlayer = playerById(data.id);

    if (!stopPlayer) {
        return;
    }

    stopPlayer.setImageSrc(data.image);
};

var onLocalWinner = function() {
    if (!alert("Congratulations! You are the winner!")) {
        location.reload();
    }
};

var onWinner = function(data) {
    if (!alert("You lost! The winner is " + data.winner)) {
        location.reload();
    }
};

var onRemovePlayer = function(data) {
    var removePlayer = playerById(data.id), i;

    if (!removePlayer) {
        console.log("Player not found: " + data.id);
        return;
    }

    for (i = 0; i < remotePlayersPoints.length; i += 1) {
        if (remotePlayersPoints[i].player === data.id.slice(0, 8)) {
            remotePlayersPoints.splice(i, 1);
            onSortPlayersPoints();
            break;
        }
    }

    remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};

var animate = function() {
    updateLocalPlayer();
    
    drawWorld();
    window.requestAnimFrame(animate);
   
};

var updateLocalPlayer = function() {
    if (localPlayer.update(keys)) {
        socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY(), image: localPlayer.getImageSrc()});
    }
};

var onItemInserted = function(data) {
    incomeItem = data.item;

    $('#trade1').empty();
    $('<img>').attr('src', data.item).appendTo('#trade1');
};

var onTradeAccepted = function() {
    tradeGuard = true;
};

var onItemSent = function() {
    var localInventory = localPlayer.getInventory(), inventoryId;

    inventoryId = '#item' + (onSale + 1);
    $(inventoryId).empty();
    $('<img>').attr('src', incomeItem).appendTo(inventoryId);

    localInventory[onSale] = incomeItem;

    localPlayer.setInventory(localInventory);
};

var onExchange = function() {
    var localInventory = localPlayer.getInventory(), inventoryId;

    inventoryId = '#item' + (onSale + 1);
    $(inventoryId).empty();
    $('<img>').attr('src', incomeItem).appendTo(inventoryId);

    localInventory[onSale] = incomeItem;

    localPlayer.setInventory(localInventory);
}

var drawWorld = function() {
    var i;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (i = 0; i < remoteNpcs.length; i += 1) {
        remoteNpcs[i].drawNpc(ctx, localPlayer.getX(), localPlayer.getY());
    }

    for (i = 0; i < remoteItems.length; i += 1) {
        remoteItems[i].drawItem(ctx, localPlayer.getX(), localPlayer.getY());
    }

    for (i = 0; i < remotePlayers.length; i += 1) {
        remotePlayers[i].drawPlayer(ctx, localPlayer.getX(), localPlayer.getY());
    }

    localPlayer.drawLocalPlayer(ctx);
};

var playerById = function(id) {
    for (var i = 0; i < remotePlayers.length; i += 1) {
        if (remotePlayers[i].id == id)
            return remotePlayers[i];
    }

    return false;
};

var collision = function(objectOneX, objectOneY, objectTwo) {
    return objectOneX < objectTwo.getX() + imageSize &&  // Object One is going   LEFT    on   RIGHT    edge of Object Two
        objectOneX + imageSize > objectTwo.getX() &&     // Object One is going   RIGHT   on   LEFT     edge of Object Two
        objectOneY < objectTwo.getY() + imageSize &&     // Object One is going   UP      on   BOTTOM   edge of Object Two
        objectOneY + imageSize > objectTwo.getY();       // Object One is going   DOWN    on   TOP      edge of Object Two
};

var comparePlayersPoints = function(a,b) {
    if (a.points > b.points) {
        return -1;
    } else if (a.points < b.points) {
        return 1;
    } else {
        return 0;
    }
};
