


# ---------------------------------------------------
# 球
# ---------------------------------------------------
class Ball
  
  
  # -----------------------------------------------
  # コンストラクタ
  # -----------------------------------------------
  constructor: (id) ->
    
    @_id = id;
    
    @mesh;
    @_sphere;
    
    @_rotSpeed;
    @_posSpeed;
    @_offsetRange;
    @_offsetP = 1;
    
  
  
  
  # -----------------------------------------------
  # 初期化
  # -----------------------------------------------
  init: =>
    
    # コンテナ
    @mesh = new THREE.Object3D();
    
    # 球体作成
    radius = MY.u.random(20, 200) * 0.01;
    seg = MY.u.random(2, 8);
    @_sphere = new THREE.Mesh(
      new THREE.SphereGeometry(radius, seg, seg),
      new THREE.MeshBasicMaterial({
        color: MY.conf.COLOR[@_id % MY.conf.COLOR.length],
        wireframe: MY.u.hit(2),
        side: THREE.DoubleSide
      })
    );
    @mesh.add(@_sphere);
    @_getBoxOutPos();
    
    # 回転速度
    @_rotSpeed = new THREE.Vector3(
      MY.u.range(100) * 0.0005,
      MY.u.range(100) * 0.0005,
      MY.u.range(100) * 0.0005
    );
  
  
  
  
  # -----------------------------------------------
  # 更新
  # -----------------------------------------------
  update: =>
    
    # 回転
    @mesh.rotation.x += @_rotSpeed.x;
    @mesh.rotation.y += @_rotSpeed.y;
    @mesh.rotation.z += @_rotSpeed.z;
    
    # 移動
    @mesh.position.x += @_posSpeed.x;
    @mesh.position.y += @_posSpeed.y;
    @mesh.position.z += @_posSpeed.z;
    
    # オフセット
    radian = MY.u.radian(MY.update.cnt * @_offsetP);
    @_sphere.position.x = Math.sin(radian) * @_offsetRange.x;
    @_sphere.position.y = Math.cos(radian) * @_offsetRange.y;
    @_sphere.position.z = Math.sin(radian) * @_offsetRange.z;
    
    # 一定距離超えたらリセット
    d = new THREE.Vector3().distanceTo(@mesh.position);
    if d > MY.conf.WORLD_SIZE * 1.5
      @_getBoxOutPos();
  
  
  
  # -----------------------------------------------
  # 枠内のランダム値
  # -----------------------------------------------
  _getBoxInPos: =>
    
    return new THREE.Vector3(
      MY.u.range(MY.conf.WORLD_SIZE * 0.5),
      MY.u.range(MY.conf.WORLD_SIZE * 0.5),
      MY.u.range(MY.conf.WORLD_SIZE * 0.5)
    );
  
  
  
  # -----------------------------------------------
  # 枠外のランダム値
  # -----------------------------------------------
  _getBoxOutPos: =>
    
    # 初期値
    pos = new THREE.Vector3(
      MY.u.range(100) * 0.01,
      MY.u.range(100) * 0.01,
      MY.u.range(100) * 0.01
    );
    pos.normalize();
    pos.multiplyScalar(MY.conf.WORLD_SIZE);
    @mesh.position.set(pos.x, pos.y, pos.z);
    
    # 移動速度
    @_posSpeed = @_getBoxInPos();
    @_posSpeed.sub(pos);
    @_posSpeed.normalize();
    @_posSpeed.x *= MY.u.random(1, 100) * 0.001;
    @_posSpeed.y *= MY.u.random(1, 100) * 0.001;
    @_posSpeed.z *= MY.u.random(1, 100) * 0.001;
    
    # オフセット範囲
    @_offsetRange = new THREE.Vector3(
      MY.u.range(50) * 0.01,
      MY.u.range(50) * 0.01,
      MY.u.range(50) * 0.01
    );
    @_offsetP = MY.u.random(1, 50) * 0.001;


















module.exports = Ball;