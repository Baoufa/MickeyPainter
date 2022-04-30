import Path from "./Canvas/Path.js";

export default class Canvas {
    _currentPath;

  constructor() {
    this._paths = [];
    this._deletedPaths = [];
    this._canvasElement = document.querySelector('canvas');
    this._ctx = this._canvasElement.getContext('2d');
    this._isDrawing = false;
    this._startCoord = [];

    this._color = 'rgb(0,0,0)';
    this._size = 5;

    this._ctx.strokeStyle = 'black';
    this._ctx.lineWidth = 10;
    this._ctx.lineJoin = 'round';
    this._ctx.lineCap = 'round';
    this._ctx.fillStyle = 'white';
 
    this._canvasElement.addEventListener('mousemove',this.updatePath.bind(this));
    this._canvasElement.addEventListener('mousedown', this.startPath.bind(this));
    this._canvasElement.addEventListener('mouseup', this.endPath.bind(this));
    this._canvasElement.addEventListener('mouseout', this.endPath.bind(this));
  }


  get paths(){
    return this._paths;
  }

  get deletedPaths(){
    return this._deletedPaths;
  }

  get currentPath(){
    return this._currentPath;
  }

  get color(){
    return this._color;
  }

  set color(color) {
    this._color = color;
  }

  get size(){
    return this._size;
  }

  set size(size) {
    this._size = size
  }


  startPath(event) {
    this._isDrawing = true;
    this._deletedPaths = [];
    this._currentPath = new Path(this._ctx, this._color, this._size);
    
    this._startCoord = [event.offsetX, event.offsetY];
    let endCoord = this._startCoord;
    this._currentPath.addDots(this._startCoord, endCoord);
    this.draw(this._startCoord, endCoord);
  }

  updatePath(event) {
    if(this._isDrawing) {
      let endCoord = [event.offsetX, event.offsetY];
      this._currentPath.addDots(this._startCoord, endCoord);
      this.draw(this._startCoord, endCoord);
      this._startCoord = endCoord;
    }
  }

  endPath(event){
    if(this._isDrawing){
      this._paths.push(this._currentPath);
    }
    this._isDrawing = false;
  }

  draw(startCoord, endCoord) {
    this._ctx.beginPath();
    this._ctx.moveTo(...startCoord);
    this._ctx.lineTo(...endCoord);
    this._ctx.stroke();
  }

  eraseAll(){
    this._currentPath = new Path(this._ctx, 'rgb(255,255,255', 525);
    this._deletedPaths = [];
    this._currentPath.addDots([262.2, 262.2],[262.2, 262.2]); // Canvas center coordinates
    this.draw([262.2, 262.2],[262.2, 262.2]);
    this._paths.push(this._currentPath);
    console.log(this._paths);
  }

  redrawAll(){
    this._ctx.fillStyle = 'white';
    this._ctx.fillRect(0, 0, 525, 525);
    for(let path of this._paths){
      path.changeCtxStyle();
      for(let twoDots of path.twoDotsArray){
        this.draw(...twoDots);
      }
    }
  }
}
