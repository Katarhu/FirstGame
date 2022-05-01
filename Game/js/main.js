class createGame{
    constructor(mode){
        //Game mode, recieve from start() - no time limit = 0 / startTimeTrial() - time limit = 1
        this.mode = mode;
        //Future coordinates of all objects on map
        this.allObjectsPossitions = [];
        //Button to add impostors (Test)
        // this.addImpostor = document.querySelector('.addimpostor');
        //Input of game Rows/Colums
        this.input = document.querySelector('.input');
        
        this.impostorImages = [
            './img/impostors/impostor1.png',
            './img/impostors/impostor2.png',
            './img/impostors/impostor3.png',
            './img/impostors/impostor4.png',
            './img/impostors/impostor5.png',   
        ]
        //Game container 500 x 500 px (can be changed but width = height)
        this.container = document.querySelector('.container');
        //Input value from first screen, default is on HTML file
        this.gameRows = this.input.value;
        //Main object
        this.snake = document.querySelector('.snake');
        //Main object img element
        this.snakeImg = document.querySelector('.snake-img');
        //Width of game
        this.gameWidth = document.querySelector('.container').clientWidth;
        //Score
        this.scorevalue = 0;
        this.score = document.querySelector('.score'); 
        //Modal window of end game
        this.modal = document.querySelector('.modal');
        //Modal text of event (dead/time stop)
        this.modalHeader = document.querySelector('.modalTextHead');
        //Modal window score text
        this.modalText = document.querySelector('.modalText');
        //Error img (for change hole)
        this.errorImg = document.querySelector('.error');
        //Timer element
        this.timerElement = document.querySelector('.timer');
        //binded functions, without them removeEventListeners doesn't work
        this.bindedKeyPress = this.keyPress.bind(this);
        this.bindedKeyPressRestart = this.keyPressRestart.bind(this);
        //Change intervals for first create holes or interval of its changing
        this.newHoleCreateInterval = 1000;
        this.holeChangeIntervalTime = 8500;

        //Modal window button
        this.modalButton = document.querySelector('.buttonDeadConfirm').addEventListener('click', this.restartGame.bind(this));
        //this.changeMapButton.addEventListener('click', this.changeMap.bind(this));
        this.rotation = 0;
        this.playerRotation = 0;
    }
    //add and remove listener for move in game(It could be 2 lines, but who cares)
    addEventListeners(){
        document.addEventListener('keydown', this.bindedKeyPress, false);  
    }
    removeEventListeners(){ 
        document.removeEventListener('keydown', this.bindedKeyPress, false);
    }
    //Interval for holes changing its coordinates
    setHoleInterval(holesAmount){
        this.holesAmount = holesAmount;
        var count = 0;
        this.HoleInterval = setInterval(() => {
            this.createHole();
            count++;
            if(count >= this.holesAmount - 1) {
                clearInterval(this.HoleInterval);     
                this.holeChangeInterval = setInterval(this.changeHolePositions, this.holeChangeIntervalTime);
            };
        }, this.newHoleCreateInterval);

    }
    //Must have function for game to work))))
    setGameRows(){
        this.gameRows = this.input.value;
        this.changeObjectsCoordinates();
    }
    //Creating map, size is input.value x input.value, setting main object w + h as step = width/rows(columns)
    //It's creating rows * rows squares;
    createMap(grid){
        this.calculateStep();

        this.snake.style.width = this.step + 'px';
        this.snake.style.height = this.step + 'px';

        for(var i = 0; i < this.gameRows*this.gameRows; i++){
            var newBlock = document.createElement("div");
            newBlock.classList.add('rc');
            this.container.appendChild(newBlock);
        }
        grid = this.createGrid(this.gameRows);
        this.container.style.grid = grid;
    }
    //Function to calculate step if game changes
    calculateStep(){
        this.step = (this.gameWidth / this.gameRows);
        var step = this.step.toFixed(3);

        this.step = parseFloat(step);
    }
    //Function for deleting map(all squares)
    deleteMap(){
        this.gameCells = document.querySelectorAll('.rc');
        for(var i = 0; i < this.gameCells.length; i++){
            this.gameCells[i].parentNode.removeChild(this.gameCells[i]);
        }
    }
    //Function for creating grid property to styles
    createGrid(Rows){
        var grid = '';
        grid = `repeat(${Rows}, 1fr) / repeat(${Rows}, 1fr)`;
        return grid;
    }
    //Feature that can be attached to the button (unused)
    changeMap(){
        if(this.input.value < 3 || this.input.value > 20){
            
        } else { 
            this.gameRows = this.input.value;
        }
        clearInterval(this.holeChangeInterval);
        this.calculateStep();
        this.deleteMap();
        this.createMap();
        this.restartGame();
    }
    //Function to eval possible objects possitions from 0 to game.width with step
    changeObjectsCoordinates(){
        this.calculateStep();
        this.x = [0];
        for(var i = 1; i < this.gameRows; i++){
            this.x[i] = parseFloat((this.step + this.step * (i-1)).toFixed(3));
        }
    }
    //Function for event listener to start game with enter or space key
    keyPressRestart(e){
        if(e.keyCode == 13 || e.keyCode == 32){
            this.restartGame();
        }
    }
    //Move function
    keyPress(e){
        if(e.keyCode == 83 || e.keyCode == 40) {
            this.Move('Down');
        } else if(e.keyCode == 87 || e.keyCode == 38) {
            this.Move('Up');
        } else if(e.keyCode == 68 || e.keyCode == 39){
            this.Move('Right');
        } else if(e.keyCode == 65 || e.keyCode == 37){
            this.Move('Left');
        }
    }
    //Function that receives side to move from addEventListener (ArrowKeys)
    Move(Direction){
       switch(Direction){
            case 'Left':
             this.snakeImg.style.transform = 'scaleX(-1)';
             var goleft = parseFloat(this.snake.style.left) - this.step;
             if(parseFloat(this.snake.style.left)- this.step >= -5){
                this.snake.style.left = goleft + 'px';
             } else {
                //this.snake.style.left = this.gameWidth - this.step + 'px';
             }
             break;
                
            case 'Right':
             this.snakeImg.style.transform = 'scaleX(1)';
             var goright = parseFloat(this.snake.style.left) + this.step;   
             if(parseFloat(this.snake.style.left) + this.step < this.gameWidth-5){   
                  this.snake.style.left = goright + 'px';
             } else {
                 //this.snake.style.left = 0 + 'px';
             }
             break;
        
           case 'Up':
            this.playerRotation == 1 ? this.snakeImg.style.transform = 'rotate(-90deg)' : 0;
            var gotop = parseFloat(this.snake.style.top) - this.step;
            if(parseFloat(this.snake.style.top) - this.step >= -5){
                 this.snake.style.top = gotop + 'px';
            } else {
                //this.snake.style.top = this.gameWidth - this.step + 'px';
            }
            break;

           case 'Down':
            this.playerRotation == 1 ?  this.snakeImg.style.transform = 'rotate(90deg)' : 0;
            var gobot = parseFloat(this.snake.style.top) + this.step; 
            if(parseFloat(this.snake.style.top) + this.step < this.gameWidth-5){
                this.snake.style.top = gobot + 'px';
            } else {
                //this.snake.style.top = 0 + 'px';
            }
            break;
       }
       //All elements that are food or holes
        this.impostor = document.querySelectorAll('.notsnake');
        this.hole = document.querySelectorAll('.hole');
       //If main creature position is the same of food/hole function adds +1 to score/null score
       for(var i = 0; i < this.impostor.length; i++){
            if(this.snake.style.left === this.impostor[i].style.left && this.snake.style.top === this.impostor[i].style.top){
                this.impostorEaten(i);
            }
       }
       //If main creature position is the same you are dead
       for(var i = 0; i < this.hole.length; i++){
            if(this.snake.style.left === this.hole[i].style.left && this.snake.style.top === this.hole[i].style.top){
                this.modalHeader.innerHTML = 'You are dead.';
                this.endOfGame();
            }
        }
    }
    impostorEaten(i){
        this.impostor[i].parentNode.removeChild(this.impostor[i]);
        this.createImpostor();
        this.scorevalue++;
        this.score.innerHTML = `${this.scorevalue}`;
    }
    endOfGame(){
        this.modalText.innerHTML = `Your score: ${this.scorevalue}`;
        this.modal.style.transform = 'scaleY(100%)';
        this.seconds = this.timeLimit;
        clearInterval(this.HoleInterval);
        this.removeEventListeners();  
        document.addEventListener('keydown', this.bindedKeyPressRestart, false);
        clearInterval(this.holeChangeInterval);
        clearInterval(this.timerInterval);
    }
    //Creating food, getting all creatures on map then gets its positions, if position 
    //is same of existing ones, loop continues to random coordinates
    createImpostor(){
        
        var degrees = [0,90,180,270]
        var newImpostor = document.createElement("div");
        var newImg = document.createElement("img");

        newImg.classList.add('object-img', 'impostor-img');
        newImg.src = this.impostorImages[parseInt(Math.random()*10 % this.impostorImages.length)];
        
        newImpostor.classList.add('notsnake','gameobject','impostor');
        newImpostor.appendChild(newImg);
 
        var newArray = this.setObjectPosition();
        newImpostor.style.left = newArray[0] + 'px';
        newImpostor.style.top = newArray[1] + 'px';
        newImpostor.style.width = this.step + 'px';
        newImpostor.style.height = this.step + 'px';
        
        this.rotation == 1 ? newImpostor.style.transform = `rotate(${degrees[parseInt(Math.random() * 10 % degrees.length)]}deg)` : 0;
         
        this.container.appendChild(newImpostor);
    }

    //Same as createImpostor, but with holes
    createHole(){
        var newHole = document.createElement("div");
        var newImg = document.createElement("img");
        
        newImg.classList.add('object-img');
        newImg.src = './img/hole.png';
        newImg.style.width = `${this.step}px`;
        newImg.style.height = `${this.step}px`;
        
        newHole.classList.add('hole','gameobject');
        newHole.appendChild(newImg);
        
        var newArray = this.setObjectPosition();
        
        newHole.style.left = newArray[0] + 'px';
        newHole.style.top = newArray[1] + 'px';
        newHole.style.width = this.step + 'px';
        newHole.style.height = this.step + 'px';

        this.container.appendChild(newHole);
    }

    setObjectPosition(){
        this.allObjects = document.querySelectorAll('.gameobject');
        var newArray = [];
        for(var i = 0; i < this.allObjects.length; i++){
            this.allObjectsPossitions[i] = [parseFloat(this.allObjects[i].style.left), parseFloat(this.allObjects[i].style.top)];
        }
        do{
            newArray = [this.x[parseInt(Math.random()*this.x.length % this.gameRows)], 
                        this.x[parseInt(Math.random()*this.x.length % this.gameRows)]];
        } while(this.allObjectsPossitions.some((item) => item[0] === newArray[0] && item[1] === newArray[1]));
        return newArray;
    }
    changeHolePositions(){      
        Game.errorImg.style.display = 'block';
        setTimeout(()=>{  
            if(Game.scorevalue == 0){
                Game.errorImg.style.display = 'none';
            } else {
                this.allHoles = document.querySelectorAll('.hole');
                this.allHoles.forEach(hole => hole.parentNode.removeChild(hole));
                for(var i = 0; i < Game.holesAmount; i++){
                    Game.createHole();
                }
                Game.errorImg.style.display = 'none';
            }
        }, 1000);
        
    }
    //Restart game is deleting all objects, reset main character position, clear all listeners and intervals
    restartGame(){  
        document.removeEventListener('keydown', this.bindedKeyPressRestart, false);
        document.activeElement.blur();
        this.allObjects = document.querySelectorAll('.gameobject');
        for(var i = 1; i < this.allObjects.length; i++){
            this.allObjects[i].parentNode.removeChild(this.allObjects[i]);
        }
        this.snake.style.left = `0px`;
        this.snake.style.top = `0px`;
        this.modal.style.transform = 'scaleY(0)';
        this.scorevalue = 0;
        this.score.innerHTML = `${this.scorevalue}`;
        clearInterval(this.HoleInterval);
        this.deleteMap();
        //this.changeObjectsCoordinates();
        Game.mode == 0 ? start() : startTimeTrial(this.timeLimit);
    }
    startTimer(timeLimit){
        this.timeLimit = this.timeLimit ?? timeLimit;
        this.seconds = this.timeLimit
        this.timerInterval = setInterval(()=>{
            this.seconds--;
            if(this.seconds <= 0){ 
                clearInterval(this.timerInterval); 
                this.modalHeader.innerHTML = 'Time is up';
                this.timerElement.classList.remove('bloom');
                this.endOfGame();
            } else if(this.seconds <= 10){
                this.timerElement.classList.add('bloom');
            }
            this.timerElement.innerHTML = `${this.seconds > 9 ? this.seconds : '0' + this.seconds}`;
        },1000)   
    }
}

