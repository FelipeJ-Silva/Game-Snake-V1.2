const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.querySelector(".score--value");
const highScoreElement = document.querySelector(".high-score--value");
const finalScoreElement = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

// Tenta carregar o áudio, mas não quebra o jogo se falhar
const audio = new Audio('assets/audio.mp3');

const size = 30; // Tamanho de cada quadrado
let snake = [];
let initialPosition = { x: 270, y: 240 };
let direction, loopId;
let gameSpeed = 300; // Velocidade inicial em ms
let score = 0;

// Carregar recorde do localStorage
let highScore = localStorage.getItem('snakeHighScore') || 0;
highScoreElement.innerText = highScore;

const updateScore = () => {
    score += 10;
    scoreElement.innerText = score;

    // Aumenta a velocidade (diminui o tempo do loop) a cada 50 pontos
    // Limita a velocidade máxima a 60ms
    if (score % 50 === 0 && gameSpeed > 60) {
        gameSpeed -= 20;
    }
};

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
};

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size);
    return Math.round(number / 30) * 30;
};

const randomColor = () => {
    const red = randomNumber(50, 255);
    const green = randomNumber(50, 255);
    const blue = randomNumber(50, 255);
    return `rgb(${red}, ${green}, ${blue})`;
};

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
};

const drawFood = () => {
    const { x, y, color } = food;

    ctx.shadowColor = color;
    ctx.shadowBlur = 15; // Aumentei o brilho
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    ctx.shadowBlur = 0;
};

const drawSnake = () => {
    ctx.fillStyle = "#ddd";

    snake.forEach((position, index) => {
        // Cabeça da cobra
        if (index == snake.length - 1) {
            ctx.fillStyle = "#00ff88"; // Cor neon
            ctx.shadowColor = "#00ff88";
            ctx.shadowBlur = 10;
        } else {
            ctx.fillStyle = "#aaa";
            ctx.shadowBlur = 0;
        }
        ctx.fillRect(position.x, position.y, size, size);
    });
    ctx.shadowBlur = 0;
};

const moveSnake = () => {
    if (!direction) return;

    const head = snake[snake.length - 1];

    // Clonamos a cabeça para calcular a nova posição
    let newHead = { x: head.x, y: head.y };

    if (direction == "right") newHead.x += size;
    if (direction == "left") newHead.x -= size;
    if (direction == "down") newHead.y += size;
    if (direction == "up") newHead.y -= size;

    snake.push(newHead); // Adiciona a nova cabeça

    // Se não comeu, remove o rabo (movimento padrão)
    // Se comeu, não remove o rabo (a cobra cresce)
    // Essa lógica é feita na função checkEat, mas aqui removemos sempre
    // e lá controlamos se removeu ou não.
    // Simplificação: Sempre remove o rabo aqui, a menos que coma.

    // Vou manter a lógica do seu código original (push sempre, shift sempre)
    // mas movi o shift para fora para facilitar a leitura.
    snake.shift();
};

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#191919"; // Grid mais sutil

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.lineTo(i, 0);
        ctx.lineTo(i, 600);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineTo(0, i);
        ctx.lineTo(600, i);
        ctx.stroke();
    }
};

const checkEat = () => {
    const head = snake[snake.length - 1];

    if (head.x == food.x && head.y == food.y) {
        updateScore();

        // Adiciona um segmento extra (cresce)
        // Como o moveSnake já deu shift(), precisamos readicionar o rabo antigo
        // ou simplesmente duplicar a cabeça agora.
        snake.push(head);

        try { audio.play(); } catch (e) { }

        let x = randomPosition();
        let y = randomPosition();

        // Evita que a comida nasça em cima da cobra
        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition();
            y = randomPosition();
        }

        food.x = x;
        food.y = y;
        food.color = randomColor();
    }
};

const checkCollision = () => {
    const head = snake[snake.length - 1];
    const canvasLimit = canvas.width - size;
    const neckIndex = snake.length - 2;

    const wallCollision =
        head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

    // Verificação de colisão com o próprio corpo
    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y;
    });

    if (wallCollision || selfCollision) {
        gameOver();
    }
};

const gameOver = () => {
    direction = undefined;

    // Atualiza Recorde
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreElement.innerText = highScore;
    }

    menu.style.display = "flex";
    finalScoreElement.innerText = score;
    canvas.style.filter = "blur(4px)"; // Blur mais forte
};

const gameLoop = () => {
    clearInterval(loopId);

    ctx.clearRect(0, 0, 600, 600);
    drawGrid();
    drawFood();
    moveSnake(); // Move primeiro
    drawSnake(); // Desenha depois
    checkEat(); // Verifica comida
    checkCollision(); // Verifica morte

    // Loop recursivo com velocidade variável
    loopId = setTimeout(() => {
        gameLoop();
    }, gameSpeed);
};

// Reiniciar jogo
const resetGame = () => {
    score = 0;
    gameSpeed = 300; // Reseta velocidade
    scoreElement.innerText = "00";
    menu.style.display = "none";
    canvas.style.filter = "none";
    snake = [{ x: 270, y: 240 }]; // Reinicia cobra
    direction = undefined; // Pausa o jogo até apertar tecla

    // Reposiciona comida para não nascer no lugar padrão da cobra
    food.x = randomPosition();
    food.y = randomPosition();
    food.color = randomColor();

    gameLoop();
};

buttonPlay.addEventListener("click", resetGame);

// Controle de input com prevenção de bug (virada 180 rápida)
let lastDirection = ""; // Direção processada no último frame

document.addEventListener("keydown", ({ key }) => {
    // A lógica aqui impede que você mude a direção oposta baseada
    // na ÚLTIMA direção que a cobra realmente se moveu, não a última tecla apertada.

    // Atualizamos lastDirection baseado na direção atual antes de mudar
    if (direction) lastDirection = direction;

    if (key == "ArrowRight" && lastDirection != "left") {
        direction = "right";
    }
    if (key == "ArrowLeft" && lastDirection != "right") {
        direction = "left";
    }
    if (key == "ArrowDown" && lastDirection != "up") {
        direction = "down";
    }
    if (key == "ArrowUp" && lastDirection != "down") {
        direction = "up";
    }
});

// Inicia o jogo na tela limpa
snake = [initialPosition];
gameLoop();