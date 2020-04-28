import 'https://cdn.jsdelivr.net/npm/simplex-noise@2.4.0/simplex-noise.js';
import perlin from 'https://cdn.jsdelivr.net/gh/mikechambers/es6-perlin-module/perlin.js';

import {math} from './math.js';

export const noise = (function() {

  class _PerlinWrapper {
    constructor() {
    }

    noise2D(x, y) {
      return perlin(x, y) * 2.0 - 1.0;
    }
  }

  class _RandomWrapper {
    constructor() {
      this._values = {};
    }

    _Rand(x, y) {
      const k = x + '.' + y;
      if (!(k in this._values)) {
        this._values[k] = Math.random() * 2 - 1;
      }
      return this._values[k];
    }

    noise2D(x, y) {
      // Bilinear filter
      const x1 = Math.floor(x);
      const y1 = Math.floor(y);
      const x2 = x1 + 1;
      const y2 = y1 + 1;
    
      const xp = x - x1;
      const yp = y - y1;
    
      const p11 = this._Rand(x1, y1);
      const p21 = this._Rand(x2, y1);
      const p12 = this._Rand(x1, y2);
      const p22 = this._Rand(x2, y2);
    
      const px1 = math.lerp(xp, p11, p21);
      const px2 = math.lerp(xp, p12, p22);
    
      return math.lerp(yp, px1, px2);
    }
  }

  class _NoiseGenerator {
    constructor(params) {
      this._params = params;
      this._Init();
    }

    _Init() {
      this._noise = {
        simplex: new SimplexNoise(this._params.seed),
        perlin: new _PerlinWrapper(),
        rand: new _RandomWrapper(),
      };
    }

    Get(x, y) {
      const xs = x / this._params.scale;
      const ys = y / this._params.scale;
      const noiseFunc = this._noise[this._params.noiseType];
      const G = 2.0 ** (-this._params.persistence);
      let amplitude = 1.0;
      let frequency = 1.0;
      let normalization = 0;
      let total = 0;
      for (let o = 0; o < this._params.octaves; o++) {
        const noiseValue = noiseFunc.noise2D(
            xs * frequency, ys * frequency) * 0.5 + 0.5;
        total += noiseValue * amplitude;
        normalization += amplitude;
        amplitude *= G;
        frequency *= this._params.lacunarity;
      }
      total /= normalization;
      return Math.pow(
          total, this._params.exponentiation) * this._params.height;
    }
  }

  return {
    Noise: _NoiseGenerator
  }
})();
