(function() {
  "use strict";

  /**
   * Spread arguments over a constructor invocation.
   *
   * @param {Function} ctor - The constructor to invoke.
   * @return {Function} reusable function for invoking with arguments.
   */
  var spread = function(ctor) {
    return function(args) {
      return new ctor(args[0], args[1], args[2]);
    };
  }

  /**
   * Represents a Bird.
   * @constructor
   */
  function Bird() {
    var vertices = [
      [ 5,  0,  0],
      [-5, -2,  1],
      [-5,  0,  0],
      [-5, -2, -1],
      
      [ 0,  2, -6],
      [ 0,  2,  6],
      [ 2,  0,  0],
      [-3,  0,  0],
    ].map(spread(THREE.Vector3));

    var faces = [
      [ 0,  2,  1],
      [ 4,  7,  6],
      [ 5,  6,  7],
    ].map(spread(THREE.Face3));

    THREE.Geometry.call(this);

    this.vertices = this.vertices.concat(vertices);
    this.faces = this.faces.concat(faces);
    this.computeFaceNormals();
  }

  Bird.prototype.__proto__ = THREE.Geometry.prototype;

  this.Bird = Bird;
}).call(window);
