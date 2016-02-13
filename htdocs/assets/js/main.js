(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Ball,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Ball = (function() {
  function Ball(id) {
    this._getBoxOutPos = bind(this._getBoxOutPos, this);
    this._getBoxInPos = bind(this._getBoxInPos, this);
    this.update = bind(this.update, this);
    this.init = bind(this.init, this);
    this._id = id;
    this.mesh;
    this._sphere;
    this._rotSpeed;
    this._posSpeed;
    this._offsetRange;
    this._offsetP = 1;
  }

  Ball.prototype.init = function() {
    var radius, seg;
    this.mesh = new THREE.Object3D();
    radius = MY.u.random(20, 200) * 0.01;
    seg = MY.u.random(2, 8);
    this._sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, seg, seg), new THREE.MeshBasicMaterial({
      color: MY.conf.COLOR[this._id % MY.conf.COLOR.length],
      wireframe: MY.u.hit(2),
      side: THREE.DoubleSide
    }));
    this.mesh.add(this._sphere);
    this._getBoxOutPos();
    return this._rotSpeed = new THREE.Vector3(MY.u.range(100) * 0.0005, MY.u.range(100) * 0.0005, MY.u.range(100) * 0.0005);
  };

  Ball.prototype.update = function() {
    var d, radian;
    this.mesh.rotation.x += this._rotSpeed.x;
    this.mesh.rotation.y += this._rotSpeed.y;
    this.mesh.rotation.z += this._rotSpeed.z;
    this.mesh.position.x += this._posSpeed.x;
    this.mesh.position.y += this._posSpeed.y;
    this.mesh.position.z += this._posSpeed.z;
    radian = MY.u.radian(MY.update.cnt * this._offsetP);
    this._sphere.position.x = Math.sin(radian) * this._offsetRange.x;
    this._sphere.position.y = Math.cos(radian) * this._offsetRange.y;
    this._sphere.position.z = Math.sin(radian) * this._offsetRange.z;
    d = new THREE.Vector3().distanceTo(this.mesh.position);
    if (d > MY.conf.WORLD_SIZE * 1.5) {
      return this._getBoxOutPos();
    }
  };

  Ball.prototype._getBoxInPos = function() {
    return new THREE.Vector3(MY.u.range(MY.conf.WORLD_SIZE * 0.5), MY.u.range(MY.conf.WORLD_SIZE * 0.5), MY.u.range(MY.conf.WORLD_SIZE * 0.5));
  };

  Ball.prototype._getBoxOutPos = function() {
    var pos;
    pos = new THREE.Vector3(MY.u.range(100) * 0.01, MY.u.range(100) * 0.01, MY.u.range(100) * 0.01);
    pos.normalize();
    pos.multiplyScalar(MY.conf.WORLD_SIZE);
    this.mesh.position.set(pos.x, pos.y, pos.z);
    this._posSpeed = this._getBoxInPos();
    this._posSpeed.sub(pos);
    this._posSpeed.normalize();
    this._posSpeed.x *= MY.u.random(1, 100) * 0.001;
    this._posSpeed.y *= MY.u.random(1, 100) * 0.001;
    this._posSpeed.z *= MY.u.random(1, 100) * 0.001;
    this._offsetRange = new THREE.Vector3(MY.u.range(50) * 0.01, MY.u.range(50) * 0.01, MY.u.range(50) * 0.01);
    return this._offsetP = MY.u.random(1, 50) * 0.001;
  };

  return Ball;

})();

