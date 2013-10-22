$(document).ready(function(){
  var Sokoban = function(width,heigth,lvl){
    var that = {
      player : lvl.player,
      blocks : lvl.blocks,
      goals : lvl.goals,
      walls : lvl.walls,
      direction : {x:0,y:0},

      update : function(){
        for(var i=0,l=that.walls.length;i<l;i++)
          that.draw(that.walls[i], "rgb(184, 184, 184)");

        for(var i=0,l=that.blocks.length;i<l;i++)
          that.draw(that.blocks[i], "rgb(181, 184, 255)");

        for(var i=0,l=that.goals.length;i<l;i++)
          that.draw(that.goals[i], "rgb(255, 235, 0)");

        that.draw(that.player, "rgb(130, 212, 130)");
      },

      draw : function(pos, color){
        var $row = $($(".row")[pos.y]), $cell = $($(".cell", $row)[pos.x]);              
        $cell.css("background-color",color);
      },

      checkVictory : function(){
        var allInside = true;

        for(var i=0,l=that.goals.length;i<l;i++){
          var inside = false;

          for(var j=0,e=that.blocks.length;j<e;j++){
            if(that.blocks[j].x==that.goals[i].x && that.blocks[j].y==that.goals[i].y)
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

      bindEvents : function(){
        function nextMoveEmpty(e, dir){
          var px = e.x+dir.x,
              py = e.y+dir.y;

          for(var i=0,l=that.walls.length;i<l;i++){
            if(px == that.walls[i].x && py == that.walls[i].y)
              return false
          }
          for(var i=0,l=that.goals.length;i<l;i++){
            if( px== that.goals[i].x && py == that.goals[i].y)
              return false                    
          }
          return true;
        }

        function nextMoveIsGoal(e, dir){
          var px = e.x+dir.x,
              py = e.y+dir.y;

          for(var i=0,l=that.goals.length;i<l;i++){
            if(px == that.goals[i].x && py == that.goals[i].y)
              return {x:px,y:py,i:i}                   
          }

          return false;
        }

        function nextMoveIsBlock(e, dir){
          var px = e.x+dir.x,
              py = e.y+dir.y;

          for(var i=0,l=that.blocks.length;i<l;i++){
            if(px == that.blocks[i].x && py == that.blocks[i].y)
              return {x:px,y:py,i:i}                   
          }
          return false;
        }

        $(document).on("keydown", function(e){
          if(e.keyCode >= 37 && e.keyCode <= 40){
            that.direction = {
              x : e.keyCode % 2 ? e.keyCode - 38 : 0,
              y : !(e.keyCode % 2) ? e.keyCode - 39 : 0
            }

            if(nextMoveEmpty(that.player, that.direction)){
              that.player.x += that.direction.x;
              that.player.y += that.direction.y;

              that.draw(that.player, "rgb(130, 212, 130)");
              that.draw({x:that.player.x-that.direction.x, y:that.player.y-that.direction.y}, "white");

            }else{
              var nint = nextMoveIsGoal(that.player, that.direction);
              if(nint){
                if(nextMoveEmpty(nint, that.direction)){
                  that.goals[nint.i].x = nint.x + that.direction.x;
                  that.goals[nint.i].y = nint.y + that.direction.y;
                  that.player.x += that.direction.x;
                  that.player.y += that.direction.y;
                  that.draw({x:that.player.x-that.direction.x, y:that.player.y-that.direction.y}, "white");

                  if(nextMoveIsBlock(nint, that.direction)){
                    that.checkVictory();
                  }
                }
              }
            }
            that.update();         
          }
        });
      }
    }

    var init = function(){
      for(var i=0;i<width;i++){
        $(".game").append("<div class='row'></div>");
        var $row = $($(".game .row")[$(".game .row").length-1]);

        for(var j=0;j<heigth;j++){
          $row.append("<div class='cell'></div>");
          if(i==0 || i==width-1 || j==0 || j==heigth-1)
            that.walls.push({x:i,y:j});
        }
      }

      that.update();
      that.bindEvents();
      return that;
    }
    return init();
  };

  var level1 = {
    player : {x:1,y:1},
    blocks : [{x:3,y:3},{x:3,y:4}],
    goals  : [{x:5,y:4},{x:5,y:5}],
    walls  : [{x:7,y:1},{x:7,y:2},{x:7,y:3},{x:6,y:3},{x:6,y:4},{x:2,y:6},{x:3,y:6},{x:5,y:2},{x:6,y:2}]
  }
  var game = new Sokoban(8,8,level1);
});