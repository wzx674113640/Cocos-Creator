var Init = require("Init");

var WXRequ = require("WXRequ");

cc.Class({
    extends: cc.Component,

    properties: {
        CurScore: cc.Label,
        BestScore: cc.Label,
    },

    Res_Game()
    {
        this.UIgameing.getComponent("GameContorl").game_Resur();
        Init.Instance.closeAllTop();
    },

   
    ChangeFriend()
    {
        //Init.Instance.SoundNode[0].play();
        WXRequ.Instance.onShareBtn(
            ()=>{
                wx.showToast({
                    title: '分享成功',
                    icon: 'success',
                    duration: 800
                  })
            }
        );
    },


    GameNext()
    {
        Init.Instance.SoundNode[0].play();
        //跳转到游戏重新开始
        this.UIgameing.getComponent("GameContorl").game_Next();
        Init.Instance.closeAllTop();
    },

    ShowRank()
    {
        Init.Instance.SoundNode[0].play();
        Init.Instance.IsGamingRank = true;
        Init.Instance.ShowUIRanking();
        this.node.parent.parent.Rank.ShowChild(false);
    },


    onEnable()
    {
        if(!Init.Instance.IsEnbaleFunction)
            return;
        this.UIgameing = Init.Instance.GetUINode("UIGameing");
        this.CurScore.string = this.UIgameing.getComponent("GameContorl").curScore;
        this.node.parent.parent.Rank.ShowChild(false);
        this.BestScore.string = "历史最高"+  WXRequ.Instance.bestscore+ "分";
        
    },

    onDisable()
    {
        if(!Init.Instance.IsEnbaleFunction)
            return;
        this.node.parent.parent.Rank.HideChild();
    },
    
    start () {
       
    },

    // update (dt) {},
});
