Easing = require('./Easing')


# ---------------------------------------------------
# アニメーションクラス
# ---------------------------------------------------
class Animation
  
  
  # コンストラクタ
  # -----------------------------------------------
  constructor: ->
    
    @_cnt = 0;
    @_delay = 0;
    @_frame = 0;
    
    @_param;
    
    # コールバック
    @_onStart;
    @_onComplete;
    
    # フラグ
    @_isUpdate = false;
    @_isStart = false;
    @_isComplete = false;
    @_isSet = false;
    @_isCompleted = false;
    
    
    # 初期化
    @_init();
    
    
  # -----------------------------------
  # 初期化
  # -----------------------------------
  _init: =>
    
    
    
  # -----------------------------------
  # 破棄
  # -----------------------------------
  dispose: =>
    
    @reset();
  
  
  # -----------------------------------
  # リセット
  # -----------------------------------
  reset: =>
    
    @_isUpdate = false;
    @_isStart = false;
    @_isComplete = false;
    @_isSet = false;
    @_isCompleted = false;
    
    @_param = null;
    
    @_onStart = null;
    @_onComplete = null;
  
    
  # -----------------------------------
  # アニメーション設定
  # @param : {
  #  ターゲット:{from:開始値, to:終了値}...
  #  delay:遅延フレーム数 def..0
  #  frame:フレーム数
  #  ease:イージング名 def.."linear"
  #  onStart:開始時のコールバック
  #  onComplete:終了時のコールバック
  # }
  # -----------------------------------
  set: (param) =>
    
    # リセット
    @reset();
    
    if !param.ease? then param.ease = "linear";
    
    @_isSet = true;
    
    @_cnt = 0;
    @_delay = if !param.delay? then 0 else param.delay;
    @_frame = if !param.frame? then 0 else param.frame;
    
    @_onStart = param.onStart;
    @_onComplete = param.onComplete;
    
    @_param = {};
    for key,val of param
      if key != "delay" && key != "frame" && key != "onStart" && key != "onComplete" && key != "ease"
        
        val.val = val.from;
        
        # イージング
        val.easing = new Easing();
        val.easeMethod = val.easing[param.ease];
        val.t = 0;
        
        # 速度
        val.easeSpeed = 1 / @_frame;
        
        @_param[key] = val;
    
    
  
  # -----------------------------------
  # 開始
  # -----------------------------------
  start: =>
    
    @_isUpdate = true;
    
  
  # -----------------------------------
  # アニメーション開始されてるかどうか
  # -----------------------------------
  isStart: =>
    
    return @_isStart;
    
  
  # -----------------------------------
  # アニメーション終わってるかどうか
  # -----------------------------------
  isComplete: =>
    
    return @_isComplete;
    
    
  # -----------------------------------
  # アニメーションがセットされてるかどうか
  # -----------------------------------
  isSet: =>
    
    return @_isSet;
    
    
  # -----------------------------------
  # アニメーションが完了後に値を渡したかどうか
  # -----------------------------------
  isCompleted: =>
    
    return @_isCompleted;
  
  
  # -----------------------------------
  # 更新
  # -----------------------------------
  update: =>
    
    if !@_isUpdate then return;
    
    if !@_isComplete && ++@_cnt > @_delay
      
      if !@_isStart
        if @_onStart? then @_onStart();
        @_isStart = true;
      
      for key,val of @_param
        
        val.t += val.easeSpeed;
        rate = val.easeMethod(val.t, val.s);
        #console.log(rate);
        val.val = (val.from * (1 - rate)) + (val.to * rate);
        if val.t >= 1 then @_isComplete = true;
      
      if @_isComplete
        if @_onComplete? then @_onComplete();
  
  
  # -----------------------------------
  # 比率で更新
  # -----------------------------------
  rate: (r) =>
    
    r = @_floor(r, 0, 1);
    
    for key,val of @_param
      rate = val.easeMethod(r, val.s);
      val.val = (val.from * (1 - rate)) + (val.to * rate);
  
  
  # -----------------------------------
  # アニメーションさせた値を取得
  # -----------------------------------
  get: (key) =>
    
    if @_isComplete
      @_isCompleted = true;
    
    return if @_param? && @_param[key]? then @_param[key].val else 0;
  
  
  # -----------------------------------
  # 目標値を取得
  # -----------------------------------
  to: (key) =>
  
    return if @_param? && @_param[key]? then @_param[key].to else null;
  
  
  # 値を範囲内におさめる
  # -----------------------------------
  # @num : 値(Number)
  # @min : 最小値(Number)
  # @max : 最大値(Number)
  # -----------------------------------
  _floor: (num, min, max) ->
  
    return Math.min(max, Math.max(num, min));
  
  
  
  
  
  
  
  
  
  
  
  
  
  
module.exports = Animation;