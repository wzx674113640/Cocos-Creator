

var Init = require("Init");

var WXRequ = require("WXRequ");

cc.Class({
    extends: cc.Component,

    properties: {
        CurScore: cc.Label,
        TimeLable:cc.Label,
    },

    Res_Game()
    {
        this.UIgameing.getComponent("GameContorl").game_Resur();
        Init.Instance.closeAllTop();
    },

    AskFriendClick()
    {
        //Init.Instance.SoundNode[0].play();
        WXRequ.Instance.onShareBtn(
            ()=>{
                wx.showToast({
                    title: '已复活',
                    icon: 'success',
                    duration: 800
                  })
                  this.Res_Game();
            }
        );
    
    },

    SeeVedioClick()
    {
        Init.Instance.SoundNode[0].play();
        wx.showToast({
            title: '未接入',
            icon: 'success',
            duration: 2000
          })
    },

    SkipUIClick()
    {
        Init.Instance.SoundNode[0].play();
        //跳转到第二个UI界面
        Init.Instance.ShowUIEndTwo();
        //关闭开放域画布
        if(CC_WECHATGAME)
        {
            window.wx.postMessage({
                messageType: 4,
                MAIN_MENU_NUM: "x1"
            });
        }
    },

    onEnable()
    {
        if(!Init.Instance.IsEnbaleFunction)
            return;
        Init.Instance.GetUINode("BtnOnePage").active = false;
        this.timeOnce = 1;
        this.StartTime = 12;
        this.TimeLable.string = this.StartTime+"S";
        this.node.parent.parent.Rank.ShowChild(false);
        this.UIgameing = Init.Instance.GetUINode("UIGameing");
        this.UIgameing.getComponent("GameContorl").ScoreHideOrShow(false);
        var bestScore = this.UIgameing.getComponent("GameContorl").curScore;;
        this.CurScore.string = bestScore;
        if(CC_WECHATGAME)
        {
            if( bestScore > WXRequ.Instance.bestscore)
            {
                WXRequ.Instance.bestscore = bestScore;
            }
        }
        
    },

    

    onDisable()
    {
        if(!Init.Instance.IsEnbaleFunction)
            return;
        Init.Instance.GetUINode("BtnOnePage").active = true;
        this.node.parent.parent.Rank.HideChild();
    },

  
    update(dt)
    {
        this.timeOnce -=dt;
        if(this.timeOnce <=0)
        {
            this.timeOnce = 1;
            this.StartTime--;
            this.TimeLable.string = this.StartTime+"S";
            if(this.StartTime <= 0)
            {
                this.SkipUIClick();
            }
        }
    }

});
