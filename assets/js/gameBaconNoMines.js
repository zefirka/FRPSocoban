  $(document).ready(function(){
  var Sokoban = function(width, heigth,lvl){ 
    var that = {
      player : lvl.player,
      goals   : lvl.goals,
      blocks  : lvl.blocks,
      walls  : lvl.walls,
      direction : {x:0,y:0},

      checkVictory : function(){     
        var allInside = true;
        for(var i=0,l=game.goals.length;i<l;i++){
          var inside = false;

          for(var j=0,e=game.blocks.length;j<e;j++){
            if(game.blocks[j].x==game.goals[i].x && game.blocks[j].y==game.goals[i].y)
              inside = true;
          }

          allInside = allInside && inside;
        }

        if(allInside){
          var $g = $(".game");
          $g.css("width", $g.width());
          $g.css("height", $g.height());
          $(".game .row").remove();
          $(".game").append("You win! Tu-turu!");
        }        
      },

      draw : function(pos, color){
        var $row = $($(".row")[pos.y]), $cell = $($(".cell", $row)[pos.x]);
        $cell.css("background-color",color);
      },

      update : function(){
        for(var i=0,l=that.walls.length;i<l;i++)
          that.draw(that.walls[i], "rgb(184, 184, 184)"); 

        for(var i=0,l=that.blocks.length;i<l;i++)
          that.draw(that.blocks[i], "rgb(181, 184, 255)");

        for(var i=0,l=that.goals.length;i<l;i++)
          that.draw(that.goals[i], "rgb(255, 235, 0)");

        that.draw(that.player, "rgb(130, 212, 130)");
      }
    }; //end of that

    for(var i=0;i<width;i++){
      $(".game").append("<div class='row'></div>");
      var $row = $($(".game .row")[$(".game .row").length-1]);

      for(var j=0;j<heigth;j++){
        $row.append("<div class='cell'></div>");
        if(i==0 || i==width-1 || j==0 || j==heigth-1)
          that.walls.push({x:i,y:j});
      }
    }

    var dir =  $(document).asEventStream("keydown").filter(isArrows).map(selectDirection).onValue(function(x){
      that.direction.x = x.x;
      that.direction.y = x.y;
    });

    var playerMove = $(document).asEventStream("keydown").filter(isArrows).map(player).map(nextCell);

    var playerNextEmpty =  playerMove.filter(isEmpty).onValue(function(nov){
      that.draw(that.player, "white");
      that.player.x = nov.x;
      that.player.y = nov.y;
      that.update(that);
    });

    var goalMove = playerMove.map(isGoal).filter(function(x){return x});

    var goalNextEmpty = goalMove.map(nextCell).filter(isEmpty).onValue(function(cell){
      that.draw(that.player, "white");
      that.player.x = cell.x-that.direction.x;
      that.player.y = cell.y-that.direction.y;
      that.goals[cell.i].x = cell.x;
      that.goals[cell.i].y = cell.y;    
      that.update(that);
      that.checkVictory();
    });

    that.update();
    return that;
  }

  function isArrows(e){return e.keyCode >= 37 && e.keyCode <= 40}
  function selectDirection(e){return { x : e.keyCode % 2 ? e.keyCode - 38 : 0, y : !(e.keyCode % 2) ? e.keyCode - 39 : 0 }}
  function nextCell(cell){return {x:cell.x+game.direction.x, y:cell.y+game.direction.y, i:cell.i}}
  function player(event){return game.player}
  function isEmpty(e){
    for(var i=0,l=game.walls.length;i<l;i++){
      if(e.x == game.walls[i].x && e.y == game.walls[i].y)
        return false
    }
    for(var i=0,l=game.goals.length;i<l;i++){
      if(e.x== game.goals[i].x && e.y == game.goals[i].y)
        return false                    
    }
    return true;
  }
  function isGoal(e){
    for(var i=0,l=game.goals.length;i<l;i++){
      if( e.x== game.goals[i].x && e.y == game.goals[i].y )
        return {x:e.x,y:e.y,i:i}                    
    }
    return false;
  }

  var level1 = {
    player : {x:1,y:1},
    blocks : [{x:3,y:3},{x:3,y:4}],
    goals  : [{x:5,y:4},{x:5,y:5}],
    walls  : [{x:7,y:1},{x:7,y:2},{x:7,y:3},{x:6,y:3},{x:6,y:4}]
  }
  var game = Sokoban(8,8,level1);   
});