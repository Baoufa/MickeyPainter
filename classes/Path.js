export default class Path {
  constructor(ctx, color, size, timestamp, uid, twoDotsArray) {
    this._twoDotsArray = [];
    this._color = color;
    this._size = size;
    this._timestamp = timestamp !== null ? timestamp : Date.now();
    this._uid = uid;
    this._twoDotsArray = twoDotsArray;
    this._ctx = ctx;
    this.changeCtxStyle();
  }

  get color() {
    return this._color;
  }

  set color(rgb) {
    this._color = rgb;
    this._ctx.strokeStyle = rgb;
  }

  get size() {
    return this._size;
  }

  set size(size) {
    this._size = size;
    this._ctx.lineWidth = size;
  }

  get timestamp(){
    return this._timestamp;
  }

  get uid(){
    return this._uid;
  }

  get twoDotsArray(){
    return this._twoDotsArray;
  }

  changeCtxStyle(){
    this._ctx.strokeStyle = this._color;
    this._ctx.lineWidth = this._size;
  }

  addDots(startCoord, endCoord) {
    let twoDots = [startCoord, endCoord];
    this._twoDotsArray.push(twoDots);
  }
}
