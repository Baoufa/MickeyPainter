import Path from './Canvas/Path.js';

export default class Canvas {
  _currentPath;

  constructor(auth) {
    this._paths = [];
    this._deletedPaths = [];
    this._canvasElement = document.querySelector('canvas');
    this._ctx = this._canvasElement.getContext('2d');
    this._isDrawing = false;
    this._startCoord = [];
    this._auth = auth;

    this._color = 'rgb(0,0,0)';
    this._size = 5;

    this.init();
    this._canvasElement.addEventListener(
      'mousemove',
      this.updatePath.bind(this)
    );
    this._canvasElement.addEventListener(
      'mousedown',
      this.startPath.bind(this)
    );
    this._canvasElement.addEventListener('mouseup', this.endPath.bind(this));
    this._canvasElement.addEventListener('mouseout', this.endPath.bind(this));
  }

  get paths() {
    return this._paths;
  }

  get deletedPaths() {
    return this._deletedPaths;
  }

  get currentPath() {
    return this._currentPath;
  }

  get color() {
    return this._color;
  }

  set color(color) {
    this._color = color;
  }

  get size() {
    return this._size;
  }

  set size(size) {
    this._size = size;
  }

  get canvasElement() {
    return this._canvasElement;
  }

  init() {
    this._ctx.strokeStyle = 'black';
    this._ctx.lineWidth = 10;
    this._ctx.lineJoin = 'round';
    this._ctx.lineCap = 'round';
    this._ctx.fillStyle = 'white';
    this._ctx.fillRect(0, 0, 525, 525);
  }

  reset() {
    this.init();
    this._paths = [];
    this._deletedPaths = [];
    this._startCoord = [];
    this._color = 'rgb(0,0,0)';
    this._size = 5;
  }

  startPath(event) {
    this._isDrawing = true;
    this._deletedPaths = [];

    this._paths.push(new Path(this._ctx, this._color, this._size, null, null, []));
    this._startCoord = [event.offsetX, event.offsetY];
    let endCoord = this._startCoord;
    this._paths[this._paths.length - 1].addDots(this._startCoord, endCoord);
    this.draw(this._startCoord, endCoord);

    // FOR DOTS UPDATE
    //   if (this._auth.uid) {
    //     this._auth.sendPath(this._paths[this._paths.length - 1]);
    //  }
  }

  updatePath(event) {
    if (this._isDrawing) {
      let endCoord = [event.offsetX, event.offsetY];
      this._paths[this._paths.length - 1].addDots(this._startCoord, endCoord);
      this.draw(this._startCoord, endCoord);
      this._startCoord = endCoord;

      //FOR DOTS UPDATE
      // if (this._auth.uid) {
      //   this._auth.updatePath(this._paths[this._paths.length - 1]);
      // }
    }
  }

  endPath(event) {
    //FOR PATH UPDATE
    if (this._isDrawing) {
      if (this._auth.uid) {
        this._auth.sendPath(this._paths[this._paths.length - 1]);
      }
    }
    this._isDrawing = false;
  }

  draw(startCoord, endCoord) {
    this._ctx.beginPath();
    this._ctx.moveTo(...startCoord);
    this._ctx.lineTo(...endCoord);
    this._ctx.stroke();
  }

  eraseAll() {
    this._ctx.fillRect(0, 0, 525, 525);
    this._currentPath = new Path(this._ctx, 'rgb(255,255,255', 1000, null, null, []);
    this._deletedPaths = [];
    this._currentPath.addDots([262.2, 262.2], [262.2, 262.2]); // Canvas center coordinates
    this.draw([262.2, 262.2], [262.2, 262.2]);
    this._paths.push(this._currentPath);

    if (this._auth.uid) {
      this._auth.sendPaths(this._paths[this._paths.length - 1]);
    }
  }

  redrawAll() {
    this._ctx.fillStyle = 'white';
    this._ctx.fillRect(0, 0, 525, 525);
    for (let path of this._paths) {
      path.changeCtxStyle();
      for (let twoDots of path.twoDotsArray) {
        this.draw(...twoDots);
      }
    }
  }

  redrawAllFromDatabase(data) {
    let path = new Path(
      this._ctx,
      data.val()._color,
      data.val()._size,
      data.val()._timestamp,
      data.val()._twoDotsArray
    );
    this._paths.push(path);
    console.log(this._paths);

    path.changeCtxStyle();
    for (let twoDots of path.twoDotsArray) {
      this.draw(...twoDots);
    }
  }
}
