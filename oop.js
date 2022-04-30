
  // class Param {
  //   static setSize(lineWidth) {
  //     Canvas.ctx.lineWidth = lineWidth;
  //   }
  //   static setColor(strokeStyle) {
  //     Canvas.ctx.strokeStyle = strokeStyle;
  //   }
  // }

  // /////////////// BUTTONS /////////////////:
  // class ColorBtns {
  //   constructor() {
  //     this.elements = document.querySelectorAll('.btn--color');
  //     this.spans = document.querySelectorAll('span');
  //     this.addEvents();
  //   }
  //   addEvents() {
  //     this.elements.forEach((e) =>
  //       e.addEventListener('click', this.setColor.bind(e, this.spans)),
  //     );
  //   }
  //   setColor(spanElements) {
  //     let color = window.getComputedStyle(this).backgroundColor;
  //     Canvas.ctx.strokeStyle = color;
  //     spanElements.forEach((e) => (e.style.backgroundColor = color));
  //   }
  // }

  // class SizeBtns {
  //   constructor() {
  //     this.elements = document.querySelectorAll('.btn--size');
  //     this.addEvents();
  //   }
  //   addEvents() {
  //     this.elements.forEach((e) => {
  //       let span = e.querySelector('span');
  //       e.addEventListener('click', this.setSize.bind(span));
  //     });
  //   }
  //   setSize() {
  //     let size = parseInt(window.getComputedStyle(this).width);
  //     Canvas.ctx.lineWidth = size;
  //   }
  // }

  // class CmdBtns {
  //   constructor() {
  //     this.undoBtn = document.getElementById('undo');
  //     this.redoBtn = document.getElementById('redo');
  //   }
  // }

  // class Btns {
  //   constructor() {
  //     this.colorBtns = new ColorBtns();
  //     this.sizeBtns = new SizeBtns();
  //     this.cmdBtns = new CmdBtns();
  //   }
  // }

  // class LogEntry {
  //   constructor(type, data) {
  //     this.type = type;
  //     this.data = data;
  //     console.log(this.data);
  //   }
  // }

  // class Log {
  //   constructor() {
  //     this.data = [];
  //     this.undoData = [];
  //   }
  //   addToLog(entry) {
  //     if (entry) {
  //       this.data.push(entry);
  //       if (this.undoData) {
  //         this.undoData.pop();
  //       }
  //     }
  //   }

  //   removeFromLog(entry) {
  //     if (this.data) {
  //       this.data.pop();
  //       if (entry) {
  //         this.undoData.push(entry);
  //       }
  //     }
  //   }
  // }

  // //////////////////// CANVAS ///////////////

  // class StrokeData {
  //   constructor(startCoord, endCoord, color, width) {
  //     this.startCoord = startCoord;
  //     this.endCoord = endCoord;
  //     this.color = color;
  //     this.width = width;
  //   }

  //   draw() {
  //     Canvas.ctx.strokeStyle = this.color;
  //     Canvas.ctx.lineWidth = this.width;
  //     Canvas.ctx.beginPath();
  //     Canvas.ctx.moveTo(...this.startCoord);
  //     Canvas.ctx.lineTo(...this.endCoord);
  //     Canvas.ctx.stroke();
  //     Canvas.clickCoord = Canvas.liveCoord;
  //   }
  // }

  // class Canvas {
  //   static liveCoord = [];
  //   static clickCoord = [];
  //   static element = document.querySelector('canvas');
  //   static ctx = Canvas.element.getContext('2d');

  //   constructor() {
  //     this.isDrawing = false;
  //     this.pathData = [];
  //   }

  //   init() {
  //     Canvas.ctx.strokeStyle = 'black';
  //     Canvas.ctx.lineWidth = 10;
  //     Canvas.ctx.lineJoin = 'round';
  //     Canvas.ctx.lineCap = 'round';
  //     Canvas.ctx.fillStyle = 'white';
  //     Canvas.ctx.fillRect(0, 0, 500, 500);

  //     Canvas.element.addEventListener(
  //       'mousemove',
  //       this.getMouseCoord.bind(this),
  //     );
  //     Canvas.element.addEventListener(
  //       'mousedown',
  //       this.startUserAction.bind(this),
  //     );
  //     Canvas.element.addEventListener('mouseup', this.endUserAction.bind(this));
  //     Canvas.element.addEventListener(
  //       'mouseout',
  //       this.endUserAction.bind(this),
  //     );
  //   }

  //   getMouseCoord(event) {
  //     Canvas.liveCoord = [event.offsetX, event.offsetY];

  //     if (this.isDrawing) {
  //       this.drawPath();
  //     }
  //   }

  //   startUserAction(event) {
  //     this.isDrawing = true;
  //     Canvas.clickCoord = [event.offsetX, event.offsetY];
  //     this.drawPath();
  //   }

  //   endUserAction(event) {
  //     if (this.isDrawing) {
  //       this.isDrawing = false;
  //       const logEntry = new LogEntry('stroke', this.pathData);
  //     }
  //   }

  //   sayHello() {
  //     console.log('hello');
  //   }

  //   drawPath() {
  //     const strokeData = new StrokeData(
  //       Canvas.clickCoord,
  //       Canvas.liveCoord,
  //       Canvas.ctx.strokeStyle,
  //       Canvas.ctx.lineWidth,
  //     );

  //     this.pathData.push(strokeData);
  //     strokeData.draw();
  //   }
  // }

  ////////////////// APP INIT /////////////////

  import Painter from "./classes/Painter.js";  

  class App {
    static init() {
      const painter = new Painter();
    }
  }

  App.init();