const Game = new createGame;
function start(){
    Game.mode = 0;
    Game.setGameRows();
    Game.createMap();
    Game.setHoleInterval(Game.gameRows);
    Game.addEventListeners();
    //Game.startTimer();
    for(var i = 0; i < Game.gameRows - 2; i++){
        Game.createImpostor();
    }
    Game.createHole();
}
function startTimeTrial(timeLimit){
    Game.mode = 1;
    Game.setGameRows();
    Game.createMap();
    Game.startTimer(timeLimit);
    document.querySelector('.timer').innerHTML = `${timeLimit > 9 ? timeLimit : '0' + timeLimit}`;
    Game.setHoleInterval(Game.gameRows);
    Game.addEventListeners();
    //Game.startTimer();
    for(var i = 0; i < Game.gameRows - 2; i++){
        Game.createImpostor();
    }
    Game.createHole();
}

//Element at start
const blindElement = document.querySelector('.hidecontent');
const greetingsBlock = document.querySelector('.greetings');
const greetingsButton = document.querySelector('.greetings__button');
const greetingsTimeBlock = document.querySelector('.greetings__timetrial');
//const timeTrialButton = document.querySelector('.greetings__button-timetrial');
//document.addEventListener('keydown', listenerGameStart);
greetingsButton.addEventListener('click', listenerGameStart);
greetingsTimeBlock.addEventListener('click', timeTrialStart);
//Add event listenest to click start or keydown start and remove it
function listenerGameStart(event){
    greetingsButton.removeEventListener('click', listenerGameStart)
    audioElement.play();
    blindElement.style.transform = 'scaleX(0)';
    greetingsBlock.style.transform = 'scaleY(0)';
    start();
}
function timeTrialStart(){
    if(event.target.closest('.greetings__button-timetrial')){
        document.removeEventListener('keydown', listenerGameStart);
        //timeTrialButton.removeEventListener('click', timeTrialStart);
        audioElement.play();
        blindElement.style.transform = 'scaleX(0)';
        greetingsBlock.style.transform = 'scaleY(0)';
        startTimeTrial(event.target.closest('.greetings__button-timetrial').value);
    }
}



