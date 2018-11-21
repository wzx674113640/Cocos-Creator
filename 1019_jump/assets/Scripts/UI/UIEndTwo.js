var Init = require("Init");

var WXRequ = require("WXRequ");

var Hint = require("Hint");
cc.Class({
    extends: cc.Component,

    properties: {
        CurScore: cc.Label,
        BestScore: cc.Label,

        UICoin:cc.Node,
        TXTCoin:cc.Label,
        ScaleUI:cc.Node,

        ImgCoin:cc.Node,
        rotateSpeed:0
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
        this.game = this.UIgameing.getComponent("GameContorl")
        this.game.ScoreHideOrShow(false);
        this.CurScore.string = this.game.curScore;
        this.node.parent.parent.Rank.ShowChild(false);
        this.BestScore.string = "历史最高"+  WXRequ.Instance.bestscore+ "分";
        this.TXTCoin.string = this.game.curCoin;
        if(this.game.curCoin>0)
        {
            Hint.Instance.Mask.active = true;
            Init.Instance.BtnOne.active = false;
            this.ShowCoinUI();
            Hint.Instance.Mask.active = false;
            //this.scheduleOnce(function() {
                
            //}, 0.2);
        }
        else
        {
            this.GetGold(0);
        }
    },

    ShowCoinUI()
    {
        this.scheduleOnce(function() {
            Init.Instance.node.Rank.HideChild();
        }, 0.01);
        this.UICoin.active = true;
        var Action = cc.scaleTo(0.2, 1, 1);
        this.ScaleUI.runAction(Action);
    },

    HideCoinUI()
    {
        var Action = cc.scaleTo(0.2, 0.1, 0.1);
        var self = this;
        var call =  cc.callFunc(function(){
            self.UICoin.active = false;
            Init.Instance.BtnOne.active = true;
            Init.Instance.node.Rank.ShowChild(false);
        });
        var seq = cc.sequence(Action,call);
        this.ScaleUI.runAction(seq);
    },

    getCount()
    {
        this.HideCoinUI();
        //获得金币
        this.GetGold(1);
    },

    GetGold(double)
    {
        try {
            if(CC_WECHATGAME)
            {
                var coin = this.game.curCoin * double;
                WXRequ.Instance.C2G_GameOver(coin,this.game.curScore,
                 ()=>
                 {
                     if(coin!=0)
                     {
                        Hint.Instance.ShowPop("获得"+ coin +"金币");
                     }
                     WXRequ.Instance.playInfo.coin += coin;
                 }
                 );
            }
            this.game.curCoin = 0;
        } 
        catch (error) 
        {
            console.error(error);
        }
    },

    getDoubleCount()
    {
        Init.Instance.ShowPanelMask();
        Init.Instance.SoundNode[0].play();
        if(!CC_WECHATGAME)
            return;
        this.videoAd = wx.createRewardedVideoAd({
            adUnitId: 'adunit-e60bf6df6539d093'
        });

        this.videoAd.load().then(() => 
        {
            Init.Instance.HidePanelMask(1);
            this.videoAd.show()
        });

        this.videoAd.onError(err => {
            console.log(err)
            this._IsBtnSee = true;
            Init.Instance.HidePanelMask(1);
        })

        this.videoAd.onClose(res => {
            this.videoAd.offClose();
            if (res && res.isEnded || res === undefined) {
                this.HideCoinUI();
                //获得双倍金币
                this.GetGold(2);
            } 
    })
    },

    onDisable()
    {
        if(!Init.Instance.IsEnbaleFunction)
            return;
        this.node.parent.parent.Rank.HideChild();
        if(CC_WECHATGAME)
        {
            WXRequ.Instance.ShowOrHideAdervert(false);
        }
    },
    
    start () {
       
    },

    update (dt) {
        this.ImgCoin.rotation+=dt*this.rotateSpeed;
    },
});
