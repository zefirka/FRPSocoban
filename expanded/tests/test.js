var level = {
  width: 8,
  height: 8,
  player : {x:1,y:1},
  blocks : [{x:3,y:3},{x:3,y:4}],
  goals  : [{x:5,y:4},{x:5,y:5}],
  walls  : [{x:7,y:1},{x:7,y:2},{x:7,y:3},{x:6,y:3},{x:6,y:4},{x:2,y:6},{x:3,y:6},{x:5,y:2},{x:6,y:2}],
  mines : [{x:2,y:4}]
}


var testLevel1 = {
  width: 4, height: 4,  player : {}, walls : [], mines : [],
  blocks : [{x:1, y:1}], goals : [{x:2,y:1}]  
}

var testLevel2 = {
  width: 4, height: 4,  player : {}, walls : [], mines : [],
  blocks : [{x:1, y:1}], goals : [{x:1,y:1}]  
}

var testLevel3 = {
  width: 4, height: 4,  player : {}, walls : [], mines : [],
  blocks : [{x:1, y:1}, {x:1,y:2}], goals : [{x:2,y:1}, {x:1,y:2}]  
}

var game = new Sokoban(level);
var t2 = new Sokoban(testLevel2); 
var t1 = new Sokoban(testLevel1);
var t3 = new Sokoban(testLevel3);

module("Application ready");
test('Sokoban loaded', function () {
  ok(typeof Sokoban == 'function', 'Sokoban is ready');  
  ok(game, "Sokoban is loaded" );  
  ok(game.functions, "Sokoban functions is ready");
});



module("Functions");
test("isArrows function", function(){
  ok(!game.functions.isArrows({keyCode:36}), "Correctly for keycode less than 37");
  ok(game.functions.isArrows({keyCode:37}), "Correctly for keycode 37");
  ok(!game.functions.isArrows({keyCode:-13}),"Correctly for keycode less than 0");
  ok(!game.functions.isArrows(undefined), "Correctly for undefined value");
  ok(!game.functions.isArrows({keyCode:undefined}), "Correctly for undefined property");
  ok(!game.functions.isArrows({keyCode:41}), "Correctly for keycode more than 40");
  //я писал тесты но они провалились, поэтому я улучшил свою функцию
})

test("findDirection function", function(){
  deepEqual(game.functions.findDirection({keyCode:37}), {x:-1,y:0}, "Left");
  deepEqual(game.functions.findDirection({keyCode:38}), {x:0,y:-1}, "Down");
  deepEqual(game.functions.findDirection({keyCode:39}), {x:1,y:0}, "Right");
  deepEqual(game.functions.findDirection({keyCode:40}), {x:0,y:1}, "Up");
  notDeepEqual(game.functions.findDirection({keyCode:20}), {x:0,y:0}, "Any given");
})

test("move function", function(){
  deepEqual(game.functions.move({x:0,y:0}), {x:0,y:0, i:undefined}, "Correctly");
});

test("allInside function", function(){
  ok(!t1.functions.allInside(t1.functions.getLevel()), "Test 1");
  ok(t2.functions.allInside(t2.functions.getLevel()), "Test 2");
  ok(!t3.functions.allInside(t3.functions.getLevel()), "Test 3");

});

test("isEmpty function", function(){
  ok(!game.functions.isEmpty({x:0,y:0}), "Correctly for walls");
  ok(game.functions.isEmpty({x:1,y:1}), "Correctly for player"); 
  ok(!game.functions.isEmpty({x:3,y:3}), "Correctly for blocks");
  ok(game.functions.isEmpty({x:5,y:4}), "Correctly for goals");
})

//как видите, здесь уже это не работает.
test("isBlock function", function(){
  ok(!game.functions.isBlock({x:0,y:0}), "Correctly for walls");
  ok(!game.functions.isBlock({x:1,y:1}), "Correctly for player"); 
  ok(game.functions.isBlock({x:3,y:3}), "Correctly for blocks");
  ok(!game.functions.isBlock({x:5,y:4}), "Correctly for goals");
})