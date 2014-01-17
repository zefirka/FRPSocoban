var Sokoban = function(level){ 
  var lvl = level;
  var direction = {x:0,y:0};  
  var $container = $("#game");

  var draw = function(pos, color){
    var $row = $($(".row")[pos.y]), 
        $cell = $($(".cell", $row)[pos.x]);
    $cell.css("background-color",color);
  }

  var drawLvl = function(){
    for(var i=0,l=lvl.walls.length;i<l;i++)
      draw(lvl.walls[i], "rgb(184, 184, 184)"); 

    for(var i=0,l=lvl.goals.length;i<l;i++)
      draw(lvl.goals[i], "rgb(255, 235, 0)");

    for(var i=0,l=lvl.blocks.length;i<l;i++)
      draw(lvl.blocks[i], "rgb(181, 184, 255)");

    draw(lvl.player, "rgb(130, 212, 130)");
  }

  var init = function(){
    for(var i = 0; i<lvl.height; i++){
      $container.append("<div class='row'></div>"); 
      var $row = $($(".row", $container)[i]); 

      for(var j = 0; j<lvl.width; j++){
        $row.append("<div class='cell'></div>"); 
        if((j==0 || j==lvl.width-1) || (i==0 || i==lvl.height-1))
          lvl.walls.push({x:j,y:i})
      }
    }
  }

  var checkVictory = function(){
    var allInside = true;
    for(var i=0,l=lvl.blocks.length;i<l;i++){
      var inside = false;

      for(var j=0,e=lvl.goals.length;j<e;j++){
        if(lvl.goals[j].x==lvl.blocks[i].x && lvl.goals[j].y==lvl.blocks[i].y)
          inside = true;
      }
      allInside = allInside && inside;
    }

    if(allInside){
      $container.css("width", $container.width());
      $container.css("height", $container.height());
      $container.append("You win! Tu-turu!");
      $(".row", $container).remove();      
    }        
  }

  init();
  drawLvl();

  var keyDowns = $(document).asEventStream("keydown");
  var arrowDowns = keyDowns.filter(isArrows);
  var currentDirection = arrowDowns.map(findDirection);
  currentDirection.onValue(updateDirection);

  var player = arrowDowns.map(player)
  var playerMove = player.map(move);
  var moveToEmpty = playerMove.filter(isEmpty);
  moveToEmpty.onValue(movePlayer);

  var moveOnBlock = playerMove.filter(isBlock);
  var blockMove = moveOnBlock.map(blockMove);
  var blockMoveToEmpty = blockMove.map(move).filter(isEmpty).onValue(moveBlock);  

  //Clean functions
  function findDirection(e){return { x : e.keyCode % 2 ? e.keyCode - 38 : 0, y : !(e.keyCode % 2) ? e.keyCode - 39 : 0 }}
  function isArrows(e){return e.keyCode >= 37 && e.keyCode <= 40}
  function player(){return lvl.player}
  function isEmpty(e){
    console.log("Is empty this: "+ this)
    for(var i=0,l=lvl.walls.length;i<l;i++){
      if(e.x == lvl.walls[i].x && e.y == lvl.walls[i].y)
        return false
    }
    for(var i=0,l=lvl.blocks.length;i<l;i++){
      if(e.x== lvl.blocks[i].x && e.y == lvl.blocks[i].y)
        return false                    
    }
    return true;
  }
  function isBlock(e){
    for(var i=0,l=lvl.blocks.length;i<l;i++){
      if( e.x== lvl.blocks[i].x && e.y == lvl.blocks[i].y )
        return true
    }
    return false;
  }

  function blockMove(e){
    for(var i=0,l=lvl.blocks.length;i<l;i++){
        if( e.x== lvl.blocks[i].x && e.y == lvl.blocks[i].y )
          return {x:e.x,y:e.y,i:i}                    
    }
  }
  function move(cell){return {x:cell.x+direction.x, y:cell.y+direction.y, i:cell.i}}

  //Side effects
  function updateDirection(x){direction.x = x.x; direction.y = x.y;}
  function movePlayer(nov){
    draw(lvl.player, "white");
    lvl.player.x = nov.x;
    lvl.player.y = nov.y;
    drawLvl();
  }
  function moveBlock(cell){
    draw(lvl.player, "white");
    lvl.player.x = cell.x-direction.x;
    lvl.player.y = cell.y-direction.y;
    lvl.blocks[cell.i].x = cell.x;
    lvl.blocks[cell.i].y = cell.y;    
    drawLvl()
    checkVictory();
  }

  return this;
}
