

# ------------------------------------
# 定数
# ------------------------------------
class Conf
  
  # ------------------------------------
  # コンストラクタ
  # ------------------------------------
  constructor: ->
    
    # 本番フラグ
    # -------------------------------
    @RELEASE = false;
    # -------------------------------
    
    # フラグ関連
    @FLG = {
      LOG:true,  # ログ出力
      PARAM:false, # パラメータチェック
      STATS:false  # Stats表示
    };
    
    # 本番フラグがtrueの場合、フラグ関連は全てfalseに
    if @RELEASE
      for key,val of @FLG
        @FLG[key] = false;
    
    # 空間サイズ
    @WORLD_SIZE = 50;
    
    # 色リスト
    @COLOR = [
      0x514482,
      0xed859c,
      0x2a95cc,
      0x97deee,
      0x298dc4,
      0xed859c,
      0xfec556,
      0xec432c
    ];














module.exports = Conf;
