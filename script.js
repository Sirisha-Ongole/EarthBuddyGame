window.addEventListener('load', function() {
const canvas = document.getElementById('myCanvas');
const playButton = document.getElementById('playButton'); 
const earthwarm = document.getElementById('opponent1'); 
const cxt = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 500;


cxt.drawImage(playButton, 0, 0, 500, 500);
cxt.font = "bold 15px Halvetica";
cxt.textAlign = "center";
cxt.fillStyle = 'blue';
cxt.fillText('SEED POWER!', 750, 90);
cxt.fillText('LIFE OF THE LAND!', 750, 150);
cxt.fillText('BECOME AN EARTH BUDDY!', 750, 220);
cxt.fillText('READY TO GROW?', 750, 290);

cxt.font = "14px Halvetica";
cxt.textAlign = "center";
cxt.fillStyle = 'blue';
cxt.fillText('Press SPACE BAR to plant seeds and make Earthworms happy!', 750, 110);
cxt.fillText('Use the ARROWS to collect SAVESOIL and boost your life!', 750, 170);
cxt.fillText('Make more earthworms happy and be an EarthBuddy.', 750, 240);
cxt.fillText(' Press ENTER to start the game!', 750, 310);
var restartButton = document.getElementById("restartButton");
restartButton.style.display = 'none';                
restartButton.style.margin = 'auto';
restartButton.style.marginTop = '50px';
restartButton.style.width = '120px';    
restartButton.style.height = '30px';
restartButton.style.backgroundColor = 'Blue';
restartButton.style.color = 'white';
restartButton.style.border = 'none';
restartButton.style.borderRadius = '5px';
restartButton.style.cursor = 'pointer';
restartButton.style.fontSize = '15px';
restartButton.style.fontWeight = 'bold';   
restartButton.addEventListener('click', function() {
    window.location.reload(true);

});  

cxt.drawImage(earthwarm, 730, 330, 70, 60);

window.addEventListener('keydown', (event) => {
    if(event.key === 'Enter') {
        playButton.style.display = 'none';
        canvas.style.display = 'block';
        animate(0);
    }
});

/* Encapsulation : It is the budiling of data the methods that act on the data in objects. 
Access to that data can be restricted from outside the bundle. */

class InputHandler{

    constructor(game){
        this.game = game;
        window.addEventListener('keydown', (event) => { 
            //Special feature of arrow function is that this keyword inside arrow function always represents the object in which the arrow function is defined.
                if(((event.key === 'ArrowUp')|| (event.key === "ArrowDown")) 
                && this.game.keys.indexOf(event.key) === -1){
                        this.game.keys.push(event.key);
                }else if(event.key === ' '){                  
                    this.game.player.shootTop();
                }else if(event.key === 'd'){
                    this.game.debug = !this.game.debug;
                }
        });
        window.addEventListener('keyup', (event) => {
            if(this.game.keys.indexOf(event.key) > -1){
                this.game.keys.splice(this.game.keys.indexOf(event.key), 1);
            }
            
        });
    }
}
class Seeds{
    constructor(game, x, y){
        this.game = game;
        this.x= x;
        this.y=y;
        this.width = 20;
        this.height = 20;
        this.speed = 3;
        this.markedForDeletion = false;
        this.image = document.getElementById('seed');
    }
    update(){
        this.x += this.speed;
        if(this.x > this.game.width * 0.8) this.markedForDeletion = true;
    }   
    draw(context){
        context.fillStyle = 'green';
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        //context.fillRect(this.x, this.y, this.width, this.height);
    }
}
class Particle {

}
class Player {
    /* Constructor is a special method on the Javascript class. 
        when I call this Javascript class later using the new Keyword, 
        constructor will create one new Blank Javascript object 
        and assign it properties and values based on the blueprint inside.*/

        /* Objects in Javascript are so called refeance data types, 
         which means that unlike prmitive data types they are dynamic in nature */
    constructor(game){
        this.game = game;
        this.width = 120;
        this.height = 190;
        this.x = 0;
        this.y = 200;
        this.speedY = 0;
        this.maxspeed = 5;
        this.seeds = [];
        this.image = document.getElementById('player1');
        this.powerUp = false;
        this.powerUpTimer = 0;
        this.powerLimit = 5000;
    }
    update(deltaTime){
        if(this.game.keys.includes('ArrowUp')) this.speedY = -this.maxspeed;
        else if(this.game.keys.includes('ArrowDown')) this.speedY = this.maxspeed;
        else this.speedY =0;
            this.y += this.speedY;

            if(this.y > this.game.height - this.height) this.y = this.game.height - this.height;
            else if(this.y < -this.height) this.y = this.game.height + this.height;
            //handling the seeds
            this.seeds.forEach(seeds => {
                seeds.update();
            });
            this.seeds = this.seeds.filter(seeds => !seeds.markedForDeletion);
            //power up
            if(this.powerUp){
                if(this.powerUpTimer > this.powerLimit){
                    this.powerUp = false;
                    this.powerUpTimer = 0;
            }else{
                this.powerUpTimer += deltaTime;
                this.game.amount += 0.1;
            }
        }
    }
    draw(context){
        // context.fillStyle = 'black';
        this.seeds.forEach(seeds => {
            seeds.draw(context);
        })
        if(game.debug)context.strokeRect(this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x, this.y, this.width, this.height); 

    }
    shootTop(){
        if(this.game.amount > 0){
            this.game.sound.shout();
            this.seeds.push(new Seeds(this.game, this.x + this.width, this.y + this.height/2));
            this.game.amount--;
        }
        if(this.powerUp) this.shootBottom();
    }
    shootBottom(){
        this.game.sound.shout();  
        if(this.game.amount > 0){
            this.seeds.push(new Seeds(this.game, this.x + this.width, this.y + this.height/2 + 20));
        }
    }
    enterPowerUp(){
        this.powerUpTimer = 0;
        this.powerUp = true;
        this.game.amount = this.game.maxAmount;
        this.game.sound.powerUp();
    }
}
class Opponent{
    constructor(game){
        this.game = game;   
        this.x = this.game.width;
        this.speedX = Math.random() * -0.5 - 0.9;
        this.markedForDeletion = false;
        this.lives = 5;
        this.scroe = this.lives;

    }
    update(){
        this.x +=this.speedX;
        if(this.x + this.width < 0) this.markedForDeletion = true;
    }
    draw(context){
        // context.fillStyle = 'blue';
        if(this.debug) context.strokeRect(this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        if(this.image2)context.drawImage(this.image2, this.x, this.y, this.width, this.height); 
        context.fillStyle = 'black';
        context.font = "10px Eater";
        context.fillText(this.lives, this.x, this.y);
    }

}
class LuckyEarthWarm extends Opponent{

    constructor(game){
        super(game);
        this.width = 50;
        this.height = 50;
        this.y = Math.random() * this.game.height * 0.7 - this.height;
        this.speedX = Math.random() * -0.5 - 2;
        this.image = document.getElementById('opponent3');
        this.lives = 2;
        this.scroe = 1;
        this.type = 'lucky';
    
    }
}
class EarthWarm extends Opponent{
    constructor(game){
        super(game);
        this.width = 70;
        this.height = 70;
        this.y = this.game.height * 0.7 - this.height;
        this.image = document.getElementById('opponent1');
        this.lives = 5;
        this.scroe = 3;
    }
}

class Layer{

    constructor(game, image, speedModifier){
        this.game = game;
        this.image = image;
        this.speedModifier = speedModifier;
        this.width = 1768;
        this.height = 500;
        this.x = 0;
        this.y = 0;
    }

    update(){
        if(this.x < -this.width + this.game.width) this.x = 0;
        this.x -= this.game.speed * this.speedModifier;
    }
    draw(context){
        context.drawImage(this.image, this.x, this.y, this.width, this.height); 
        context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }

}
class Background{
    constructor(game){
        this.game = game;
        // this.image1 = document.getElementById('layer1');
        this.image2 = document.getElementById('layer2');
        // this.layer1 = new Layer(this.game, this.image1, 1);
        this.layer2 = new Layer(this.game, this.image2, 1.5);
        this.layers = [this.layer2];
    }
    update(){
        this.layers.forEach(layer => layer.update());
    }
    draw(context){
        this.layers.forEach(layer => layer.draw(context));
    }


}
class SoundController {

    constructor(){
        this.powerUpSound = document.getElementById('powerup'); 
        this.powerDownSound = document.getElementById('powerdown');
        this.shoutSound = document.getElementById('shout');
        this.gameOverSound = document.getElementById('gameover');
    }
    powerUp(){
        this.powerUpSound.currentTime = 0;
        this.powerUpSound.play();
    }
    powerDown(){
        this.powerDownSound.currentTime = 0;
        this.powerDownSound.play();
    }
    shout(){
        this.shoutSound.currentTime = 0;
        this.shoutSound.play();
    }
    gameOver(){
        this.gameOverSound.currentTime = 0;
        this.gameOverSound.play();
    }
    gameOverStop(){
        this.gameOverSound.currentTime = 0;
        this.gameOverSound.pause();
    }
}
class UI{
    constructor(game){
        this.game = game;
        this.fontSize = 5 ;
        this.fontfamily = 'Eater';
        this.color = 'Green';
    }
    draw(context){
        //score 
        context.font = '20px Eater';
        context.fillText('Score: ' + this.game.scroe, 900, 30);

        //amout 
        context.fillStyle = this.color;
        if(this.game.player.powerUp) {
            context.fillStyle = 'darkgreen';
        }
        for(let i = 0; i < this.game.amount; i++){
            context.fillRect(10 + i * 10, 10, 3, 20);
        }
        context.font = '10px Eater';
        context.fillText('Life: ' + (this.game.amount).toFixed(0), 50, 50); 
        //Timer 
        
        let formattedTime = +(this.game.timeLimit * 0.001 - this.game.gameTime * 0.001).toFixed(1);
        context.font = '15px Eater';
        context.fillText('Time : '+formattedTime, 500, 60);

        //game over
        if(this.game.gameOver){
            context.textAlign = "center";
            let message1;
            let message2;
            let message3;
            if(this.game.scroe > this.game.winningScore){
                message1 = 'Happy Earthworms, Happy Planet!';
                message2 = 'You are a true EarthBuddy!';
                message3 = 'Your Score   ' + this.game.scroe + '   Max Score  ' + this.game.winningScore;
            }else{
                message1 = 'Happy Earthworms, Happy Planet!';
                message2 = 'You are a true EarthBuddy!';
                message3 =  'Your Score   ' + this.game.scroe + '  Max Score  ' + this.game.winningScore;
            }
            context.font = '25px Arial';
            context.fillText(message1, this.game.width * 0.5, this.game.height * 0.3 - 40);
            context.font = '20px Arial';
            context.fillText(message2, this.game.width * 0.5, this.game.height * 0.3);
            context.font = '15px Arial';
            context.fillText(message3, this.game.width * 0.5, this.game.height * 0.3 + 40);
            context.font = '15px Arial'; 
            restartButton.style.display = 'block'; 
        }
        
    }
}
class Game{

    constructor(width, height){
        this.width = width;
        this.height = height;
        this.keys = [];
        this.player = new Player(this);
        this.background = new Background(this);
        this.InputHandler = new InputHandler(this);
        this.sound = new SoundController();
        this.UI = new UI(this);
        this.opponent = [];
        this.opponentTimer = 0;
        this.opponentInterval = 2000;
        this.amount = 20;
        this.maxAmount = 30;
        this.amoTimer = 0;
        this.amoInterval = 350;
        this.gameOver = false;
        this.scroe = 0;
        this.winningScore = 500;
        this.gameTime = 0;
        this.timeLimit = 60000;
        this.speed = 1;
        this.debug = false;
    }

    update(deltaTime){
        if(!this.gameOver){
            this.gameTime += deltaTime;
            if(this.gameTime > this.timeLimit){
                this.gameOver = true;
                this.sound.gameOver();
            }

        } 
        this.background.update();
        this.player.update(deltaTime);
        if(this.amoTimer > this.amoInterval){
            if(this.amount < this.maxAmount) this.amount++;
            this.amoTimer = 0;
        }else{
            this.amoTimer++;
        }

        this.opponent.forEach(opponent => {
            opponent.update();
            if(this.checkCollision(opponent, this.player)){
                opponent.markedForDeletion = true;
                //this.sound.powerDown();
                if(opponent.type == 'lucky'){
                    this.player.enterPowerUp();
                }else this.scroe --;
            }
            this.player.seeds.forEach(seeds => {
                if(this.checkCollision(seeds, opponent)){
                    opponent.lives--;
                    seeds.markedForDeletion = true;
                    if(opponent.lives <= 0){
                        opponent.height = 100;
                        opponent.image = document.getElementById('opponent2');
                        if(opponent.type != 'lucky') {
                            opponent.y = opponent.y + 50;
                        }else{
                            opponent.markedForDeletion = true;
                        }
                        
                    this.scroe += opponent.scroe;
                        if(!this.gameOver) this.scroe += opponent.scroe;
                        if(this.scroe > this.winningScore){
                           this.gameOver = true;
                           this.sound.gameOver();
                        }
                    } 
                }
            });
        });

        this.opponent = this.opponent.filter(opponent => !opponent.markedForDeletion);
        if(this.opponentTimer > this.opponentInterval && !this.gameOver){
            this.addOpponent();
            this.opponentTimer = 0;
        }else{
            this.opponentTimer += deltaTime;
        }

    }   
    draw(context){
        this.background.draw(context);
        this.player.draw(context);
        this.UI.draw(context);
        this.opponent.forEach(opponent => {
            opponent.draw(context);
        })
    }

    addOpponent(){ 
        this.opponent.push(new EarthWarm(this));
        this.opponent.push(new LuckyEarthWarm(this));
        //console.log(this.opponent);
    }

    checkCollision(rect1, rect2){
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y

        );
    }


}

const game = new Game(canvas.width, canvas.height);

let lastTime = 0;

function animate(timestamp){
    /* Delta Time is the diffrence in millesecods between the timestamp 
    from this loop and the timestamp from the previous loop*/
    const deltaTime = timestamp - lastTime;
    // console.log(deltaTime);
    lastTime = timestamp;
    cxt.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(cxt);
    /* requestAnimationFrame tells the browser 
    that we wish to perform an animation and it 
    requests that the browser calls a specified function to update an animation before the next repaint. */
    requestAnimationFrame(animate);
}
//animate(0);
});