$(document).ready(function(){
   var Socoban = function(width, heigth,lvl){ 
       this.player  = lvl.player;
       this.goals   = lvl.goals;
       this.blocks  = lvl.blocks;
       this.walls   = lvl.walls;
       this.direction = {x:0,y:0};
      
       for(var i=0;i<width;i++){
           $(".game").append("<div class='row'></div>");
           var $row = $($(".game .row")[$(".game .row").length-1]);

           for(var j=0;j<heigth;j++){
               $row.append("<div class='cell'></div>");
               if(i==0 || i==width-1 || j==0 || j==heigth-1){
                   this.walls.push({x:i,y:j});
               }
           }
       }

      var dir =  $(document).asEventStream("keydown").filter(isArrows).map(selectDirection);
      var updateDirection = dir.onValue(function(x){
          game.direction.x = x.x;
          game.direction.y = x.y;
          update(game);
      });

      var playerMove = $(document).asEventStream("keydown").map(player);

      var playerNextEmpty =  playerMove.map(nextCell).filter(isEmpty).onValue(function(nov){
          draw(game.player, "white");
          game.player.x = nov.x;
          game.player.y = nov.y;
          update(game);
      });

      var goalMove = playerMove.map(nextCell).map(isGoal).filter(function(x){return x});

      var goalNextEmpty = goalMove.map(nextCell).filter(isEmpty).onValue(function(cell){
          draw(game.player, "white");
          game.player.x = cell.x-game.direction.x;
          game.player.y = cell.y-game.direction.y;
          game.goals[cell.i].x = cell.x;
          game.goals[cell.i].y = cell.y;    
          update(game);
          checkVictory();
      });
   }

   function checkVictory(){     
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
   }

   function isArrows(e){return e.keyCode >= 37 && e.keyCode <= 40;}
   function selectDirection(e){return { x : e.keyCode % 2 ? e.keyCode - 38 : 0, y : !(e.keyCode % 2) ? e.keyCode - 39 : 0 }}
   function nextCell(cell){return {x:cell.x+game.direction.x, y:cell.y+game.direction.y, i:cell.i}}
   function player(event){return game.player}
   function draw(pos, color){
       var $row = $($(".row")[pos.y]), $cell = $($(".cell", $row)[pos.x])
       $cell.css("background-color",color);
   }

   function isEmpty(e){
       var px = e.x,
           py = e.y;

       for(var i=0,l=game.walls.length;i<l;i++){
           if(px == game.walls[i].x && py == game.walls[i].y)
               return false
       }
       for(var i=0,l=game.goals.length;i<l;i++){
           if( px== game.goals[i].x && py == game.goals[i].y)
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

   function update(game){
       for(var i=0,l=game.walls.length;i<l;i++)
           draw(game.walls[i], "rgb(184, 184, 184)");
       
       for(var i=0,l=game.blocks.length;i<l;i++)
           draw(game.blocks[i], "rgb(181, 184, 255)");

       for(var i=0,l=game.goals.length;i<l;i++)
           draw(game.goals[i], "rgb(255, 235, 0)");

       draw(game.player, "rgb(130, 212, 130)");
   }

   var level1 = {
       player : {x:1,y:1},
       blocks : [{x:3,y:3},{x:3,y:4}],
       goals  : [{x:5,y:4},{x:5,y:5}],
       walls  : [{x:7,y:1},{x:7,y:2},{x:7,y:3},{x:6,y:3},{x:6,y:4}]
   }

   var game = new Socoban(8,8,level1);   
   update(game);

});


