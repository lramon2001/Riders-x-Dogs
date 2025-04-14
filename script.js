let character = document.getElementById("character");
let gameArea = document.getElementById("gameArea");
let obstacles = [];
let isJumping = false;
let isGameOver = false;
let gameSpeed = 5; // Velocidade dos obstáculos
let gravity = -0.5; // Gravidade (controle da aceleração para baixo)
let jumpVelocity = 20; // Velocidade inicial do pulo
let jumpHeight = 0; // Altura atual do pulo
let horizontalSpeed = 4; // Velocidade horizontal enquanto pula

// Função de pulo (parabólico com aceleração)
function jump() {
    if (!isJumping) {
        isJumping = true;
        jumpHeight = 0;
        let verticalSpeed = jumpVelocity; // Velocidade inicial do pulo

        let jumpInterval = setInterval(function() {
            // Movimento parabólico: subindo e depois descendo
            if (jumpHeight < 150 && verticalSpeed > 0) {
                jumpHeight += verticalSpeed;
                verticalSpeed += 0.5; // Acelera enquanto sobe
                character.style.bottom = `${50 + jumpHeight}px`;
                moveCharacterWhileJumping(); // Mover para a direita enquanto sobe
            } else if (jumpHeight > 0) {
                jumpHeight += verticalSpeed;
                verticalSpeed += gravity; // Acelera para baixo devido à gravidade
                character.style.bottom = `${50 + jumpHeight}px`;
                moveCharacterWhileJumping(); // Mover para a direita enquanto desce
            } else {
                clearInterval(jumpInterval);
                isJumping = false;
            }
        }, 20); // A cada 20ms, atualiza a posição do pulo
    }
}

// Função para mover o motociclista para a direita enquanto pula
function moveCharacterWhileJumping() {
    let currentPosition = parseInt(character.style.left);
    character.style.left = `${currentPosition + horizontalSpeed}px`; // Move o personagem para a direita enquanto pula
}

// Evento de teclado para pular
document.addEventListener("keydown", function(event) {
    if (event.key === " " || event.key === "ArrowUp") {
        jump();
    }
});

// Função para gerar obstáculos
function spawnObstacle() {
    let obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    obstacle.style.left = `${window.innerWidth}px`; // Posição inicial à direita
    obstacle.style.bottom = `${Math.random() * 50 + 50}px`; // Posição aleatória do obstáculo
    gameArea.appendChild(obstacle);
    obstacles.push(obstacle); // Adiciona o novo obstáculo ao array
}

// Função para mover os obstáculos
function moveObstacles() {
    obstacles.forEach(function(obstacle, index) {
        let obstacleLeft = parseInt(obstacle.style.left);
        
        // Movimento dos obstáculos da direita para a esquerda
        if (obstacleLeft > 0) {
            obstacle.style.left = `${obstacleLeft - gameSpeed}px`;
        } else {
            obstacle.style.left = `${window.innerWidth}px`; // Se o obstáculo sair da tela, reposiciona à direita
        }

        checkCollision(obstacle); // Verifica se o personagem colidiu com o obstáculo
    });
}

// Função de detecção de colisão
function checkCollision(obstacle) {
    let characterRect = character.getBoundingClientRect();
    let obstacleRect = obstacle.getBoundingClientRect();

    // Verificar se há sobreposição entre o personagem e o obstáculo
    if (
        characterRect.left < obstacleRect.right &&
        characterRect.right > obstacleRect.left &&
        characterRect.top < obstacleRect.bottom &&
        characterRect.bottom > obstacleRect.top
    ) {
        gameOver();
    }
}

// Função de fim de jogo
function gameOver() {
    if (!isGameOver) {
        isGameOver = true;
        alert("Game Over!");
        clearInterval(moveObstacles); // Interrompe o movimento dos obstáculos
    }
}

// Função para mover o personagem para a direita continuamente
function moveCharacter() {
    let currentPosition = parseInt(character.style.left);
    character.style.left = `${currentPosition + 2}px`; // Move o personagem para a direita constantemente
}

// Inicia a geração e movimentação dos obstáculos e personagem
setInterval(moveObstacles, 20); // Movimenta obstáculos a cada 20ms
setInterval(spawnObstacle, 3000); // Gera um novo obstáculo a cada 3 segundos
setInterval(moveCharacter, 20); // Move o personagem para a direita constantemente