module.exports = Ball;


},{}],2:[function(require,module,exports){
var Ball, BallsView,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Ball = require('./Ball');

BallsView = (function() {
  function BallsView(scene) {
    this._update = bind(this._update, this);
    this.init = bind(this.init, this);
    this._scene = scene;
    this._ball = [];
  }

  BallsView.prototype.init = function() {
    var ball, i, num;
    num = MY.conf.COLOR.length * 30;
    i = 0;
    while (i < num) {
      ball = new Ball(i);
      ball.init();
      this._scene.add(ball.mesh);
      this._ball.push(ball);
      i++;
    }
    return MY.update.add(this._update);
  };

  BallsView.prototype._update = function() {
    var i, j, len, ref, results, val;
    ref = this._ball;
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      val = ref[i];
      results.push(val.update());
    }
    return results;
  };

  return BallsView;

})();

module.exports = BallsView;


},{"./Ball":1}],3:[function(require,module,exports){
var Conf;

Conf = (function() {
  function Conf() {
    var key, ref, val;
    this.RELEASE = false;
    this.FLG = {
      LOG: true,
      PARAM: false,
      STATS: false
    };
    if (this.RELEASE) {
      ref = this.FLG;
      for (key in ref) {
        val = ref[key];
        this.FLG[key] = false;
      }
    }
    this.WORLD_SIZE = 50;
    this.COLOR = [0x514482, 0xed859c, 0x2a95cc, 0x97deee, 0x298dc4, 0xed859c, 0xfec556, 0xec432c];
  }

  return Conf;

})();

module.exports = Conf;


},{}],4:[function(require,module,exports){
var Contents, GlMain,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

GlMain = require('./GlMain');

Contents = (function() {
  function Contents() {
    this.init = bind(this.init, this);
    this._gl;
  }

  Contents.prototype.init = function() {
    this._gl = new GlMain();
    return this._gl.init();
  };

  return Contents;

})();

module.exports = Contents;


},{"./GlMain":6}],5:[function(require,module,exports){
var Func,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  slice = [].slice;

Func = (function() {
  function Func() {
    this.translateEq = bind(this.translateEq, this);
    this.translateGeoCoords = bind(this.translateGeoCoords, this);
    this.getGeoOfPostEffect = bind(this.getGeoOfPostEffect, this);
    this.getEqF = bind(this.getEqF, this);
    this.getEqV = bind(this.getEqV, this);
    this.o = bind(this.o, this);
    this.disposeMesh = bind(this.disposeMesh, this);
    this.getTex = bind(this.getTex, this);
    this.rendererTgOption = bind(this.rendererTgOption, this);
    this.earthSeg = bind(this.earthSeg, this);
    this.earthRadius = bind(this.earthRadius, this);
    this.getNearTexSize = bind(this.getNearTexSize, this);
    this.movRadius = bind(this.movRadius, this);
    this.movSize = bind(this.movSize, this);
    this.toMovVal = bind(this.toMovVal, this);
    this.eTexSize = bind(this.eTexSize, this);
    this.movH = bind(this.movH, this);
    this.movW = bind(this.movW, this);
    this.trackPageView = bind(this.trackPageView, this);
    this.log = bind(this.log, this);
  }

  Func.prototype.log = function() {
    var params;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    if (MY.conf.FLG.LOG) {
      if ((typeof console !== "undefined" && console !== null) && (console.log != null)) {
        return console.log.apply(console, params);
      }
    }
  };

  Func.prototype.trackPageView = function(url) {
    if (typeof ga !== "undefined" && ga !== null) {
      this.log("##################### trackPageView::", url);
      return ga('send', 'pageview', url);
    }
  };

  Func.prototype.movW = function() {
    return MY.conf.DEST_WIDTH * MY.conf.DEST_SCALE;
  };

  Func.prototype.movH = function() {
    return MY.conf.DEST_HEIGHT * MY.conf.DEST_SCALE;
  };

  Func.prototype.eTexSize = function() {
    return this.getNearTexSize(this.movW());
  };

  Func.prototype.toMovVal = function(val) {
    return MY.conf.DEST_SCALE * val;
  };

  Func.prototype.movSize = function() {
    return {
      w: this.movW(),
      h: this.movH()
    };
  };

  Func.prototype.movRadius = function() {
    return this.movW() / Math.PI / 2;
  };

  Func.prototype.getNearTexSize = function(size) {
    var i;
    i = 2;
    while (1) {
      if (i >= size) {
        return i;
      } else {
        i *= 2;
      }
    }
  };

  Func.prototype.earthRadius = function() {
    return 10;
  };

  Func.prototype.earthSeg = function() {
    return 64 * 2;
  };

  Func.prototype.rendererTgOption = function() {
    if (!MY.conf.DEST_MOVIE) {
      return {
        generateMipmaps: false,
        magFilter: THREE.LinearFilter,
        minFilter: THREE.LinearFilter,
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping
      };
    } else {
      return {
        generateMipmaps: false,
        magFilter: THREE.NearestFilter,
        minFilter: THREE.LinearFilter,
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping
      };
    }
  };

  Func.prototype.getTex = function(src, onLoad) {
    var tex;
    tex = THREE.ImageUtils.loadTexture(src, null, onLoad);
    tex.magFilter = THREE.LinearFilter;
    tex.minFilter = THREE.LinearMipMapLinearFilter;
    return tex;
  };

  Func.prototype.disposeMesh = function(mesh) {
    if (mesh.geometry != null) {
      mesh.geometry.dispose();
    }
    if (mesh.material != null) {
      return mesh.material.dispose();
    }
  };

  Func.prototype.o = function(o) {
    var res;
    res = o[MY.conf.ORG_PARAM_NAME];
    if (res == null) {
      o[MY.conf.ORG_PARAM_NAME] = {};
      res = o[MY.conf.ORG_PARAM_NAME];
    }
    return res;
  };

  Func.prototype.getEqV = function() {
    return document.getElementById("vConvertEq").textContent;
  };

  Func.prototype.getEqF = function() {
    return document.getElementById("fConvertEq").textContent;
  };

  Func.prototype.getGeoOfPostEffect = function(w, h) {
    var geo, index, pos, uv;
    geo = new THREE.BufferGeometry();
    geo.addAttribute('index', new THREE.BufferAttribute(new Uint16Array(3 * 2), 1));
    geo.addAttribute('position', new THREE.BufferAttribute(new Float32Array(3 * 4), 3));
    geo.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(2 * 4), 2));
    pos = geo.attributes.position.array;
    pos[0] = -w * 0.5;
    pos[1] = -h * 0.5;
    pos[2] = 0;
    pos[3] = w * 0.5;
    pos[4] = -h * 0.5;
    pos[5] = 0;
    pos[6] = w * 0.5;
    pos[7] = h * 0.5;
    pos[8] = 0;
    pos[9] = -w * 0.5;
    pos[10] = h * 0.5;
    pos[11] = 0;
    index = geo.attributes.index.array;
    index[0] = 0;
    index[1] = 1;
    index[2] = 2;
    index[3] = 0;
    index[4] = 2;
    index[5] = 3;
    uv = geo.attributes.uv.array;
    uv[0] = 0;
    uv[1] = 0;
    uv[2] = 1;
    uv[3] = 0;
    uv[4] = 1;
    uv[5] = 1;
    uv[6] = 0;
    uv[7] = 1;
    return geo;
  };

  Func.prototype.translateGeoCoords = function(latitude, longitude, radius) {
    var phi, theta, x, y, z;
    phi = latitude * Math.PI / 180;
    theta = (longitude - 180) * Math.PI / 180;
    x = -radius * Math.cos(phi) * Math.cos(theta);
    y = radius * Math.sin(phi);
    z = radius * Math.cos(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
  };

  Func.prototype.translateEq = function(latitude, longitude, radius) {
    var phi, theta, x, y;
    phi = latitude * Math.PI / 180;
    theta = longitude * Math.PI / 180;
    x = radius * theta + this.movW() * 0.5;
    y = -radius * phi + this.movH() * 0.5;
    return new THREE.Vector2(x, y);
  };

  return Func;

})();

module.exports = Func;


},{}],6:[function(require,module,exports){
var BallsView, GlMain,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

BallsView = require('./BallsView');

GlMain = (function() {
  function GlMain() {
    this._setBox = bind(this._setBox, this);
    this._update = bind(this._update, this);
    this._resize = bind(this._resize, this);
    this._eDeviceorientation = bind(this._eDeviceorientation, this);
    this._eClick = bind(this._eClick, this);
    this.init = bind(this.init, this);
    this._cId = "xCanvas";
    this._c;
    this._camera;
    this._renderer;
    this._effect;
    this._controls;
    this._scene;
    this._box;
    this._boxWire;
    this._boxColor = [0xefefef, 0x000000];
    this._ball;
    this._clickCnt = MY.u.random(0, 4);
  }

  GlMain.prototype.init = function() {
    this._c = document.getElementById(this._cId);
    this._camera = new THREE.PerspectiveCamera(45, 1, 1, 50000);
    this._renderer = new THREE.WebGLRenderer({
      antialias: false
    });
    if (window.devicePixelRatio != null) {
      this._renderer.setPixelRatio(window.devicePixelRatio);
    }
    $("#" + this._cId).append(this._renderer.domElement);
    this._renderer.setClearColor(0xf7f7f7);
    this._effect = new THREE.StereoEffect(this._renderer);
    this._scene = new THREE.Scene();
    this._setBox();
    this._ball = new BallsView(this._scene);
    this._ball.init();
    MY.resize.add(this._resize, true);
    MY.update.add(this._update);
    if (MY.u.isSmt()) {
      window.addEventListener("deviceorientation", this._eDeviceorientation, true);
      return $("body").on("touchstart", this._eClick);
    } else {
      this._controls = new THREE.OrbitControls(this._camera, this._renderer.domElement);
      this._controls.rotateUp(Math.PI / 4);
      this._controls.target.set(this._camera.position.x + 0.15, this._camera.position.y, this._camera.position.z);
      this._controls.noZoom = true;
      return this._controls.noPan = true;
    }
  };

  GlMain.prototype._eClick = function(e) {
    this._clickCnt++;
    this._box.material.color.setHex(this._boxColor[this._clickCnt % this._boxColor.length]);
    return this._box.material.needsUpdate = true;
  };

  GlMain.prototype._eDeviceorientation = function(e) {
    if (e.alpha == null) {
      return;
    }
    this._controls = new THREE.DeviceOrientationControls(this._camera, true);
    this._controls.connect();
    this._controls.update();
    return window.removeEventListener("deviceorientation", this._eDeviceorientation, true);
  };

  GlMain.prototype._resize = function(w, h) {
    $("#" + this._cId).css({
      width: w,
      height: h
    });
    this._c.width = w;
    this._c.height = h;
    this._camera.aspect = w / h;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(w, h);
    return this._effect.setSize(w, h);
  };

  GlMain.prototype._update = function() {
    if ((this._controls != null) && MY.u.isSmt()) {
      this._controls.update();
    }
    return this._effect.render(this._scene, this._camera);
  };

  GlMain.prototype._setBox = function() {
    var s, seg, size;
    size = MY.conf.WORLD_SIZE;
    seg = 8;
    this._box = new THREE.Mesh(new THREE.BoxGeometry(size, size, size, seg, seg, seg), new THREE.MeshBasicMaterial({
      wireframe: false,
      side: THREE.DoubleSide,
      color: this._boxColor[this._clickCnt % this._boxColor.length],
      transparent: true,
      opacity: 1
    }));
    this._scene.add(this._box);
    this._boxWire = new THREE.Mesh(new THREE.BoxGeometry(size, size, size, seg, seg, seg), new THREE.MeshBasicMaterial({
      wireframe: true,
      side: THREE.DoubleSide,
      color: 0x89898a,
      transparent: true,
      opacity: 0.1
    }));
    this._scene.add(this._boxWire);
    s = 0.99;
    return this._boxWire.scale.set(s, s, s);
  };

  return GlMain;

})();

module.exports = GlMain;


},{"./BallsView":2}],7:[function(require,module,exports){
var Conf, Contents, DelayMgr, Func, Main, Mouse, Param, Profiler, ResizeMgr, UpdateMgr, Utils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

UpdateMgr = require('./libs/mgr/UpdateMgr');

ResizeMgr = require('./libs/mgr/ResizeMgr');

DelayMgr = require('./libs/mgr/DelayMgr');

Utils = require('./libs/Utils');

Profiler = require('./Profiler');

Func = require('./Func');

Mouse = require('./Mouse');

Contents = require('./Contents');

Conf = require('./Conf');

Param = require('./Param');

Main = (function() {
  function Main() {
    this._update = bind(this._update, this);
    this.init = bind(this.init, this);
  }

  Main.prototype.init = function() {
    window.MY = {};
    MY.u = new Utils();
    MY.conf = new Conf();
    MY.update = new UpdateMgr();
    MY.update.add(this._update);
    MY.resize = new ResizeMgr();
    MY.delay = new DelayMgr();
    MY.mouse = new Mouse();
    MY.f = new Func();
    MY.profiler = new Profiler();
    MY.param = new Param();
    MY.c = new Contents();
    return MY.c.init();
  };

  Main.prototype._update = function() {
    return window.MY.delay.update();
  };

  return Main;

})();

$(window).ready((function(_this) {
  return function() {
    var app;
    app = new Main();
    app.init();
    return window.MY.main = app;
  };
})(this));


},{"./Conf":3,"./Contents":4,"./Func":5,"./Mouse":8,"./Param":9,"./Profiler":10,"./libs/Utils":11,"./libs/mgr/DelayMgr":13,"./libs/mgr/ResizeMgr":14,"./libs/mgr/UpdateMgr":15}],8:[function(require,module,exports){
var Mouse,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Mouse = (function() {
  function Mouse() {
    this.dist = bind(this.dist, this);
    this._eMouseMove = bind(this._eMouseMove, this);
    this._init = bind(this._init, this);
    this.x = 0;
    this.y = 0;
    this.oldX = 0;
    this.oldY = 0;
    this._init();
  }

  Mouse.prototype._init = function() {
    return $(window).on("mousemove", this._eMouseMove);
  };

  Mouse.prototype._eMouseMove = function(e) {
    this.oldX = this.x;
    this.oldY = this.y;
    this.x = e.clientX;
    return this.y = e.clientY;
  };

  Mouse.prototype.dist = function(tx, ty) {
    var dx, dy;
    dx = tx - this.x;
    dy = ty - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  return Mouse;

})();

module.exports = Mouse;


},{}],9:[function(require,module,exports){
var Param,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Param = (function() {
  function Param() {
    this.addCallBack = bind(this.addCallBack, this);
    this._callBack = bind(this._callBack, this);
    this._setGuiListen = bind(this._setGuiListen, this);
    this._setGuiBool = bind(this._setGuiBool, this);
    this._setGuiNum2 = bind(this._setGuiNum2, this);
    this._setGuiNum = bind(this._setGuiNum, this);
    this._init = bind(this._init, this);
    this._gui;
    this.frame = 0;
    this.movW = String(~~(MY.f.movW())) + "px";
    this.movH = String(~~(MY.f.movH())) + "px";
    this.maxMovW = "";
    this.maxMovH = "";
    this.dest = true;
    this.checkFrame = 0;
    this.callBack = {};
    this._init();
  }

  Param.prototype._init = function() {
    if (MY.conf.FLG.PARAM) {
      this._gui = new dat.GUI();
      this._setGuiListen("frame");
      this._setGuiListen("movW");
      this._setGuiListen("movH");
      this._setGuiListen("maxMovW");
      this._setGuiListen("maxMovH");
      this._setGuiBool("dest");
      if (MY.conf.MOVIE_CHECK) {
        return this._setGuiNum2("checkFrame", 0, MY.conf.SAVE_FRAME_NUM * (MY.conf.DEST_FPS / MY.conf.FPS) - 1, 1);
      }
    }
  };

  Param.prototype._setGuiNum = function(name, min, max, step) {
    return this._gui.add(this, name, min, max).step(step).onFinishChange((function(_this) {
      return function(e) {
        _this[name] = e;
        return _this._callBack(name);
      };
    })(this));
  };

  Param.prototype._setGuiNum2 = function(name, min, max, step) {
    return this._gui.add(this, name, min, max).step(step).onChange((function(_this) {
      return function(e) {
        _this[name] = e;
        return _this._callBack(name);
      };
    })(this));
  };

  Param.prototype._setGuiBool = function(name) {
    return this._gui.add(this, name).onFinishChange((function(_this) {
      return function(e) {
        _this[name] = e;
        return _this._callBack(name);
      };
    })(this));
  };

  Param.prototype._setGuiListen = function(name) {
    return this._gui.add(this, name).listen();
  };

  Param.prototype._callBack = function(name) {
    var i, j, len, ref, results, val;
    if (this.callBack[name] != null) {
      ref = this.callBack[name];
      results = [];
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        val = ref[i];
        if (val != null) {
          results.push(val());
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };

  Param.prototype.addCallBack = function(name, func) {
    if (this.callBack[name] == null) {
      this.callBack[name] = [];
    }
    return this.callBack[name].push(func);
  };

  return Param;

})();

module.exports = Param;


},{}],10:[function(require,module,exports){
var Profiler,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Profiler = (function() {
  function Profiler() {
    this._update = bind(this._update, this);
    this._init = bind(this._init, this);
    this._stats;
    this._init();
  }

  Profiler.prototype._init = function() {
    if (MY.conf.FLG.STATS) {
      this._stats = new Stats();
      this._stats.domElement.style.position = "fixed";
      this._stats.domElement.style.left = "0px";
      this._stats.domElement.style.bottom = "0px";
      document.body.appendChild(this._stats.domElement);
      return MY.update.add(this._update);
    }
  };

  Profiler.prototype._update = function() {
    if (this._stats != null) {
      return this._stats.update();
    }
  };

  return Profiler;

})();

module.exports = Profiler;


},{}],11:[function(require,module,exports){
var Utils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Utils = (function() {
  function Utils() {
    this.price = bind(this.price, this);
    this.getHexColor = bind(this.getHexColor, this);
    this.scrollTop = bind(this.scrollTop, this);
    this.windowHeight = bind(this.windowHeight, this);
    this.numStr = bind(this.numStr, this);
    this._A = Math.PI / 180;
  }

  Utils.prototype.random = function(min, max) {
    if (min < 0) {
      min--;
    }
    return ~~(Math.random() * ((max + 1) - min) + min);
  };

  Utils.prototype.hit = function(range) {
    return this.random(0, range - 1) === 0;
  };

  Utils.prototype.range = function(val) {
    return this.random(-val, val);
  };

  Utils.prototype.arrRand = function(arr) {
    return arr[this.random(0, arr.length - 1)];
  };

  Utils.prototype.map = function(num, resMin, resMax, baseMin, baseMax) {
    var p;
    if (num < baseMin) {
      return resMin;
    }
    if (num > baseMax) {
      return resMax;
    }
    p = (resMax - resMin) / (baseMax - baseMin);
    return ((num - baseMin) * p) + resMin;
  };

  Utils.prototype.radian = function(degree) {
    return degree * this._A;
  };

  Utils.prototype.degree = function(radian) {
    return radian / this._A;
  };

  Utils.prototype.decimal = function(num, n) {
    var i, pos;
    num = String(num);
    pos = num.indexOf(".");
    if (n === 0) {
      return num.split(".")[0];
    }
    if (pos === -1) {
      num += ".";
      i = 0;
      while (i < n) {
        num += "0";
        i++;
      }
      return num;
    }
    num = num.substr(0, pos) + num.substr(pos, n + 1);
    return num;
  };

  Utils.prototype.floor = function(num, min, max) {
    return Math.min(max, Math.max(num, min));
  };

  Utils.prototype.strReverse = function(str) {
    var i, len, res;
    res = "";
    len = str.length;
    i = 1;
    while (i <= len) {
      res += str.substr(-i, 1);
      i++;
    }
    return res;
  };

  Utils.prototype.shuffle = function(arr) {
    var i, j, k, results;
    i = arr.length;
    results = [];
    while (--i) {
      j = Math.floor(Math.random() * (i + 1));
      if (i === j) {
        continue;
      }
      k = arr[i];
      arr[i] = arr[j];
      results.push(arr[j] = k);
    }
    return results;
  };

  Utils.prototype.sliceNull = function(arr) {
    var i, l, len1, newArr, val;
    newArr = [];
    for (i = l = 0, len1 = arr.length; l < len1; i = ++l) {
      val = arr[i];
      if (val !== null) {
        newArr.push(val);
      }
    }
    return newArr;
  };

  Utils.prototype.replaceAll = function(val, org, dest) {
    return val.split(org).join(dest);
  };

  Utils.prototype.sort = function(arr, para, desc) {
    if (desc === void 0) {
      desc = false;
    }
    if (desc) {
      return arr.sort(function(a, b) {
        return b[para] - a[para];
      });
    } else {
      return arr.sort(function(a, b) {
        return a[para] - b[para];
      });
    }
  };

  Utils.prototype.unique = function() {
    return new Date().getTime();
  };

  Utils.prototype.numStr = function(num, keta) {
    var i, len, str;
    str = String(num);
    if (str.length >= keta) {
      return str;
    }
    len = keta - str.length;
    i = 0;
    while (i < len) {
      str = "0" + str;
      i++;
    }
    return str;
  };

  Utils.prototype.buttonMode = function(flg) {
    if (flg) {
      return $("body").css("cursor", "pointer");
    } else {
      return $("body").css("cursor", "default");
    }
  };

  Utils.prototype.getQuery = function(key) {
    var qs, regex;
    key = key.replace(/[€[]/, "€€€[").replace(/[€]]/, "€€€]");
    regex = new RegExp("[€€?&]" + key + "=([^&#]*)");
    qs = regex.exec(window.location.href);
    if (qs === null) {
      return "";
    } else {
      return qs[1];
    }
  };

  Utils.prototype.hash = function() {
    return location.hash.replace("#", "");
  };

  Utils.prototype.isSmt = function() {
    return navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0;
  };

  Utils.prototype.isAndroid = function() {
    var u;
    u = navigator.userAgent;
    return u.indexOf('BlackBerry') > 0 || u.indexOf('Android') > 0 || u.indexOf('Windows Phone') > 0;
  };

  Utils.prototype.isIos = function() {
    return navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPod') > 0;
  };

  Utils.prototype.isPs3 = function() {
    var u;
    u = navigator.userAgent;
    return u.indexOf('PLAYSTATION 3') > 0;
  };

  Utils.prototype.isVita = function() {
    var u;
    u = navigator.userAgent;
    return u.indexOf('PlayStation Vita') > 0;
  };

  Utils.prototype.isIe8Under = function() {
    var msie;
    msie = navigator.appVersion.toLowerCase();
    msie = msie.indexOf('msie') > -1 ? parseInt(msie.replace(/.*msie[ ]/, '').match(/^[0-9]+/)) : 0;
    return msie <= 8 && msie !== 0;
  };

  Utils.prototype.isIe9Under = function() {
    var msie;
    msie = navigator.appVersion.toLowerCase();
    msie = msie.indexOf('msie') > -1 ? parseInt(msie.replace(/.*msie[ ]/, '').match(/^[0-9]+/)) : 0;
    return msie <= 9 && msie !== 0;
  };

  Utils.prototype.isIe = function() {
    var ua;
    ua = window.navigator.userAgent.toLowerCase();
    return ua.indexOf('msie') !== -1 || ua.indexOf('trident/7') !== -1;
  };

  Utils.prototype.isIpad = function() {
    return navigator.userAgent.indexOf('iPad') > 0;
  };

  Utils.prototype.isTablet = function() {
    return this.isIpad() || (this.isAndroid() && navigator.userAgent.indexOf('Mobile') === -1);
  };

  Utils.prototype.isWin = function() {
    return navigator.platform.indexOf("Win") !== -1;
  };

  Utils.prototype.isChrome = function() {
    return navigator.userAgent.indexOf('Chrome') > 0;
  };

  Utils.prototype.isFF = function() {
    return window.navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
  };

  Utils.prototype.isIOSUiView = function() {
    var a;
    a = window.navigator.userAgent.toLowerCase();
    return (this.isIos() && a.indexOf('safari') === -1) || (this.isIos() && a.indexOf('crios') > 0) || (this.isIos() && a.indexOf('gsa') > 0);
  };

  Utils.prototype.getCookie = function(key) {
    var a, arr, i, l, len1, val;
    if (document.cookie === void 0 || document.cookie === null) {
      return null;
    }
    arr = document.cookie.split("; ");
    for (i = l = 0, len1 = arr.length; l < len1; i = ++l) {
      val = arr[i];
      a = val.split("=");
      if (a[0] === key) {
        return a[1];
      }
    }
    return null;
  };

  Utils.prototype.setCookie = function(key, val) {
    return document.cookie = key + "=" + val;
  };

  Utils.prototype.windowHeight = function() {
    return $(document).height();
  };

  Utils.prototype.scrollTop = function() {
    return Math.max($(window).scrollTop(), $(document).scrollTop());
  };

  Utils.prototype.getHexColor = function(r, g, b) {
    var str;
    str = (r << 16 | g << 8 | b).toString(16);
    return "#" + new Array(7 - str.length).join("0") + str;
  };

  Utils.prototype.price = function(num) {
    return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  };

  return Utils;

})();

module.exports = Utils;


},{}],12:[function(require,module,exports){
var BaseMgr, Utils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Utils = require('../Utils');

BaseMgr = (function() {
  function BaseMgr() {
    this._init = bind(this._init, this);
    this._u = new Utils();
  }

  BaseMgr.prototype._init = function() {};

  return BaseMgr;

})();

module.exports = BaseMgr;


},{"../Utils":11}],13:[function(require,module,exports){
var BaseMgr, DelayMgr,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseMgr = require('./BaseMgr');

DelayMgr = (function(superClass) {
  extend(DelayMgr, superClass);

  function DelayMgr() {
    this.update = bind(this.update, this);
    this._init = bind(this._init, this);
    DelayMgr.__super__.constructor.call(this);
    this._registFunc = [];
    this._init();
  }

  DelayMgr.prototype._init = function() {
    return DelayMgr.__super__._init.call(this);
  };

  DelayMgr.prototype.add = function(func, delay) {
    this._registFunc = this._sliceNull(this._registFunc);
    return this._registFunc.push({
      f: func,
      d: delay
    });
  };

  DelayMgr.prototype.remove = function(func) {
    var arr, i, j, len, ref, val;
    arr = [];
    ref = this._registFunc;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      val = ref[i];
      if (val.f !== func) {
        arr.push(val);
      }
    }
    return this._registFunc = arr;
  };

  DelayMgr.prototype.update = function() {
    var i, j, len, ref, results, val;
    ref = this._registFunc;
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      val = ref[i];
      if ((val != null) && --val.d <= 0) {
        val.f();
        results.push(this._registFunc[i] = null);
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  DelayMgr.prototype._sliceNull = function(arr) {
    var i, j, len, newArr, val;
    newArr = [];
    for (i = j = 0, len = arr.length; j < len; i = ++j) {
      val = arr[i];
      if (val !== null) {
        newArr.push(val);
      }
    }
    return newArr;
  };

  return DelayMgr;

})(BaseMgr);

module.exports = DelayMgr;


},{"./BaseMgr":12}],14:[function(require,module,exports){
var BaseMgr, ResizeMgr,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseMgr = require('./BaseMgr');

ResizeMgr = (function(superClass) {
  extend(ResizeMgr, superClass);

  function ResizeMgr() {
    this.sh = bind(this.sh, this);
    this.sw = bind(this.sw, this);
    this._setStageSize = bind(this._setStageSize, this);
    this._call = bind(this._call, this);
    this._eResize = bind(this._eResize, this);
    this.refresh = bind(this.refresh, this);
    this._init = bind(this._init, this);
    ResizeMgr.__super__.constructor.call(this);
    this._resizeList = [];
    this.ws = {
      w: 0,
      h: 0,
      oldW: -1,
      oldH: -1
    };
    this._t;
    this._init();
  }

  ResizeMgr.prototype._init = function() {
    ResizeMgr.__super__._init.call(this);
    $(window).bind("resize", this._eResize);
    return this._setStageSize();
  };

  ResizeMgr.prototype.add = function(func, isCall) {
    this._resizeList.push(func);
    if ((isCall != null) && isCall) {
      return func(this.ws.w, this.ws.h);
    }
  };

  ResizeMgr.prototype.remove = function(func) {
    var arr, i, j, len, ref, val;
    arr = [];
    ref = this._resizeList;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      val = ref[i];
      if (val !== func) {
        arr.push(val);
      }
    }
    return this._resizeList = arr;
  };

  ResizeMgr.prototype.refresh = function() {
    return this._eResize();
  };

  ResizeMgr.prototype._eResize = function(e) {
    var i, j, len, ref, val;
    this._setStageSize();
    if (this._t != null) {
      ref = this._t;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        val = ref[i];
        clearInterval(val);
      }
      this._t = null;
    }
    this._t = [];
    return this._t[0] = setTimeout(this._call, 200);
  };

  ResizeMgr.prototype._call = function() {
    var i, j, len, ref, results, val;
    ref = this._resizeList;
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      val = ref[i];
      results.push(val(this.ws.w, this.ws.h));
    }
    return results;
  };

  ResizeMgr.prototype._setStageSize = function() {
    var h, w;
    if (this._u.isSmt()) {
      w = window.innerWidth;
      h = window.innerHeight;
    } else {
      if (this._u.isIe8Under()) {
        w = $(window).width();
        h = $(window).height();
      } else {
        w = window.innerWidth;
        h = window.innerHeight;
      }
    }
    this.ws.oldW = this.ws.w;
    this.ws.oldH = this.ws.h;
    this.ws.w = w;
    return this.ws.h = h;
  };

  ResizeMgr.prototype.sw = function() {
    return this.ws.w;
  };

  ResizeMgr.prototype.sh = function() {
    return this.ws.h;
  };

  return ResizeMgr;

})(BaseMgr);

module.exports = ResizeMgr;


},{"./BaseMgr":12}],15:[function(require,module,exports){
var BaseMgr, UpdateMgr,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseMgr = require('./BaseMgr');

UpdateMgr = (function(superClass) {
  extend(UpdateMgr, superClass);

  function UpdateMgr(isRAF) {
    this._update = bind(this._update, this);
    this._init = bind(this._init, this);
    UpdateMgr.__super__.constructor.call(this);
    this.cnt = 0;
    this._isRAF = isRAF || true;
    this._updateList = [];
    this._init();
  }

  UpdateMgr.prototype._init = function() {
    var requestAnimationFrame;
    UpdateMgr.__super__._init.call(this);
    requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
    if (this._isRAF && (window.requestAnimationFrame != null)) {
      return window.requestAnimationFrame(this._update);
    } else {
      return setInterval(this._update, 1000 / 60);
    }
  };

  UpdateMgr.prototype.add = function(func) {
    return this._updateList.push(func);
  };

  UpdateMgr.prototype.remove = function(func) {
    var arr, i, j, len, ref, val;
    arr = [];
    ref = this._updateList;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      val = ref[i];
      if (val !== func) {
        arr.push(val);
      }
    }
    return this._updateList = arr;
  };

  UpdateMgr.prototype._update = function() {
    var i, j, len, ref, t, val;
    this.cnt++;
    ref = this._updateList;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      val = ref[i];
      if (val != null) {
        val();
      }
    }
    if (this._isRAF && (window.requestAnimationFrame != null)) {
      return t = window.requestAnimationFrame(this._update);
    }
  };

  return UpdateMgr;

})(BaseMgr);

module.exports = UpdateMgr;


},{"./BaseMgr":12}]},{},[7]);
