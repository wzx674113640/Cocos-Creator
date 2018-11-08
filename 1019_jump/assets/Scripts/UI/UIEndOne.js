

var Init = require("Init");

var WXRequ = require("WXRequ");

cc.Class({
    extends: cc.Component,

    properties: {
        CurScore: cc.Label,
        TimeLable:cc.Label,

        BtnShara:cc.Node,
        _IsBtnSee : true
    },
   

    Res_Game()
    {
        console.log("复活了！！");
        this.UIgameing.getComponent("GameContorl").game_Resur();
        Init.Instance.closeAllTop();
        this.UIgameing.getComponent("GameContorl").ScoreHideOrShow(true);
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
        if(!this._IsBtnSee) 
            return;
        Init.Instance.ShowPanelMask();
        this._IsBtnSee = false;
        Init.Instance.SoundNode[0].play();
        if(!CC_WECHATGAME)
            return;
            
        this.videoAd =wx.createRewardedVideoAd({
            adUnitId: 'adunit-e60bf6df6539d093'
        });
       
        this.videoAd.load().then(() => 
        {
            Init.Instance.HidePanelMask(1);
            this.isStop = true;
            this.videoAd.show()
        });

        //this.videoAd.show()
        //.catch(err => {this.videoAd.load().then(() => this.videoAd.show())})
        
        this.videoAd.onError(err => {
            console.log(err)
            this._IsBtnSee = true;
            Init.Instance.HidePanelMask(1);
        })

        this.videoAd.onClose(res => {
            this.videoAd.offClose();
            if (this.isStop&& res && res.isEnded || res === undefined) {
                this.isStop = false;
                wx.showToast({
                    title: '已复活',
                    icon: 'success',
                    duration: 800
                    })
                this.Res_Game();
            } 
            else {
                this.isStop = false;
            }
            this._IsBtnSee = true;
            //Init.Instance.HidePanelMask(1);
        })

      

        /*
        wx.showToast({
            title: '未接入',
            icon: 'success',
            duration: 2000
          })
        */
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

    onLoad()
    {
       this.isStop =  false; 
    },
    
    onEnable()
    {
        if(!Init.Instance.IsEnbaleFunction)
            return;
        console.log("是否开启" + WXRequ.Instance.is_open);
        var active  = WXRequ.Instance.is_open == 0? false:true;
        this.BtnShara.active = active;
        

        this.isStop = false;
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
            WXRequ.Instance.ShowOrHideAdervert(true);
        }
        
    },

    

    onDisable()
    {
        if(!Init.Instance.IsEnbaleFunction)
            return;
        Init.Instance.GetUINode("BtnOnePage").active = true;
        this.node.parent.parent.Rank.HideChild();
        if(CC_WECHATGAME)
            WXRequ.Instance.ShowOrHideAdervert(false);
    },


  
    update(dt)
    {
        if(this.isStop)
            return;
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