//Handling game start and audio play 
const audioElement = document.querySelector('audio');
const rangeElement = document.querySelector('.input-range');
audioElement.volume = rangeElement.value;
audioElement.autoplay = true;
//Every half of seconds handle volume change
setInterval(()=>{
    audioElement.volume = rangeElement.value;
},500);

//Change background photos
document.addEventListener('click', (event) => {
    const body = document.querySelector('body');
    var impostors = document.querySelectorAll('.impostor-img');
    var imgSrc;

    let skinsObject = new Object();
    skinsObject = {
        clearRotation(){
            document.querySelectorAll('.impostor').forEach(element => element.style.transform = 'rotate(0)');
            Game.rotation = 0;
            Game.playerRotation = 0;
        },
        changeEnemySkins(){
            for(var i = 0; i < impostors.length; i++){
                impostors[i].src = Game.impostorImages[parseInt(Math.random()*10 % Game.impostorImages.length)];
            }
        },
        'colection-img': 
        function() {
            imgSrc = event.srcElement.attributes.src.nodeValue,
            body.style.background = `url("${imgSrc}")`
        },
        'skins-img__main':
        function() {
            imgSrc = event.srcElement.attributes.src.nodeValue;
            document.querySelector('.snake-img').src = imgSrc;
            skinsObject[event.srcElement.attributes.value.textContent]();
        },
        // 'skins-img__imp':
        // function() {
        //     imgSrc = event.srcElement.attributes.src.nodeValue;
        //     impostors.forEach(element => element.src = imgSrc)
        //     Game.impostorImages = [imgSrc];
        //     Game.rotation = 1;
        // },
        // 'skins-img__allgif':
        // function() {
        //     document.querySelectorAll('.impostor').forEach(element => element.style.transform = 'rotate(0)');
        //     Game.rotation = 0;
        //     Game.impostorImages = [
        //         './img/impostor1.png',
        //         './img/impostor2.png',
        //         './img/impostor3.png',
        //         './img/impostor4.png',
        //         './img/impostor5.png',   
        //     ];
        //     for(var i = 0; i < impostors.length; i++){
        //         impostors[i].src = Game.impostorImages[parseInt(Math.random()*10 % Game.impostorImages.length)];
        //     }
        // },
        'impostors':
        function(){
            this.clearRotation();
            Game.impostorImages = [
                './img/impostors/impostor1.png',
                './img/impostors/impostor2.png',
                './img/impostors/impostor3.png',
                './img/impostors/impostor4.png',
                './img/impostors/impostor5.png',   
            ];
            this.changeEnemySkins();
        },
        'ghost':
        function() {
            this.clearRotation();
            Game.playerRotation = 1;
            Game.impostorImages = [
                './img/pacman/blueviolet.png',
                './img/pacman/pink.png',
                './img/pacman/red.png',
                './img/pacman/yellow.png',
                './img/pacman/strawberry.png',   
            ];
            this.changeEnemySkins();
        },
        'catpaws':
        function() {
            this.clearRotation();
            Game.impostorImages = [
                "./img/nyancat/paw1.png",
                "./img/nyancat/paw2.png",
                "./img/nyancat/paw3.png",
                "./img/nyancat/paw4.png"
            ];  
            this.changeEnemySkins();
        },
        'candies':
        function(){
            this.clearRotation();
            Game.impostorImages = [
                "./img/candyman/candy1.png",
                "./img/candyman/candy2.png",
                "./img/candyman/candy3.png",
                "./img/candyman/candy4.png"
            ];  
            this.changeEnemySkins();
        },
        'mario':
        function(){
            this.clearRotation();
            Game.impostorImages = [
                "./img/mario/flower.png",
                "./img/mario/goomba.png",
                "./img/mario/mushroom.png",
                "./img/mario/star.png"
            ];  
            this.changeEnemySkins();
        },
        'hotline':
        function(){
            this.clearRotation();
            Game.rotation = 1;
            Game.playerRotation = 1;
            imgSrc = event.srcElement.attributes.src.nodeValue;
            impostors.forEach(element => element.src = "./img/hotline/enemy.webp")
            Game.impostorImages = ["./img/hotline/enemy.webp"];     
        }
    }

    try{
        skinsObject[event.target.classList[0]]();
    }
    catch(error){
        return 0;
    }
    
});