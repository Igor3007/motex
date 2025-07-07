import Matter from "matter-js";

document.addEventListener('DOMContentLoaded', () => {

  if(document.querySelector('.matter-tag')) {

  // Инициализация Matter.js
  const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body;

  // Создание движка
  const engine = Engine.create({
    gravity: {x: 0, y: .5}
  });

  // Получаем контейнер и canvas
  const canvasContainer = document.getElementById('canvas-container');
  const canvas = document.getElementById('matter-canvas');

  // Настройка рендерера
  const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
      width: canvasContainer.clientWidth,
      height: canvasContainer.clientHeight,
      wireframes: false,
      background: '#f0f0f0'
    }
  });

  // Обновляем размер canvas при изменении размера окна
  window.addEventListener('resize', function () {
    render.options.width = canvasContainer.clientWidth;
    render.options.height = canvasContainer.clientHeight;
    Render.setPixelRatio(render, window.devicePixelRatio);
  });

  // Добавляем стены
  const leftWall = Bodies.rectangle(
    -25,
    canvasContainer.clientHeight / 2,
    50,
    canvasContainer.clientHeight,
    {isStatic: true}
  );

  const rightWall = Bodies.rectangle(
    canvasContainer.clientWidth + 25,
    canvasContainer.clientHeight / 2,
    50,
    canvasContainer.clientHeight,
    {isStatic: true}
  );

  World.add(engine.world, [leftWall, rightWall]);

  // Массив для хранения HTML-блоков и их физических тел
  const htmlBlocks = [];

 
    document
      .querySelectorAll('.matter-tag')
      .forEach(element => {
        const body = Bodies.rectangle(500, -200, element.offsetWidth, element.offsetHeight, {
          chamfer: 8,
          restitution: 0.5,
          friction: 0.3,
          angle: Math.random() * Math.PI,
          frictionAir: Math.random() * 0.02,
          render: {
            fillStyle: 'transparent',
            strokeStyle: 'transparent'
          }
        })
        htmlBlocks.push({body, element});
        World.add(engine.world, body);
      });
  

  function teleportBlockUp(block) {
    // Останавливаем текущее движение
    Body.setVelocity(block.body, { x: 0, y: 0 });

    // Устанавливаем новую позицию (случайная позиция в верхней части экрана)
    const newX = 50 + Math.random() * (canvasContainer.clientWidth - 100);
    const newY = -200;

    // Телепортируем блок
    Body.setPosition(block.body, { x: newX, y: newY });
  }

  // Функция для обновления позиций HTML-элементов
  function updateHtmlElements() {
    htmlBlocks.forEach(block => {
      const {body, element} = block;
      element.style.left = body.position.x + 'px';
      element.style.top = body.position.y + 'px';
      element.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;

      const isBelowFloor = body.position.y > (canvasContainer.clientHeight - 200);

      if (isBelowFloor) {
        teleportBlockUp(block);
      }
    });
  }

  // Запускаем движок и рендерер
  Matter.Runner.run(engine);
  Render.run(render);

  // Обновляем HTML-элементы в каждом кадре
  (function update() {
    updateHtmlElements();
    requestAnimationFrame(update);
  })();

}

});

