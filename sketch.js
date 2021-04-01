var dog,sadDog,happyDog,bgImage,database;
var feed,add,foodobj,fedTime,lastFed;

function preload(){
  sadDog = loadImage("Dog.png");
  happyDog = loadImage("happy dog.png");
  bgImage = loadImage("ground.png");
}

function setup() {
  createCanvas(1000,400);

  database = firebase.database();
  
  dog = createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale = 0.15;

  foodobj = new Food();
  foodStock = database.ref('food');
  foodStock.on("value",function(data){foodS = data.val();
    foodobj.updateFoodStock(foodS);});

  var feed = createButton("Feed the dog");
  feed.position(450,100);
  feed.mousePressed(dogAte);
  var add = createButton("Add food");
  add.position(550,100);
  add.mousePressed(foodBought);
  var instruction = createElement('h2');
  instruction.html("Your pet name");
  instruction.position(900,100);
  var dogname = createInput();
  dogname.position(900,150);

}

function draw() {
 // background(46,139,87);
  background(bgImage);

  foodobj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){lastFed = data.val()});

  fill("black");
  textSize(25);
  if(lastFed>=12){
    text("Last fed : "+lastFed%12 + " PM",250,70);
  }else if(lastFed===0){
    text("Last fed : 12 AM",250,70);
  }else{
    text("Last fed : "+lastFed+" AM",250,70);
  }

  drawSprites();
}

//function to read food Stock


//function to update food stock and last fed time
function dogAte(){
  dog.addImage(happyDog);

  if (foodobj.getFoodStock()<=0){
    foodobj.updateFoodStock(foodobj.getFoodStock()*0);
  }
  else{
    foodobj.updateFoodStock(foodobj.getFoodStock()-1);
  }

  database.ref('/').update({
    food:foodobj.getFoodStock(),
    FeedTime : hour()});
}

//function to add food in stock
function foodBought(){
  dog.addImage(sadDog);
  //foodS.updateFoodStock();
  foodS++;
  database.ref('/').update({
    food:foodS   
  })
}