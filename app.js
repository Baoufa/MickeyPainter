document.addEventListener('DOMContentLoaded', onDomLoaded);

function onDomLoaded() {
  let canvas = document.querySelector('canvas');
  let ctx = canvas.getContext('2d');
  let isDrawing = false;
  let mouseCoor = [];
  let dotLink;
  let path;

  // BUTTON ELEMENTS

  const buttonsColor = document.querySelectorAll('.btn--color');
  const buttonsSize = document.querySelectorAll('.btn--size');
  const sizeSelectors = document.querySelectorAll('span');
  // const eraseBtn = document.getElementById('erase');
  const undoBtn = document.getElementById('undo');
  const redoBtn = document.getElementById('redo');

  // DRAW OBJECT

  class StyleParameters {
    static lineWidth = 10;
    static strokeStyle = 'black';
    static setSize(lineWidth) {
      ctx.lineWidth = lineWidth;
      this.lineWidth = lineWidth;
    }
    static setColor(strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      this.strokeStyle = strokeStyle;
    }
  }

  class InitialCanvas {
    constructor() {
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 10;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.fillStyle = 'white';
      this.image = document.getElementById('source');
      this.image.addEventListener('load', (event) => {
        ctx.drawImage(this.image, 380, 365);
      });
    }
    draw() {
      ctx.fillRect(0, 0, 500, 500);
      ctx.drawImage(this.image, 380, 365);
    }
  }

  class UndoHistory {
    constructor() {
      this.data = [];
    }
    deleteLast() {
      return this.data.pop();
    }
    deleteAll() {
      this.data = [];
    }
    writeLast(path) {
      if (!path) {
        return;
      }
      this.data.push(path);
    }
  }

  class SavedPaths {
    constructor() {
      this.data = [];
    }
    deleteLast() {
      return this.data.pop();
    }
    writeLast(path) {
      if (!path) {
        initialCanvas.draw();
        return;
      }
      this.data.push(path);
    }
    redrawAll() {
      for (let path of this.data) {
        for (let dotLink of path.data) {
          dotLink.draw();
        }
      }
    }
  }

  class Path {
    constructor() {
      this.data = [];
    }
    read() {
      return this.data;
    }
    write(dots) {
      this.data.push(dots);
    }
  }

  class DotLink {
    constructor(strokeStyle, lineWidth, startCoor, endCoor) {
      this.strokeStyle = strokeStyle;
      this.lineWidth = lineWidth;
      this.startCoor = startCoor;
      this.endCoor = endCoor;
      this.draw();
    }
    draw() {
      ctx.beginPath();
      ctx.strokeStyle = this.strokeStyle;
      ctx.lineWidth = this.lineWidth;
      ctx.moveTo(...this.startCoor);
      ctx.lineTo(...this.endCoor);
      ctx.stroke();
    }
  }

  // MOUSE EVENTS FUNCTION

  function onMouseMove(event) {
    if (isDrawing) {
      let clickCoor = [event.offsetX, event.offsetY];
      dotLink = new DotLink(
        StyleParameters.strokeStyle,
        StyleParameters.lineWidth,
        clickCoor,
        mouseCoor,
      );
      path.write(dotLink);
      mouseCoor = clickCoor;
    }
  }

  function onMouseOver(event) {
    mouseCoor = [event.offsetX, event.offsetY];
  }

  function onMouseDown(event) {
    path = new Path();
    mouseCoor = [event.offsetX, event.offsetY];
    isDrawing = true;
  }

  function onMouseUp(event) {
    if (isDrawing) {
      savedPaths.writeLast(path);
      undoHistory.deleteAll();
      isDrawing = false;
    }
  }

  function onMouseOut(event) {
    if (isDrawing) {
      savedPaths.writeLast(path);
      undoHistory.deleteAll();
      isDrawing = false;
    }
  }

  function onColorButton(color) {
    StyleParameters.setColor(color);
    for (let selector of sizeSelectors) {
      selector.style.backgroundColor = color;
    }
  }

  function onSizeButton(sizeId) {
    switch (sizeId) {
      case 0:
        StyleParameters.setSize(5);
        break;
      case 1:
        StyleParameters.setSize(10);
        break;
      case 2:
        StyleParameters.setSize(20);
        break;
    }
  }

  function onUndoButton() {
    const path = savedPaths.deleteLast();
    initialCanvas.draw();
    savedPaths.redrawAll();
    undoHistory.writeLast(path);
  }

  function onRedoButton() {
    const path = undoHistory.deleteLast();
    savedPaths.writeLast(path);
    initialCanvas.draw();
    savedPaths.redrawAll();
  }

  // OBJECT INITIALIZATION

  const initialCanvas = new InitialCanvas();
  initialCanvas.draw();

  const savedPaths = new SavedPaths();
  const undoHistory = new UndoHistory();

  // ADD BUTTON EVENTS

  function createEventOnColorBtn() {
    for (let btn of buttonsColor) {
      let color = window.getComputedStyle(btn).backgroundColor;
      btn.addEventListener('click', onColorButton.bind(null, color));
    }
  }

  function createEventOnSizeBtn() {
    let i = 0;
    for (let btn of buttonsSize) {
      btn.addEventListener('click', onSizeButton.bind(null, i));
      i += 1;
    }
  }

  createEventOnColorBtn();
  createEventOnSizeBtn();
  undoBtn.addEventListener('click', onUndoButton);
  redoBtn.addEventListener('click', onRedoButton);
  // eraseBtn.addEventListener('click', onEraseButton);

  // ADD MOUSE EVENTS

  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseout', onMouseOut);
  canvas.addEventListener('mouseover', onMouseOver);
}
