let player1;
let player2;


document.addEventListener('DOMContentLoaded', function(){
    const singlePlayerButton = document.getElementById('single-button');
    const multiPlayerButton = document.getElementById('multi-button');
    const restartButton = document.getElementById('restart-button');
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameOverScreen = document.getElementById('game-over');

    // Checks if single player was chosen
    singlePlayerButton.addEventListener('click', function(){
        startGame(true);
    })

    // Checks if multi player was chosen
    multiPlayerButton.addEventListener('click', function(){
        startGame(false);
    })

    // Checks when restart button is clicked
    restartButton.addEventListener('click', function(){
        restartGame();
    })

    // Starts the game as single or multi player
    function startGame(version){
        console.log("Starting game...");
        startScreen.style.display = 'none';
        gameScreen.style.display = 'flex';
        gameOverScreen.style.display = 'none';

        if (version) {
            isSinglePlayer = true;
            player1 = new p5(tetris2, 'player1');
        }
        else{
            isSinglePlayer = false;
            player1 = new p5(tetris, 'player1');
            player2 = new p5(tetris2, 'player2');
        }
    }

    // Restarts the game to start screen
    const restartGame = () => {
        startScreen.style.display = 'flex';
        gameScreen.style.display = 'none';
        gameOverScreen.style.display = 'none';
        singlePlayerButton.focus();
    }
})

// Ends the p5 tetris instances and shows the game over screen
// Shows score for single player and who won for multi player
const gameOver = (player, s) => {
    const gameScreen = document.getElementById('game-screen');
    const gameOverScreen = document.getElementById('game-over');
    const gameOverText = document.getElementById('lose');
    const scoreText = document.getElementById('score');
    const restartButton = document.getElementById('restart-button');

    if(!isSinglePlayer){
        player1.remove();
        player2.remove();
        scoreText.style.display = 'none';
        gameOverText.textContent = `Player ${player} Wins!!!`;
    }
    else{
        player1.remove();
        scoreText.style.display = 'flex';
        gameOverText.textContent = "GAME OVER";
        scoreText.textContent = `Score: ${s}`;
    }
    gameScreen.style.display = 'none';
    gameOverScreen.style.display = 'flex';
    restartButton.style.display = 'none'
    setTimeout(() => {
        restartButton.style.display = 'flex';
        restartButton.focus();
    }, 1200);
};

window.gameOver = gameOver;