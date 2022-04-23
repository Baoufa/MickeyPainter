document.addEventListener('DOMContentLoaded', onDomLoaded);

function onDomLoaded() {
  let canvas = document.querySelector('canvas');
  let ctx = canvas.getContext('2d');

  ctx.lineWidth = 10;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  let coord = {};

  let savedCanvas = [];
  let undoHistory = [];
  let savedLastPath = [];
  let mouseClickState = false;
  let fromEraser = false;

  const buttonsColor = document.querySelectorAll('.btn--color');
  const buttonsSize = document.querySelectorAll('.btn--size');
  const sizeSelectors = document.querySelectorAll('span');
  const image = document.getElementById('source');
  const eraseBtn = document.getElementById('erase');
  const undoBtn = document.getElementById('undo');
  const redoBtn = document.getElementById('redo');

  const cursor = document.querySelector('.cursor');

  image.addEventListener('load', (event) => {
    ctx.drawImage(image, 380, 365);
  });

  function colorPicker(color) {
    ctx.strokeStyle = color;

    for (let selector of sizeSelectors) {
      selector.style.backgroundColor = color;
    }
  }

  function sizePicker(sizeId) {
    console.log(sizeId);

    switch (sizeId) {
      case 0:
        ctx.lineWidth = 5;
        break;
      case 1:
        ctx.lineWidth = 10;
        break;
      case 2:
        ctx.lineWidth = 20;
        break;
    }
  }

  function createEventOnColorBtn() {
    for (let btn of buttonsColor) {
      let color = window.getComputedStyle(btn).backgroundColor;
      btn.addEventListener('click', colorPicker.bind(null, color));
    }
  }

  function createEventOnSizeBtn() {
    let i = 0;
    for (let btn of buttonsSize) {
      btn.addEventListener('click', sizePicker.bind(null, i));
      i += 1;
    }
  }

  function onMouseOver(event) {
    coord = {
      x: event.offsetX,
      y: event.offsetY,
    };
    cursor.style.display = 'block';
  }

  function savingCanvas(path) {
    savedCanvas.push(path);
    undoHistory = [];
  }

  function draw(prevX, prevY, currX, currY) {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.stroke();
  }

  function onMouseMove(event) {
    cursor.style.backgroundColor = ctx.strokeStyle;
    cursor.style.width = ctx.lineWidth + 'px';
    cursor.style.height = ctx.lineWidth + 'px';
    cursor.style.left = event.offsetX + 'px';
    cursor.style.top = event.offsetY + 'px';

    if (!mouseClickState) {
      return;
    }
    draw(coord.x, coord.y, event.offsetX, event.offsetY);

    const path = {
      width: ctx.lineWidth,
      color: ctx.strokeStyle,
      moveCoor: { x: coord.x, y: coord.y },
      lineCoor: { x: event.offsetX, y: event.offsetY },
    };

    savedLastPath.push(path);
    coord = {
      x: event.offsetX,
      y: event.offsetY,
    };
  }

  function isDrawing(event) {
    coord = {
      x: event.offsetX,
      y: event.offsetY,
    };
    mouseClickState = true;
  }
  function isNotDrawing() {
    mouseClickState = false;
    savingCanvas(savedLastPath);
    savedLastPath = [];
  }

  function onMouseOut() {
    mouseClickState = false;
    cursor.style.display = 'none';
  }

  // MEMORY REDO UNDO & ERASER

  function undoHandler() {
    ctx.clearRect(0, 0, 500, 500);
    ctx.drawImage(image, 380, 365);

    if (savedCanvas.length === 0) {
      return;
    } else if (fromEraser === true) {
      for (let savedPaths of savedCanvas) {
        for (let savedPath of savedPaths) {
          ctx.strokeStyle = savedPath.color;
          ctx.lineWidth = savedPath.width;
          draw(
            savedPath.moveCoor.x,
            savedPath.moveCoor.y,
            savedPath.lineCoor.x,
            savedPath.lineCoor.y,
          );
        }
      }
      fromEraser = false;
    } else {
      undoHistory.push(savedCanvas.pop());

      for (let savedPaths of savedCanvas) {
        for (let savedPath of savedPaths) {
          ctx.strokeStyle = savedPath.color;
          ctx.lineWidth = savedPath.width;
          draw(
            savedPath.moveCoor.x,
            savedPath.moveCoor.y,
            savedPath.lineCoor.x,
            savedPath.lineCoor.y,
          );
        }
      }
    }
  }

  function redoHandler() {
    if (!undoHistory.length) {
      return;
    } else if (fromEraser === true) {
      for (let savedPaths of savedCanvas) {
        for (let savedPath of savedPaths) {
          ctx.strokeStyle = savedPath.color;
          ctx.lineWidth = savedPath.width;
          draw(
            savedPath.moveCoor.x,
            savedPath.moveCoor.y,
            savedPath.lineCoor.x,
            savedPath.lineCoor.y,
          );
        }
      }
      fromEraser = false;
    } else {
      const lastPath = undoHistory[undoHistory.length - 1];

      for (let savedPath of lastPath) {
        ctx.strokeStyle = savedPath.color;
        ctx.lineWidth = savedPath.width;
        draw(
          savedPath.moveCoor.x,
          savedPath.moveCoor.y,
          savedPath.lineCoor.x,
          savedPath.lineCoor.y,
        );
      }

      savedCanvas.push(undoHistory.pop());
    }
  }

  function eraseHandler() {
    fromEraser = true;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 500, 500);
    ctx.drawImage(image, 380, 365);
    undoHistory.push(savedCanvas);
    console.log(fromEraser);
  }

  // EVENT LISTENERS

  canvas.addEventListener('mousedown', isDrawing);
  canvas.addEventListener('mouseup', isNotDrawing);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseout', onMouseOut);
  canvas.addEventListener('mouseover', onMouseOver);
  createEventOnColorBtn();
  createEventOnSizeBtn();
  undoBtn.addEventListener('click', undoHandler);
  redoBtn.addEventListener('click', redoHandler);
  eraseBtn.addEventListener('click', eraseHandler);
}
