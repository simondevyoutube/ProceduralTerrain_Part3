import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';


export const quadtree = (function() {

  const _MIN_NODE_SIZE = 500;

  class QuadTree {
    constructor(params) {
      const b = new THREE.Box2(params.min, params.max);
      this._root = {
        bounds: b,
        children: [],
        center: b.getCenter(new THREE.Vector2()),
        size: b.getSize(new THREE.Vector2()),
      };
    }

    GetChildren() {
      const children = [];
      this._GetChildren(this._root, children);
      return children;
    }

    _GetChildren(node, target) {
      if (node.children.length == 0) {
        target.push(node);
        return;
      }

      for (let c of node.children) {
        this._GetChildren(c, target);
      }
    }

    Insert(pos) {
      this._Insert(this._root, new THREE.Vector2(pos.x, pos.z));
    }

    _Insert(child, pos) {
      const distToChild = this._DistanceToChild(child, pos);

      if (distToChild < child.size.x && child.size.x > _MIN_NODE_SIZE) {
        child.children = this._CreateChildren(child);

        for (let c of child.children) {
          this._Insert(c, pos);
        }
      }
    }

    _DistanceToChild(child, pos) {
      return child.center.distanceTo(pos);
    }

    _CreateChildren(child) {
      const midpoint = child.bounds.getCenter(new THREE.Vector2());

      // Bottom left
      const b1 = new THREE.Box2(child.bounds.min, midpoint);

      // Bottom right
      const b2 = new THREE.Box2(
        new THREE.Vector2(midpoint.x, child.bounds.min.y),
        new THREE.Vector2(child.bounds.max.x, midpoint.y));

      // Top left
      const b3 = new THREE.Box2(
        new THREE.Vector2(child.bounds.min.x, midpoint.y),
        new THREE.Vector2(midpoint.x, child.bounds.max.y));

      // Top right
      const b4 = new THREE.Box2(midpoint, child.bounds.max);

      const children = [b1, b2, b3, b4].map(
          b => {
            return {
              bounds: b,
              children: [],
              center: b.getCenter(new THREE.Vector2()),
              size: b.getSize(new THREE.Vector2())
            };
          });

      return children;
    }
  }

  return {
    QuadTree: QuadTree
  }
})();
