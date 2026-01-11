🐍 Snake Game v1.2

📝 Descrição
Este é um remake moderno do clássico jogo "Snake" (o jogo da cobrinha), desenvolvido com JavaScript puro (Vanilla JS) e renderizado via HTML5 Canvas.

A versão 1.2 traz uma reformulação visual completa com estética Neon/Arcade, além de melhorias significativas na jogabilidade, como dificuldade progressiva e correção de bugs de movimento.

✨ Funcionalidades
Dificuldade Progressiva: O jogo começa em uma velocidade moderada e acelera a cada 50 pontos, aumentando o desafio.

Sistema de Recorde (High Score): Utiliza localStorage para salvar sua pontuação máxima. O recorde persiste mesmo se você fechar o navegador.

Visual Neon: Interface atualizada com efeitos de brilho (glow) e cores contrastantes.

Correção de Input: Lógica implementada para impedir que a cobra colida consigo mesma ao pressionar duas teclas de direção muito rapidamente (bug comum em jogos Snake simples).

Áudio: Efeitos sonoros ao coletar comida.

🛠️ Tecnologias Utilizadas
HTML5 Canvas: Para renderização gráfica do jogo em 2D.

CSS3: Para estilização da interface, utilizando Flexbox para layout e sombras para o efeito neon.

JavaScript (ES6+): Lógica do jogo, manipulação do DOM e controle de estado.

🧠 Lógica e Estrutura do Código
O projeto é dividido em três arquivos principais:

1. index.html
Estrutura semântica que contém o <canvas> (onde o jogo é desenhado) e a interface de usuário (placar e tela de Game Over).

2. style.css
Define o visual "Dark Mode/Neon". O Canvas possui um efeito de borda e sombra para destacar a área de jogo.

3. script.js
O coração do jogo funciona através de um Game Loop recursivo utilizando setTimeout.

Grid System: O jogo funciona em uma grade de 600x600px, dividida em blocos de 30px (size = 30).

Movimentação: A cobra é um Array de coordenadas. A cada frame, calculamos a nova posição da cabeça baseada na direção atual.

Se comer: Mantemos o tamanho (não removemos o último elemento do array).

Se não comer: Removemos o último elemento (snake.shift()) para criar a ilusão de movimento.

Colisão:

Paredes: Verifica se as coordenadas da cabeça (X, Y) ultrapassaram os limites do Canvas (0 ou 600).

Auto-colisão: Verifica se as coordenadas da cabeça coincidem com qualquer outra parte do corpo (snake.find()).

Destaque Técnico: Prevenção de "Suicídio"
Para evitar que o jogador vire 180º instantaneamente (ex: ir para a Direita e apertar Esquerda), implementamos uma verificação dupla:

JavaScript

// Verifica não apenas a tecla pressionada, mas a última direção PROCESSADA pelo jogo
if (key == "ArrowRight" && lastDirection != "left") {
    direction = "right";
}
📂 Estrutura de Pastas
/
├── assets/
│   └── audio.mp3    # Efeito sonoro de comer
├── index.html       # Estrutura
├── style.css        # Estilo
├── script.js        # Lógica
└── README.md        # Documentação
🔮 Melhorias Futuras
[ ] Adicionar suporte para toque (mobile).

[ ] Criar botão de pausar o jogo.

[ ] Implementar obstáculos no meio do mapa em níveis avançados.

👨‍💻 Autor
Desenvolvido por Felipe José da Silva.
