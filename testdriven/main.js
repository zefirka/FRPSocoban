var Sokoban = function(level){ 
  var lvl = level;
  var direction = {x:0,y:0};  
  var $container = $("#game");

  function draw(pos, color){
    var $row = $($(".row")[pos.y]), $cell = $($(".cell", $row)[pos.x]);
    $cell.css("background-color",color);
  }
  function drawLvl(){
    for(var i=0,l=lvl.walls.length;i<l;i++)
      draw(lvl.walls[i], "rgb(184, 184, 184)"); 

    for(var i=0,l=lvl.goals.length;i<l;i++)
      draw(lvl.goals[i], "rgb(255, 235, 0)");

    for(var i=0,l=lvl.blocks.length;i<l;i++)
      draw(lvl.blocks[i], "rgb(181, 184, 255)");

    draw(lvl.player, "rgb(130, 212, 130)");
  }
  function init(){
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
  function checkVictory(){
    if(f.allInside(lvl)){
      $container.css({"width": $container.width(), "height" : $container.height()});
      $container.append("You win! Tu-turu!");
      $(".row", $container).remove();      
    }        
  }
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
    isBlock : function (e){
      for(var i=0,l=lvl.blocks.length;i<l;i++){
        if( e.x== lvl.blocks[i].x && e.y == lvl.blocks[i].y )
          return true
      }
      return false;
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
    getLevel : function(){return lvl},
    getDirection : function(){return direction}
  };

  init();
  drawLvl();

  var f = this.functions; 
  var arrowDowns = $(document).asEventStream("keydown").filter(f.isArrows);
  var playerMove =  arrowDowns.map(f.player).map(f.move);

  arrowDowns.map(f.findDirection).onValue(updateDirection); 
  playerMove.filter(f.isEmpty).onValue(movePlayer);  
  playerMove.filter(f.isBlock).map(f.blockMove).map(f.move).filter(f.isEmpty).onValue(moveBlock);  
}