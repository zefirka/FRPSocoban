var Sokoban = function(levels){ 
  var currentLevel = 0;
  var lvl = levels[currentLevel];
  var direction = {x:0,y:0};  
  var $container = $("#game");
  var paused = false;
  var mineGenTimeout;

  function generateMineAndRedraw(interval){  
    if(!paused){
      mineGenTimeout = setTimeout(function(){
        var genX = (1 + Math.random()*lvl.width) >> 0;
        var genY = (1 + Math.random()*lvl.height) >> 0;

        $container.trigger({
          type : "mineCreated",
          x: genX,
          y: genY
        });
        generateMineAndRedraw(interval);
      }, interval);
    }else{
      clearTimeout(mineGenTimeout);
    }
  }
  function draw(pos, color){
    var $row = $($(".row")[pos.y]), $cell = $($(".cell", $row)[pos.x]);
    $cell.css("background-color",color);
  }
  function drawLvl(q){
    for(var i=0,l=q.walls.length;i<l;i++)
      draw(q.walls[i], "rgb(184, 184, 184)"); 
    
    for(var i=0,l=q.mines.length;i<l;i++)
          draw(q.mines[i], "rgb(216, 18, 18)");  

    for(var i=0,l=q.goals.length;i<l;i++)
      draw(q.goals[i], "rgb(255, 235, 0)");

    for(var i=0,l=q.blocks.length;i<l;i++)
      draw(q.blocks[i], "rgb(181, 184, 255)");

    draw(q.player, "rgb(130, 212, 130)");
  }
  function init(q){
    for(var i = 0; i<q.height; i++){
      $container.append("<div class='row'></div>"); 
      var $row = $($(".row", $container)[i]); 

      for(var j = 0; j<q.width; j++){
        $row.append("<div class='cell'></div>"); 
        if((j==0 || j==q.width-1) || (i==0 || i==q.height-1))
          lvl.walls.push({x:j,y:i})
      }
    }
  }
  function updateDirection(x){direction.x = x.x; direction.y = x.y;}
  function movePlayer(nov){
    draw(lvl.player, "white");
    lvl.player.x = nov.x;
    lvl.player.y = nov.y;
    drawLvl(lvl);
  }
  function moveBlock(cell){
    draw(lvl.player, "white");
    lvl.player.x = cell.x-direction.x;
    lvl.player.y = cell.y-direction.y;
    lvl.blocks[cell.i].x = cell.x;
    lvl.blocks[cell.i].y = cell.y;    
    drawLvl(lvl)
    return lvl;
  }
  function alertMessage(msg){
    return function(){
      $container.css({"width": $container.width(), "height" : $container.height()});
      $(".row", $container).remove();  $container.append("<div class='msg'>"+msg+"</ div>");
    }
  }
  function drawNewMine(e){
    lvl.mines.push(e);
    draw(e, "rgb(216, 18, 18)");
    $container.trigger({
      type : "newMineDrawed",
      x : e.x,
      y : e.y
    })
  }
  function win(e){
    alertMessage("You win!")();
    currentLevel++;
    lvl = levels[currentLevel];

    $container.trigger({
      type : "gameWin",
      level : lvl.name
    })
  }
  function lose(e){
    alertMessage("You lose!")();
    $container.trigger({
      type : "gameLose",
    })
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Clean functions
  this.functions = {
    findDirection : function (e){return { x : e.keyCode % 2 ? e.keyCode - 38 : 0, y : !(e.keyCode % 2) ? e.keyCode - 39 : 0 }},
    isArrows : function(e){return  (e !== undefined) && (e.keyCode !== undefined) ? (e.keyCode >= 37 && e.keyCode <= 40) : false},
    isEmpty : function(e){
      for(var i=0,l=lvl.walls.length;i<l;i++){
        if(e.x == lvl.walls[i].x && e.y == lvl.walls[i].y)
          return false
      }
      for(var i=0,l=lvl.blocks.length;i<l;i++){
        if(e.x== lvl.blocks[i].x && e.y == lvl.blocks[i].y)
          return false                    
      }
      return true;
    },
    newMineAllowed : function(e){
      var res = true;
      res = f.isEmpty(e);
      for(var i=0,l=lvl.mines.length;i<l;i++){
        if(e.x== lvl.mines[i].x && e.y == lvl.mines[i].y)
          res = false                    
      }
      for(var i=0,l=lvl.goals.length;i<l;i++){
        if(e.x== lvl.goals[i].x && e.y == lvl.goals[i].y)
          res = false                    
      }
      if(e.x== lvl.player.x && e.y == lvl.player.y){
          res = false  
      }
      return res;
    },
    checkCell : function (cell){
      return function(e){
        for(var i=0,l=lvl[cell].length;i<l;i++){
          if( e.x== lvl[cell][i].x && e.y == lvl[cell][i].y )
            return true
        }
        return false;
      }
    },
    blockMove : function(e){
      for(var i=0,l=lvl.blocks.length;i<l;i++){
          if( e.x== lvl.blocks[i].x && e.y == lvl.blocks[i].y )
            return {x:e.x,y:e.y,i:i}                    
      }
    },
    move : function(cell){return {x:cell.x+direction.x, y:cell.y+direction.y, i:cell.i}},
    player : function(){return lvl.player},
    allInside : function(map){
      var res = true;
      for(var i=0,l=map.blocks.length;i<l;i++){
        var inside = false;

        for(var j=0,e=map.goals.length;j<e;j++){
          if(map.goals[j].x==map.blocks[i].x && map.goals[j].y==map.blocks[i].y)
            inside = true;
        }
        res = res && inside;
      }
      return res;
    },
    coordinates : function(e){
      return {x:e.x, y:e.y}
    },
    getLevel : function(){return lvl}
  };

  function centrate(){
    $container.css({
      "left" : ($(window).width()/2 - $container.width()/2 - 100),
      "top" : ($(window).height()/2 - $container.height()/2 - 100)
    })
  }



  /////////////////////////////////////
  //Initialization
  function initLevel(q){
    centrate();
    paused = false;
    init(q);
    drawLvl(q);
    generateMineAndRedraw(5000);  
  }

  initLevel(lvl);
  

  function startNewLevel(x){
    paused = true;
    currentLevel++;

    $container.append("<a href='#' id='nextLevel'>Next level</a>")
    $("#nextLevel").on("click", function(e){
      e.preventDefault;
      $("*", $container).remove();
      $container.css({"width": "", "height" : ""});
      initLevel(lvl);
    })
  }


  //////////////////////////////////////////////
  //Logic
  var f = this.functions; 

  var mineCreations = $container.asEventStream("mineCreated"); //создания новых мин
  var newMineCoordinates = mineCreations.map(f.coordinates); //берем координаты
  var newMinePlace = newMineCoordinates.filter(f.newMineAllowed); //место куда приходит мина

  var arrowDowns = $(document).asEventStream("keydown").filter(f.isArrows);
  var playerMove =  arrowDowns.map(f.player).map(f.move);
  var blockMove = playerMove.filter(f.checkCell("blocks")).map(f.blockMove);
  var blockMoveMine = blockMove.map(f.move).filter(f.checkCell("mines"));
  var playerMoveMine = playerMove.filter(f.checkCell("mines"));
  var loose = blockMoveMine.merge(playerMoveMine);  

  var victory = blockMove.map(f.move).filter(f.isEmpty).map(moveBlock).filter(f.allInside);

  var wins = $container.asEventStream("gameWin");
  var showNextLevel = wins.onValue(startNewLevel);

  var resizes = $(window).asEventStream("resize");
  var centrations = resizes.onValue(centrate);

  arrowDowns.map(f.findDirection).onValue(updateDirection); 
  playerMove.filter(f.isEmpty).onValue(movePlayer);  
  newMinePlace.onValue(drawNewMine); //рисуем мину как она родилась

  victory.onValue(win); 
  loose.onValue(lose);
}

//я переписал функцию checkVictory на alertMessage, чтобы выдавать сообщения о том, что проиграли.