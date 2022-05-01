import Path from "./Path.js";

export default class Canvas {
    _currentPath;

  constructor(auth) {
    this._paths = [];
    this._deletedPaths = [];
    this._currentPath = null;
    this._isDrawing = false;
    this._startCoord = [];
    this._color = 'rgb(0,0,0)';
    this._size = 5;
    this._auth = auth;
    this._canvasElement = document.querySelector('canvas');
    this._ctx = this._canvasElement.getContext('2d');

    this._canvasElement.addEventListener('mousemove',this.updatePath.bind(this));
    this._canvasElement.addEventListener('mousedown', this.startPath.bind(this));
    this._canvasElement.addEventListener('mouseup', this.endPath.bind(this));
    this._canvasElement.addEventListener('mouseout', this.endPath.bind(this));

    this.init();
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

  init(){
    this._ctx.strokeStyle = 'black';
    this._ctx.lineWidth = 5;
    this._ctx.lineJoin = 'round';
    this._ctx.lineCap = 'round';
    this._ctx.fillStyle = 'white';
  }

  reset(){
    this._paths = [];
    this._deletedPaths = [];
    this._currentPath = null;
    this._startCoord = [];
    this._color = 'rgb(0,0,0)';
    this._size = 5;
    this._ctx.fillRect(0, 0, 525, 525);
  }

  startPath(event) {
    this._isDrawing = true;
    this._deletedPaths = [];
    this._currentPath = new Path(
      this._ctx,
      this._color,
      this._size,
      null, //timestamp
      this._auth.uid,
      []
    );
    // if connected let addOnChild listener add to paths array
    if (!this._auth.uid) {
      this._paths.push(this._currentPath);
    }

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

  endPath(event) {
    //FOR PATH UPDATE
    if (this._isDrawing) {
      if (this._auth.uid) {
        this._auth.sendPath(this._currentPath);
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
    this._currentPath = new Path(
      this._ctx,
      'rgb(255,255,255',
      1000,
      null,
      this._auth.uid,
      []
    );
    this._deletedPaths = [];
    this._currentPath.addDots([262.2, 262.2], [262.2, 262.2]); // Canvas center coordinates
    this.draw([262.2, 262.2], [262.2, 262.2]);

    if (this._auth.uid) {
      this._auth.sendPath(this._currentPath);
    } else {
      this._paths.push(this._currentPath); // if connected let AddOnchild listener push to paths array;
    }
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

  getOnlinePath(data){
    let onlinePath = new Path(
      this._ctx,
      data.val()._color,
      data.val()._size,
      data.val()._timestamp,
      data.val()._uid,
      data.val()._twoDotsArray
    );
    return onlinePath;
  }

  addToCreated(data) {
    let path = this.getOnlinePath(data);
    path.changeCtxStyle();
    for (let twoDots of path.twoDotsArray) {
      this.draw(...twoDots);
    }
    this._paths.push(path);
  }

  removedFromCreated(data){
    let onlinePath = this.getOnlinePath(data);
    let localPath = this._paths.find( path => path.timestamp === onlinePath._timestamp);
    let index =  this._paths.indexOf(localPath);
    this._paths.splice(index, 1);
    this.redrawAll();
  }

  removedFromDeleted(data){
    let onlinePath = this.getOnlinePath(data);
    let localPath = this._deletedPaths.find( path => path.timestamp === onlinePath._timestamp);
    let index =  this._deletedPaths.indexOf(localPath);
    this._deletedPaths.splice(index, 1);
    this.redrawAll();
  }

  addToDeleted(data){
    let onlinePath = this.getOnlinePath(data);
    this._deletedPaths.push(onlinePath);
  }
}
