let player1;
let player2;


document.addEventListener('DOMContentLoaded', function(){
    const singlePlayerButton = document.getElementById('single-button');
    const multiPlayerButton = document.getElementById('multi-button');
    const restartButton = document.getElementById('restart-button');
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameOverScreen = document.getElementById('game-over');

    if (!singlePlayerButton || !multiPlayerButton || !startScreen || !gameScreen) {
        console.error('One or more elements not found.');
        return;
    }

    singlePlayerButton.addEventListener('click', function(){
        startGame(true);
    })

    multiPlayerButton.addEventListener('click', function(){
        startGame(false);
    })

    restartButton.addEventListener('click', function(){
        restartGame();
    })

    function startGame(version){
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

    const restartGame = () => {
        startScreen.style.display = 'flex';
        gameScreen.style.display = 'none';
        gameOverScreen.style.display = 'none';
    }
})

const gameOver = (player, s) => {
    const gameScreen = document.getElementById('game-screen');
    const gameOverScreen = document.getElementById('game-over');
    const gameOverText = document.getElementById('lose');
    const scoreText = document.getElementById('score');

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
};

window.gameOver = gameOver;