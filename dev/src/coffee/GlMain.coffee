BallsView = require('./BallsView');


# ---------------------------------------------------
# WebGLエリア メインクラス
# ---------------------------------------------------
class GlMain
  
  
  # -----------------------------------------------
  # コンストラクタ
  # -----------------------------------------------
  constructor: ->
    
    # canvasのID
    @_cId = "xCanvas";
    
    # canvas
    @_c;
    
    # カメラ
    @_camera;
    
    # レンダラー
    @_renderer;
    @_effect;
    
    # コントローラー
    @_controls;
    
    # シーン
    @_scene;
    
    # 大枠
    @_box;
    @_boxWire;
    @_boxColor = [0xefefef, 0x000000];
    
    # 球体
    @_ball;
    
    @_clickCnt = MY.u.random(0, 4);
    
  
  
  
  
  # -----------------------------------------------
  # 初期化
  # -----------------------------------------------
  init: =>
    
    # canvas
    @_c = document.getElementById(@_cId);
    
    # カメラ
    @_camera = new THREE.PerspectiveCamera(45, 1, 1, 50000);
    
    # レンダラー
    @_renderer = new THREE.WebGLRenderer({
      antialias:false
    });
    if window.devicePixelRatio?
      @_renderer.setPixelRatio(window.devicePixelRatio);
    $("#" + @_cId).append(@_renderer.domElement);
    @_renderer.setClearColor(0xf7f7f7);
    @_effect = new THREE.StereoEffect(@_renderer);
    
    # シーン
    @_scene = new THREE.Scene();
    
    # 大枠
    @_setBox();
    
    # 球体
    @_ball = new BallsView(@_scene);
    @_ball.init();
    
    MY.resize.add(@_resize, true);
    MY.update.add(@_update);
    
    if MY.u.isSmt()
      window.addEventListener("deviceorientation", @_eDeviceorientation, true);
      $("body").on("touchstart", @_eClick);
    else
      @_controls = new THREE.OrbitControls(@_camera, @_renderer.domElement);
      @_controls.rotateUp(Math.PI / 4);
      @_controls.target.set(
        @_camera.position.x + 0.15,
        @_camera.position.y,
        @_camera.position.z
      );
      @_controls.noZoom = true;
      @_controls.noPan = true;
  
  
  
  # -----------------------------------
  # 
  # -----------------------------------
  _eClick: (e) =>
    
    @_clickCnt++;
    @_box.material.color.setHex(@_boxColor[@_clickCnt % @_boxColor.length]);
    @_box.material.needsUpdate = true;
  
  
  
  # -----------------------------------
  # 
  # -----------------------------------
  _eDeviceorientation: (e) =>
    
    if !e.alpha? then return;
    
    @_controls = new THREE.DeviceOrientationControls(@_camera, true);
    @_controls.connect();
    @_controls.update();
    
    window.removeEventListener("deviceorientation", @_eDeviceorientation, true);
  
  
  
  # -----------------------------------
  # resize
  # -----------------------------------
  _resize: (w, h) =>
    
    $("#" + @_cId).css({
      width:w,
      height:h
    });
    @_c.width = w;
    @_c.height = h;
    
    # 通常カメラのアスペクト比変更
    @_camera.aspect = w / h;
    @_camera.updateProjectionMatrix();
    
    # レンダラーのサイズ
    @_renderer.setSize(w, h);
    @_effect.setSize(w, h);
  
  
  
  # -----------------------------------
  # update
  # -----------------------------------
  _update: =>
    
    if @_controls? && MY.u.isSmt()
      @_controls.update();
    
    @_effect.render(@_scene, @_camera);
    
#     if MY.update.cnt % 240 == 0
#       @_eClick();
  
  
  
  # -----------------------------------------------
  # 大枠
  # -----------------------------------------------
  _setBox: =>
    
    size = MY.conf.WORLD_SIZE;
    seg = 8;
    
    @_box = new THREE.Mesh(
      new THREE.BoxGeometry(size, size, size, seg, seg, seg),
      new THREE.MeshBasicMaterial({
        wireframe:false,
        side:THREE.DoubleSide,
        color:@_boxColor[@_clickCnt % @_boxColor.length],
        transparent:true,
        opacity:1
      })
    );
    @_scene.add(@_box);
    
    @_boxWire = new THREE.Mesh(
      new THREE.BoxGeometry(size, size, size, seg, seg, seg),
      new THREE.MeshBasicMaterial({
        wireframe:true,
        side:THREE.DoubleSide,
        color:0x89898a,
        transparent:true,
        opacity:0.1
      })
    );
    @_scene.add(@_boxWire);
    s = 0.99;
    @_boxWire.scale.set(s, s, s);









module.exports = GlMain;