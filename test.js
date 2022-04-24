document.addEventListener('DOMContentLoaded', onDomLoaded);

function onDomLoaded() {
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
      let canvas = document.querySelector('canvas');

      let ctx = canvas.getContext('2d');

      canvas.addEventListener('mousedown', onMouseDown.bind(this));
      canvas.addEventListener('mouseup', onMouseUp.bind(this));
      canvas.addEventListener('mousemove', onMouseMove.bind(this));
      canvas.addEventListener('mouseout', onMouseOut.bind(this));
      canvas.addEventListener('mouseover', onMouseOver.bind(this));

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

    // MOUSE EVENTS FUNCTION

    onMouseMove(event) {
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

    onMouseOver(event) {
      mouseCoor = [event.offsetX, event.offsetY];
    }

    onMouseDown(event) {
      path = new Path();
      mouseCoor = [event.offsetX, event.offsetY];
      isDrawing = true;
    }

    fonMouseUp(event) {
      if (isDrawing) {
        savedPaths.writeLast(path);
        undoHistory.deleteAll();
        isDrawing = false;
      }
    }

    onMouseOut(event) {
      if (isDrawing) {
        savedPaths.writeLast(path);
        undoHistory.deleteAll();
        isDrawing = false;
      }
    }
  }

  class Painter {
    constructor() {
      // OBJECT INITIALIZATION
      this.initialCanvas = new InitialCanvas();
      this.initialCanvas.draw();
      this.savedPaths = new SavedPaths();
      this.undoHistory = new UndoHistory();

      this.isDrawing = false;
      this.mouseCoor = [];
      this.dotLink;
      this.path;

      // BUTTON ELEMENTS
      this.colorBtn = document.querySelectorAll('.btn--color');
      this.sizeBtn = document.querySelectorAll('.btn--size');
      this.sizeSelectors = document.querySelectorAll('span');
      // const eraseBtn = document.getElementById('erase');
      this.undoBtn = document.getElementById('undo');
      this.redoBtn = document.getElementById('redo');

      this.createEventOnColorBtn = () => {
        for (let btn of this.colorBtn) {
          let color = window.getComputedStyle(btn).backgroundColor;
          btn.addEventListener('click', onColorButton.bind(this, color));
        }
      };

      this.createEventOnSizeBtn = () => {
        let i = 0;
        for (let btn of this.sizeBtne) {
          btn.addEventListener('click', onSizeButton.bind(this, i));
          i += 1;
        }
      };

      this.createEventOnColorBtn();
      this.createEventOnSizeBtn();
      this.undoBtn.addEventListener('click', onUndoButton.bind(this));
      this.redoBtn.addEventListener('click', onRedoButton.bind(this));
      // eraseBtn.addEventListener('click', onEraseButton);
    }

    onColorButton(color) {
      StyleParameters.setColor(color);
      for (let selector of sizeSelectors) {
        selector.style.backgroundColor = color;
      }
    }

    onSizeButton(sizeId) {
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

    onUndoButton() {
      const path = savedPaths.deleteLast();
      initialCanvas.draw();
      savedPaths.redrawAll();
      undoHistory.writeLast(path);
    }

    onRedoButton() {
      const path = undoHistory.deleteLast();
      savedPaths.writeLast(path);
      initialCanvas.draw();
      savedPaths.redrawAll();
    }
  }
}
