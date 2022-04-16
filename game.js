console.log('Flappy Bird');

const sprites = new Image();
sprites.src = './sprites.png';

const soundHIT = new Audio();
soundHIT.src= './soundEfects/hit.wav';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const globais = {};
let activeScreen = {};
let frames = 0;

const background = {
    spriteX : 390,
    spriteY : 0,
    width : 275,
    heigth : 204,
    x : 0,
    y : canvas.height - 215,
    draw() {
        context.fillStyle = '#70c5ce'
        context.fillRect(0, 0, canvas.width, canvas.height)

        context.drawImage(
            sprites, 
            background.spriteX, background.spriteY,
            background.width, background.heigth,
            background.x, background.y,
            background.width, background.heigth,
        );

        context.drawImage(
            sprites, 
            background.spriteX, background.spriteY,
            background.width, background.heigth,
            background.x + background.width, background.y,
            background.width, background.heigth,
        );
    }
};

const getReady = {
    spriteX : 134,
    spriteY : 0,
    width : 174,
    heigth : 152,
    x : canvas.width / 2 - 174 / 2,
    y : 58,
    draw() {

        context.drawImage(
            sprites, 
            getReady.spriteX, getReady.spriteY,
            getReady.width, getReady.heigth,
            getReady.x, getReady.y,
            getReady.width, getReady.heigth,
        );
    }
};

const screens = {
    start : {
        incialize() {
            globais.flappyBird = createFlappyBird();
            globais.floor = createFloor();
        },

        draw() {
            background.draw();

            globais.floor.draw();

            getReady.draw();

            globais.flappyBird.draw();
        },

        click(){
            changeScreen(screens.game)
        },

        update() {
            globais.floor.update();
        }
    },

    game : {
        draw(){
            background.draw();

            globais.floor.draw();
        
            globais.flappyBird.draw();
        },

        click(){
            globais.flappyBird.toUp();
        },

        update() {
            globais.flappyBird.update();
            globais.floor.update();
        }
    },
};

function createFloor(){
    const floor = {
        spriteX : 0,
        spriteY : 610,
        width : 224,
        heigth : 112,
        x : 0,
        y : canvas.height - 112,
    
        update(){
            const floorMoviment = 1;
            const reloadIn = floor.width / 2;
            const moviment = floor.x - floorMoviment

            floor.x = moviment % reloadIn;
        },
    
        draw() {
            context.drawImage(
                sprites, 
                floor.spriteX, floor.spriteY,
                floor.width, floor.heigth,
                floor.x, floor.y,
                floor.width, floor.heigth,
            );
    
            context.drawImage(
                sprites, 
                floor.spriteX, floor.spriteY,
                floor.width, floor.heigth,
                floor.x + floor.width, floor.y,
                floor.width, floor.heigth,
            );
        }
    };
    
    return floor
}

function touchInTheFloor() {
    const flappyBirdY = globais.flappyBird.y + globais.flappyBird.heigth;
    const floorY = globais.floor.y

    if(flappyBirdY >= floorY){
        return true;
    }else{
        return false;
    }
};

function createFlappyBird() {
    const flappyBird = {
        spriteX : 0,
        spriteY : 0,
        width : 33,
        heigth : 24,
        x : 10,
        y : 50,
        gravity : 0.20,
        velocity : 0,
        jump : 5,
        activeFrame: 0,
        moviments :[
            {spriteX: 0, spriteY: 0},
            {spriteX: 0, spriteY: 26},
            {spriteX: 0, spriteY: 52},
        ],
        
        updateFrame(){
            const framesInterval = 8;
            const exceededFramesInterval = frames % framesInterval === 0;

            if(exceededFramesInterval){
                const incrementBase = 1 ;
                const increment = incrementBase + flappyBird.activeFrame;
                const reloadIn = flappyBird.moviments.length;
                flappyBird.activeFrame = increment % reloadIn;
            } 
           
        },

        toUp(){
            flappyBird.velocity = - flappyBird.jump;
        },
    
        update() {
            if(touchInTheFloor(flappyBird, globais.floor)){
                soundHIT.play();

                setTimeout(() => {
                    changeScreen(screens.start)
                }, 350)
                
                return;
            }
    
            flappyBird.velocity = flappyBird.velocity + flappyBird.gravity;
            flappyBird.y = flappyBird.y + flappyBird.velocity;
        },
    
        draw() {
            flappyBird.updateFrame()
            const { spriteX, spriteY } = flappyBird.moviments[flappyBird.activeFrame];

            context.drawImage(
                sprites, 
                spriteX, spriteY,
                flappyBird.width, flappyBird.heigth,
                flappyBird.x, flappyBird.y,
                flappyBird.width, flappyBird.heigth,
            );
        }
    };

    return flappyBird;
};

function changeScreen(newScreen){
    activeScreen = newScreen

    if(activeScreen.incialize){
        activeScreen.incialize();
    }
};



function app(){

    activeScreen.draw();
    activeScreen.update();

    frames = frames + 1;
    requestAnimationFrame(app);
};

window.addEventListener('click', function() {
    if(activeScreen.click){
        activeScreen.click()
    }
});


changeScreen(screens.start);
app();
  