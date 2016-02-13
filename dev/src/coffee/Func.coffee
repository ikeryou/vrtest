

# ---------------------------------------------------
# 共通関数
# ---------------------------------------------------
class Func
  
  
  # -----------------------------------------------
  # コンストラクタ
  # -----------------------------------------------
  constructor: ->
  
  
  
  
  
  # ------------------------------------
  # ログ
  # ------------------------------------
  log: (params...) =>
    
    if MY.conf.FLG.LOG
      if console? && console.log? then console.log(params...);
  
  
  
  # -----------------------------------
  # ページビューのトラッキング GA
  # -----------------------------------
  trackPageView: (url) =>
    
    if ga?
      @log("##################### trackPageView::", url);
      ga('send', 'pageview', url);
  
  
  
  # ------------------------------------
  # 映像サイズ 幅
  # ------------------------------------
  movW: =>
    
    return MY.conf.DEST_WIDTH * MY.conf.DEST_SCALE;
  
  
  
  # ------------------------------------
  # 映像サイズ 高さ
  # ------------------------------------
  movH: =>
    
    return MY.conf.DEST_HEIGHT * MY.conf.DEST_SCALE;
  
  
  
  # ------------------------------------
  # 球体テクスチャサイズ
  # ------------------------------------
  eTexSize: =>
    
    return @getNearTexSize(@movW());
  
  
  
  # ------------------------------------
  # 映像の縮小率を反映
  # ------------------------------------
  toMovVal: (val) =>
    
    return MY.conf.DEST_SCALE * val;
  
  
  
  # ------------------------------------
  # 映像サイズ 幅、高さ位
  # ------------------------------------
  movSize: =>
    
    return {
      w:@movW(),
      h:@movH()
    };
  
  
  
  # ------------------------------------
  # 映像サイズをもとにした球体の半径
  # ------------------------------------
  movRadius: =>
    
    return @movW() / Math.PI / 2;
    
  
  
  # ------------------------------------
  # 一番近いテクスチャサイズ
  # ------------------------------------
  getNearTexSize: (size) =>
    
    i = 2;
    while 1
      if i >= size
        return i;
      else
        i *= 2;
  
  
  
  # ------------------------------------
  # メインコンテンツ球体の半径
  # ------------------------------------
  earthRadius: =>
    
    return 10;
  
  
  
  # ------------------------------------
  # メインコンテンツ球体のセグメント数
  # ------------------------------------
  earthSeg: =>
    
    return 64 * 2;
  
  
  
  # ------------------------------------
  # アイコン用球体のセグメント数
  # ------------------------------------
#   iconSphereSeg: =>
#     
#     return 128 * 0.5;
  
  
  
  # ------------------------------------
  # オフスクリーンレンダラー用共通オプション
  # ------------------------------------
  rendererTgOption: =>
    
    if !MY.conf.DEST_MOVIE
      return {
        generateMipmaps: false,
        magFilter: THREE.LinearFilter,
        minFilter: THREE.LinearFilter,
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping
      };
    else
      return {
        generateMipmaps: false,
        magFilter: THREE.NearestFilter,
        minFilter: THREE.LinearFilter,
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping
      };
  
  
  
  # ------------------------------------
  # テクスチャオブジェクト作成
  # ------------------------------------
  getTex: (src, onLoad) =>
    
    tex = THREE.ImageUtils.loadTexture(src, null, onLoad);
    tex.magFilter = THREE.LinearFilter;
    tex.minFilter = THREE.LinearMipMapLinearFilter;
    return tex;
  
  
  
  # ------------------------------------
  # Meshの破棄
  # ------------------------------------
  disposeMesh: (mesh) =>
    
    if mesh.geometry?
      mesh.geometry.dispose();
    
    if mesh.material?
      mesh.material.dispose();
  
  
  
  # ------------------------------------
  # アプリ用オリジナルオブジェクト取得
  # ------------------------------------
  o: (o) =>
    
    res = o[MY.conf.ORG_PARAM_NAME];
    if !res?
      o[MY.conf.ORG_PARAM_NAME] = {};
      res = o[MY.conf.ORG_PARAM_NAME];
    
    return res;
  
  
  
  # ------------------------------------
  # 正距円筒図変換の頂点シェーダー取得
  # ------------------------------------
  getEqV: =>
    
    return document.getElementById("vConvertEq").textContent;
  
  
  
  # ------------------------------------
  # 正距円筒図変換のフラグメントシェーダー取得
  # ------------------------------------
  getEqF: =>
    
    return document.getElementById("fConvertEq").textContent;
  
  
  
  # ------------------------------------
  # ポストエフェクト用geometry取得
  # ------------------------------------
  getGeoOfPostEffect: (w, h) =>
    
    geo = new THREE.BufferGeometry();
    geo.addAttribute('index', new THREE.BufferAttribute(new Uint16Array(3 * 2), 1));    
    geo.addAttribute('position', new THREE.BufferAttribute(new Float32Array(3 * 4), 3));
    geo.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(2 * 4), 2));
    
    # 位置
    pos = geo.attributes.position.array;
    pos[0]  = -w * 0.5;
    pos[1]  = -h * 0.5;
    pos[2]  = 0;
    pos[3]  = w * 0.5;
    pos[4]  = -h * 0.5;
    pos[5]  = 0;
    pos[6]  = w * 0.5;
    pos[7]  = h * 0.5;
    pos[8]  = 0;
    pos[9]  = -w * 0.5;
    pos[10] = h * 0.5;
    pos[11] = 0;
    
    # 頂点インデックス
    index = geo.attributes.index.array;
    index[0] = 0;
    index[1] = 1;
    index[2] = 2;
    index[3] = 0;
    index[4] = 2;
    index[5] = 3;
    
    # UV
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
  
  
  
  # ------------------------------------
  # 緯度経度から地球上の座標を取得
  # ------------------------------------
  translateGeoCoords: (latitude, longitude, radius) =>
    
    phi = (latitude) * Math.PI / 180;
    theta = (longitude - 180) * Math.PI / 180;
   
    x = -(radius) * Math.cos(phi) * Math.cos(theta);
    y = (radius) * Math.sin(phi);
    z = (radius) * Math.cos(phi) * Math.sin(theta);
   
    return new THREE.Vector3(x, y, z);
  
  
  
  # ------------------------------------
  # 緯度経度から正距円筒図法上の座標を取得
  # ------------------------------------
  translateEq: (latitude, longitude, radius) =>
    
    phi = (latitude) * Math.PI / 180;
    theta = (longitude) * Math.PI / 180;
    
    x = radius * theta + @movW() * 0.5;
    y = -radius * phi + @movH() * 0.5;
    
    return new THREE.Vector2(x, y);

















module.exports = Func;