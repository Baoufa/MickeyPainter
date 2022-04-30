//import TwoDots from "./TwoDots.js";

export default class Path {
  constructor(ctx, color, size, timestamp, uid, twoDotsArray) {
    this._twoDotsArray = twoDotsArray;
    this._color = color;
    this._size = size;
    this._ctx = ctx;
    this._timestamp = timestamp ? timestamp : Date.now();
    this._uid = uid;
    this.changeCtxStyle()
  }

  get timestamp() {
    return this._timestamp;
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

  get twoDotsArray(){
    return this._twoDotsArray;
  }

  changeCtxStyle(){
    this._ctx.strokeStyle = this._color;
    this._ctx.lineWidth = this._size;
  }

  addDots(startCoord, endCoord) {
    //let twoDots = new TwoDots(startCoord,endCoord);
    let twoDots = [startCoord, endCoord];
    this._twoDotsArray.push(twoDots);
  }
}
