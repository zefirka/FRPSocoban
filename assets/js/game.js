$(document).ready(function(){
   var Socoban = function(width,heigth,lvl){
       var that = {
           player : lvl.player,
           blocks : lvl.blocks,
           goals : lvl.goals,
           walls : lvl.walls,

           drawAll : function(){
               for(var i=0,l=that.walls.length;i<l;i++){
                   that.draw(that.walls[i], "rgb(184, 184, 184)");
               }

               for(var i=0,l=that.blocks.length;i<l;i++){
                   that.draw(that.blocks[i], "rgb(181, 184, 255)");
               }

               for(var i=0,l=that.goals.length;i<l;i++){
                   that.draw(that.goals[i], "rgb(255, 235, 0)");
               }

               that.draw(that.player, "rgb(130, 212, 130)");

           },

           draw : function(pos, color){
               var row = $(".row")[pos.y],
                   cell = $(".cell", $(row))[pos.x];
               
               $(cell).css("background-color",color);
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
                       direction = {
                           x : e.keyCode % 2 ? e.keyCode - 38 : 0,
                           y : !(e.keyCode % 2) ? e.keyCode - 39 : 0
                       }
                      
                       if(nextMoveEmpty(that.player, direction)){
                           that.player.x += direction.x;
                           that.player.y += direction.y;

                           that.draw(that.player, "rgb(130, 212, 130)");
                           that.draw({x:that.player.x-direction.x, y:that.player.y-direction.y}, "white");

                       }else{
                           var nint = nextMoveIsGoal(that.player, direction);
                           if(nint){
                               if(nextMoveEmpty(nint, direction)){
                                   that.goals[nint.i].x = nint.x + direction.x;
                                   that.goals[nint.i].y = nint.y + direction.y;
                                   that.player.x += direction.x;
                                   that.player.y += direction.y;
                                   that.draw({x:that.player.x-direction.x, y:that.player.y-direction.y}, "white");
       
                                   if(nextMoveIsBlock(nint, direction)){
                                       that.checkVictory();
                                   }
                               }
                           }
                       }
                       that.drawAll();         
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
                   if(i==0 || i==width-1 || j==0 || j==heigth-1){
                       that.walls.push({x:i,y:j});
                   }
               }
           }
           
           that.drawAll();
           that.bindEvents();
           return that;
       }
       return init();
   };

   var direction = {x:0,y:0};

   var level1 = {
       player : {x:1,y:1},
       blocks : [{x:3,y:3},{x:3,y:4}],
       goals  : [{x:5,y:4},{x:5,y:5}],
       walls  : [{x:7,y:1},{x:7,y:2},{x:7,y:3},{x:6,y:3},{x:6,y:4}]
   }

   var game = new Socoban(8,8,level1);
});


