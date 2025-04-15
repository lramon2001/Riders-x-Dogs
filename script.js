let character = document.getElementById("character");
let gameArea = document.getElementById("gameArea");
let obstacles = [];
let isGameOver = false;
let gameSpeed = 5; // Velocidade dos obstáculos
let gravity = -0.5; // Gravidade (controle da aceleração para baixo)
let jumpVelocity = 20; // Velocidade inicial do pulo
let jumpHeight = 0; // Altura atual do pulo
let horizontalSpeed = 4; // Velocidade horizontal enquanto pula
let isJumping = false; // Permite múltiplos pulos

// Lista de imagens de cachorros (deve ser preenchida com os caminhos corretos)
const dogImages = [
    'images/pastor_alemao.png',
    'images/husky_siberiano.png',
    'images/dogue_alemao.png',
    'images/caramelo.png',
    'images/doberman.png',
];

// Lista de personagens e imagens
const characters = {
    'Abadi': 'images/abadi.png',
    'Igor Menzes': 'images/igor_menezes.png',
    'Cláudio Prime Silvano Sales': 'images/claudio_prime.png',
    'Lucas Ramon': 'images/lucas.png',
    'Luis Eduardo': 'images/luis.png',
    'Tenente Anderson': 'images/tenente_anderson.png',
    // Adicione mais personagens e suas imagens conforme necessário
};

// Função para exibir a seleção de personagem com SweetAlert
function selectCharacter() {
    let characterNames = Object.keys(characters);
    let characterOptions = {};

    characterNames.forEach((name) => {
        characterOptions[name] = name; // Mapeando o nome do personagem
    });

    Swal.fire({
        title: 'Escolha seu personagem!',
        text: 'Escolha o personagem para começar a missão!',
        icon: 'question',
        input: 'select',
        inputOptions: characterOptions, // Passando as opções de personagens
        inputPlaceholder: 'Selecione um personagem',
        showCancelButton: true,
        confirmButtonText: 'Jogar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            let selectedCharacter = result.value; // Nome do personagem escolhido
            character.src = characters[selectedCharacter]; // Atualiza a imagem do personagem

            startGame(); // Inicia o jogo após a seleção
        } else {
            Swal.fire('Você precisa escolher um personagem para começar!');
        }
    });
}

// Função de pulo (parabólico com aceleração)
function jump() {
    jumpHeight = 0;
    let verticalSpeed = jumpVelocity; // Velocidade inicial do pulo

    let jumpInterval = setInterval(function() {
        if (jumpHeight < 150 && verticalSpeed > 0) {
            jumpHeight += verticalSpeed;
            verticalSpeed += 0.5; // Acelera enquanto sobe
            character.style.bottom = `${50 + jumpHeight}px`;
            moveCharacterWhileJumping();
        } else if (jumpHeight > 0) {
            jumpHeight += verticalSpeed;
            verticalSpeed += gravity;
            character.style.bottom = `${50 + jumpHeight}px`;
            moveCharacterWhileJumping();
        } else {
            clearInterval(jumpInterval);
        }
    }, 20);
}

// Função para mover o motociclista para a direita enquanto pula
function moveCharacterWhileJumping() {
    let currentPosition = parseInt(character.style.left);
    character.style.left = `${currentPosition + horizontalSpeed}px`;
}

// Eventos de controle para pulo (toque ou teclado)
document.addEventListener("keydown", function(event) {
    if (event.key === " " || event.key === "ArrowUp") {
        jump(); // Se pressionar espaço ou seta para cima no teclado, faz o pulo
    }
});

gameArea.addEventListener("touchstart", function() {
    jump(); // Ao tocar na tela, o motociclista pula
});

// Função para exibir a introdução com SweetAlert quando a página carregar
document.addEventListener("DOMContentLoaded", function() {
    Swal.fire({
        title: 'Dogs x Riders. Bem-vindo a Brasília!',
        text: 'Uma guerra está ocorrendo entre cães e motociclistas. Os cães estão dominando a cidade e os motociclistas precisam sobreviver. Sua missão é chegar ao fim vivo, desviar dos cães e garantir que os motociclistas prosperem. Não machuque os cães, apenas desvie deles!',
        icon: 'info',
        confirmButtonText: 'Jogar'
    }).then((result) => {
        if (result.isConfirmed) {
            selectCharacter(); // Exibe a seleção do personagem após a introdução
        }
    });
});

// Função que inicia o jogo
function startGame() {
    setInterval(moveObstacles, 20); // Movimenta obstáculos a cada 20ms
    setInterval(spawnObstacle, 3000); // Gera um novo obstáculo a cada 3 segundos
    setInterval(moveCharacter, 20); // Move o personagem para a direita constantemente
}

// Função para gerar obstáculos (agora com cachorros)
function spawnObstacle() {
    let obstacle = document.createElement("img");
    obstacle.classList.add("obstacle");

    let randomDogImage = dogImages[Math.floor(Math.random() * dogImages.length)];

    obstacle.src = randomDogImage;
    obstacle.style.left = `${window.innerWidth}px`;
    obstacle.style.bottom = `${Math.random() * 50 + 50}px`;

    gameArea.appendChild(obstacle);
    obstacles.push(obstacle);
}

// Função para mover os obstáculos
function moveObstacles() {
    obstacles.forEach(function(obstacle, index) {
        let obstacleLeft = parseInt(obstacle.style.left);
        
        if (obstacleLeft > 0) {
            obstacle.style.left = `${obstacleLeft - gameSpeed}px`;
        } else {
            obstacle.style.left = `${window.innerWidth}px`;
        }

        checkCollision(obstacle);
    });
}

// Função de detecção de colisão
function checkCollision(obstacle) {
    let characterRect = character.getBoundingClientRect();
    let obstacleRect = obstacle.getBoundingClientRect();

    if (
        characterRect.left < obstacleRect.right &&
        characterRect.right > obstacleRect.left &&
        characterRect.top < obstacleRect.bottom &&
        characterRect.bottom > obstacleRect.top
    ) {
        gameOver();
    }
}

// Função de fim de jogo com SweetAlert
function gameOver() {
    if (!isGameOver) {
        isGameOver = true;
        
        Swal.fire({
            title: 'Game Over!',
            text: 'O fim era certo, os cachorros dominaram Brasília e os motociclistas foram extintos.',
            icon: 'warning',
            confirmButtonText: 'Tentar Novamente'
        }).then((result) => {
            if (result.isConfirmed) {
                location.reload(); // Isso vai recarregar a página e reiniciar o jogo
            }
        });
        
        clearInterval(moveObstacles);
    }
}

// Função para mover o personagem para a direita continuamente
function moveCharacter() {
    let currentPosition = parseInt(character.style.left);
    character.style.left = `${currentPosition + 2}px`;
}

// Inicia a seleção do personagem ao carregar a página
document.addEventListener("DOMContentLoaded", function() {
    selectCharacter();
});
