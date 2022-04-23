export function setInitialCanvas() {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.lineWidth = 10;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  return ctx;
}

export class Path {
  constructor(strokeStyle, lineWidth, startCoor, endCoor) {
    this.strokeStyle = strokeStyle;
    this.lineWidth = lineWidth;
    this.startCoor = startCoor;
    this.endCoor = endCoor;
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo([this.startCoor]);
    ctx.lineTo([this.endCoor]);
    ctx.stroke();
  }
}

export function drawInitialCanvas(ctx) {
  ctx.fillStyle = 'white';
  ctx.lineWidth = 10;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  ctx.fillRect(0, 0, 500, 500);

  const image = document.getElementById('source');

  image.addEventListener('load', (event) => {
    ctx.drawImage(image, 380, 365);
  });
}
