

# ---------------------------------------------------
# パラメータ管理
# ---------------------------------------------------
class Param
  
  
  # -----------------------------------------------
  # コンストラクタ
  # -----------------------------------------------
  constructor: ->
    
    @_gui;
    
    @frame = 0;
    @movW = String(~~(MY.f.movW())) + "px";
    @movH = String(~~(MY.f.movH())) + "px";
    @maxMovW = "";
    @maxMovH = "";
    
    @dest = true;
    
    @checkFrame = 0;
    
    
    
#     @grid_xNum = 50;
#     @grid_minY = 4;
#     @grid_maxY = 20;
#     
#     @iconStop = true;
#     
#     @mapUpdate = false;
#     
#     @area_num = 10;
    
    @callBack = {};
    
    
    @_init();
  
  
  
  # -----------------------------------------------
  # 初期化
  # -----------------------------------------------
  _init:  =>
    
    if MY.conf.FLG.PARAM
    
      @_gui = new dat.GUI();
      
      @_setGuiListen("frame");
      @_setGuiListen("movW");
      @_setGuiListen("movH");
      @_setGuiListen("maxMovW");
      @_setGuiListen("maxMovH");
      @_setGuiBool("dest");
      
      if MY.conf.MOVIE_CHECK
        @_setGuiNum2("checkFrame", 0, MY.conf.SAVE_FRAME_NUM * (MY.conf.DEST_FPS / MY.conf.FPS) - 1, 1);
  
  
  
  # -----------------------------------------------
  # 
  # -----------------------------------------------
  _setGuiNum: (name, min, max, step) =>
    
    @_gui.add(@, name, min, max).step(step).onFinishChange((e) =>
      @[name] = e;
      @_callBack(name);
    );
  
  
  
  # -----------------------------------------------
  # 
  # -----------------------------------------------
  _setGuiNum2: (name, min, max, step) =>
    
    @_gui.add(@, name, min, max).step(step).onChange((e) =>
      @[name] = e;
      @_callBack(name);
    );
  
  
  
  # -----------------------------------------------
  # 
  # -----------------------------------------------
  _setGuiBool: (name) =>
    
    @_gui.add(@, name).onFinishChange((e) =>
      @[name] = e;
      @_callBack(name);
    );
  
  
  
  # -----------------------------------------------
  # 
  # -----------------------------------------------
  _setGuiListen: (name) =>
    
    @_gui.add(@, name).listen();
  
  
  
  # -----------------------------------------------
  # コールバック実行
  # -----------------------------------------------
  _callBack: (name) =>
    
    if @callBack[name]?
      for val,i in @callBack[name]
        if val?
          val();
  
  
  
  # -----------------------------------------------
  # コールバック登録
  # -----------------------------------------------
  addCallBack: (name, func) =>
    
    if !@callBack[name]?
      @callBack[name] = [];
    
    @callBack[name].push(func);






module.exports = Param;