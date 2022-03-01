import * as graphics from "./graphics.js";

export class Game {
  constructor() {
    this._Initialize();
  }

  _Initialize() {
    this._graphics = new graphics.Graphics(this);
    if (!this._graphics.Initialize()) {
      this._DisplayError("WebGL2 is not available.");
      return;
    }

    this._previousRAF = null;
    this._minFrameTime = 1.0 / 10.0;
    this._entities = {};

    this._OnInitialize();
    this._RAF();
  }

  _DisplayError(errorText) {
    const error = document.getElementById("error");
    error.innerText = errorText;
  }

  _RAF() {
    requestAnimationFrame((t) => {
      if (this._previousRAF === null) {
        this._previousRAF = t;
      }
      this._Render(t - this._previousRAF);
      this._previousRAF = t;
    });
  }

  _StepEntities(timeInSeconds) {
    for (let k in this._entities) {
      this._entities[k].Update(timeInSeconds);
    }
  }

  _Render(timeInMS) {
    const timeInSeconds = Math.min(timeInMS * 0.001, this._minFrameTime);

    this._OnStep(timeInSeconds);
    this._StepEntities(timeInSeconds);
    this._graphics.Render(timeInSeconds);

    this._RAF();
  }
}
