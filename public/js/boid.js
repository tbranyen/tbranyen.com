/**
 * Represents a Boid.
 *
 * @param {p5.Vector} inPos
 * @param {p5.Vector} inVel
 * @param {number} neighborhoodRadius 
 */
function Boid(inPos, inVel, neighborhoodRadius) {
  this.pos = new p5.Vector();
  this.vel = new p5.Vector(random(-1, 1), random(-1, 1), random(1, -1));
  this.acc = new p5.Vector(0, 0, 0);
  this.neighborhoodRadius = 100;

  // Vectors.
  this.ali = null;
  this.coh = null;
  this.sep = null;

  // Floats.
  this.maxSpeed = 0.1;
  this.maxSteerForce = 0.1;
  this.h = null;
  this.sc = 3;
  this.flap = 0;
  this.t = 0;

  // Booleans.
  this.avoidWalls = false;

  if (inPos)
    this.pos.set(inPos);

  if (inVel)
    this.vel.set(inVel);

  if (neighborhoodRadius != null)
    this.neighborhoodRadius = neighborhoodRadius;
}

Boid.prototype = {
  run: function(boidList) {
    this.t += 0.1; 
    this.flap = 10 * sin(this.t);

    if (this.avoidWalls) {
      this.acc.add(p5.Vector.mult(this.avoid(new p5.Vector(this.pos.x,height,this.pos.z),true),5));
      this.acc.add(p5.Vector.mult(this.avoid(new p5.Vector(this.pos.x,0,this.pos.z),true),5));
      this.acc.add(p5.Vector.mult(this.avoid(new p5.Vector(width,this.pos.y,this.pos.z),true),5));
      this.acc.add(p5.Vector.mult(this.avoid(new p5.Vector(0,this.pos.y,this.pos.z),true),5));
      this.acc.add(p5.Vector.mult(this.avoid(new p5.Vector(this.pos.x,this.pos.y,300),true),5));
      this.acc.add(p5.Vector.mult(this.avoid(new p5.Vector(this.pos.x,this.pos.y,900),true),5));
    }

    this.flock(boidList);
    this.move();
    this.checkBounds();
    this.render();
  },

  flock: function(boidList) {
    this.ali = this.alignment(boidList);
    this.coh = this.cohesion(boidList);
    this.sep = this.separation(boidList);

    this.acc.add(p5.Vector.mult(this.ali, 1));
    this.acc.add(p5.Vector.mult(this.coh, 3));
    this.acc.add(p5.Vector.mult(this.sep, 1));
  },

  move: function() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  },

  checkBounds: function() {
    if(this.pos.x>width) this.pos.x=0;
    if(this.pos.x<0) this.pos.x=width;
    if(this.pos.y>height) this.pos.y=0;
    if(this.pos.y<0) this.pos.y=height;
  },

  render: function() {
    push();
    translate(this.pos.x, this.pos.y);
    stroke(this.h);
    noFill();
    noStroke();
    fill(this.h);

    triangle(0, 0, 0, this.sc, this.sc, this.sc);

    //draw bird
    //beginShape(TRIANGLES);

    //vertex(3*this.sc,0,0);
    //vertex(-3*this.sc,2*this.sc,0);
    //vertex(-3*this.sc,-2*this.sc,0);
    // 
    ////vertex(3*this.sc,0,0);
    ////vertex(-3*this.sc,2*this.sc,0);
    ////vertex(-3*this.sc,0,2*this.sc);
    //// 
    ////vertex(3*this.sc,0,0);
    ////vertex(-3*this.sc,0,2*this.sc);
    ////vertex(-3*this.sc,-2*this.sc,0);
    // 
    ///* wings
    //vertex(2*sc,0,0);
    //vertex(-1*sc,0,0);
    //vertex(-1*sc,-8*sc,flap);
    // 
    //vertex(2*sc,0,0);
    //vertex(-1*sc,0,0);
    //vertex(-1*sc,8*sc,flap);
    //*/
    // 
    //vertex(-3*this.sc,0,2*this.sc);
    //vertex(-3*this.sc,2*this.sc,0);
    //vertex(-3*this.sc,-2*this.sc,0);
    //endShape();
    pop();
  },

  steer: function(target, arrival) {
    var steer = new p5.Vector();

    if (!arrival) {
      steer.set(p5.Vector.sub(target, this.pos));
      steer.limit(this.maxSteerForce);
    } else {
      var targetOffset = p5.Vector.sub(target, this.pos);
      var distance = targetOffset.mag();
      var rampedSpeed = this.maxSpeed*(distance/100);
      var clippedSpeed = min(rampedSpeed, this.maxSpeed);
      var desiredVelocity = p5.Vector.mult(targetOffset, (clippedSpeed/distance));
      steer.set(p5.Vector.sub(desiredVelocity, this.vel));
    }

    return steer;
  },

  avoid: function(target, weight) {
    var steer = new p5.Vector();
    steer.set(p5.Vector.sub(this.pos, target));

    //if (this.weight)
    //  steer.mult(1/sq(p5.Vector.dist(this.pos, target)));

    //steer.limit(maxSteerForce); //limits the steering force to maxSteerForce
    return steer;
  },

  separation: function(boidList) {
    var posSum = new p5.Vector(0, 0, 0);

    boidList.forEach(function(boid) {
      var d = p5.Vector.dist(this.pos, boid.pos);
      var repulse;

      if (d > 0 && d <= this.neighborhoodRadius) {
        repulse = p5.Vector.sub(this.pos, boid.pos);
        repulse.normalize();
        repulse.div(d);
        posSum.add(repulse);
      }
    }, this);

    return posSum;
  },

  alignment: function(boidList) {
    var velSum = new p5.Vector(0, 0, 0);
    var count = 0;

    boidList.forEach(function(boid) {
      var d = p5.Vector.dist(this.pos, boid.pos);

      if (d > 0 && d <= this.neighborhoodRadius) {
        velSum.add(boid.vel);
        count++;
      }
    }, this);

    if (count) {
      velSum.div(count);
      velSum.limit(this.maxSteerForce);
    }

    return velSum;
  },

  cohesion: function(boidList) {
    var posSum = new p5.Vector(0, 0, 0);
    var steer = new p5.Vector(0, 0, 0);
    var count = 0;

    boidList.forEach(function(boid) {
      var d = p5.Vector.dist(this.pos, boid.pos);

      if (d > 0 && d <= this.neighborhoodRadius) {
        posSum.add(boid.pos);
        count++;
      }
    }, this);

    if (count) {
      posSum.div(count);
    }

    steer = p5.Vector.sub(posSum, this.pos);
    steer.limit(this.maxSteerForce);

    return steer;
  },
};

/**
 * Flock
 *
 * @param number
 * @param hue
 * @return
 */
function Flock(number, hue) {
  this.h = hue;

  for (var i = 0; i < number; i++) {
    this.add(600);
  }
}

Flock.prototype = {
  add: function(neighborhoodRadius) {
    this.push(new Boid(new p5.Vector(width/2, height/2, neighborhoodRadius)));
  },

  run: function(avoidWalls) {
    this.forEach(function(boid) {
      var tempBoid = Object.create(boid);

      tempBoid.h = this.h;
      tempBoid.avoidWalls = avoidWalls;
      tempBoid.run(this);
    }, this);
  }
};

Flock.prototype.__proto__ = Array.prototype;

function setup() {
  this.width = window.innerWidth;
  this.height = window.innerHeight;
  this.initBoidNum = 100;
  this.smoothEdges = false;
  this.avoidWalls = true;
  this.flock = new Flock(this.initBoidNum, 0);

  createCanvas(this.width, this.height);
}

function draw() {
  clear();

  background(205);
  noFill();
  stroke(0);

  this.flock.run(this.avoidWalls);
  this.smoothEdges ? this.smooth() : this.noSmooth();
}
