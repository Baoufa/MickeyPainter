export default class Navigation {
  constructor(canvas, auth) {
    this._canvas = canvas;
    this._auth = auth;

    this._colorBtnElements = document.querySelectorAll('.btn--color');
    this._sizeBtnElements = document.querySelectorAll('.btn--size');
    this._undoBtnElement = document.getElementById('undo');
    this._redoBtnElement = document.getElementById('redo');
    this._eraseBtnElement = document.getElementById('erase');
    this._signBtnElement = document.getElementById('sign');
    this._downloadBtnElement = document.getElementById('download');
    this._connectBtnElement = document.querySelector('.connectbtn');
    this._backdropElement = document.querySelector('.backdrop');
    this._modalElement = document.querySelector('.modal-container');
    this._statusEl = document.querySelector('.status');

    this.addEventsOnColorBtns();
    this.addEventsOnSizeBtns();
    this._undoBtnElement.addEventListener('click', this.onUndo.bind(this));
    this._redoBtnElement.addEventListener('click', this.onRedo.bind(this));
    this._eraseBtnElement.addEventListener('click', this.onErase.bind(this));
    this._signBtnElement.addEventListener('click', this.toggleModal.bind(this));
    this._connectBtnElement.addEventListener('click', this.onSign.bind(this));
    this._backdropElement.addEventListener(
      'click',
      this.toggleModal.bind(this)
    );
    this._downloadBtnElement.addEventListener(
      'click',
      this.onDownload.bind(this)
    );
  }

  addEventsOnColorBtns() {
    for (let btn of this._colorBtnElements) {
      let rgb = getComputedStyle(btn).backgroundColor;
      btn.addEventListener('click', this.changeColor.bind(this, rgb));
    }
  }

  changeColor(rgb) {
    this._canvas.color = rgb;
    for (let btn of this._sizeBtnElements) {
      btn.querySelector('span').style.backgroundColor = rgb;
      btn.querySelector('span').style.border = 'none';

      if (rgb === 'rgb(255, 255, 255)') {
        btn.querySelector('span').style.border = '1px dotted #d1d8e0';
      }
    }
  }

  addEventsOnSizeBtns() {
    for (let btn of this._sizeBtnElements) {
      let size = parseInt(getComputedStyle(btn.querySelector('span')).width);
      btn.addEventListener('click', this.changeSize.bind(this, size));
    }
  }

  changeSize(int) {
    this._canvas.size = int;
  }

  onUndo() {
    if (this._canvas.paths.length > 0) {
      if (this._auth.uid) {
        this._auth.sendUndoPath(
          this._canvas.paths[this._canvas.paths.length - 1]
        );
      } else {
        this._canvas.deletedPaths.push(this._canvas.paths.pop());
        this._canvas.redrawAll();
      }
    }
  }

  onRedo() {
    if (this._canvas.deletedPaths.length > 0) {
      if (this._auth.uid) {
        this._auth.sendRedoPath(
          this._canvas.deletedPaths[this._canvas.deletedPaths.length - 1]
        );
      } else {
        this._canvas.paths.push(this._canvas.deletedPaths.pop());
        this._canvas.redrawAll();
      }
    }
  }

  onErase() {
    this._canvas.eraseAll();
  }

  onSign() {
    this._auth.auth().then(response => {
      this._signBtnElement.textContent = response;
      this.toggleModal();
      this._statusEl.textContent = 'Online';
      this._statusEl.style.color = '#26de81';

      this._canvas.reset();
      this._auth.initOnChildAdded(
        this._canvas.addToCreated.bind(this._canvas),
        this._canvas.addToDeleted.bind(this._canvas)
      );
      this._auth.initOnChildRemoved(
        this._canvas.removedFromCreated.bind(this._canvas),
        this._canvas.removedFromDeleted.bind(this._canvas)
      );
    });
  }

  toggleModal() {
    this._backdropElement.classList.toggle('visible');
    this._modalElement.classList.toggle('visible');
  }

  onDownload() {
    this._downloadBtnElement.download = 'myimage.png';
    this._downloadBtnElement.href = this._canvas._canvasElement.toDataURL();
  }
}
