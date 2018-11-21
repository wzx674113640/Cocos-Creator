
var Init = require("Init");

cc.Class({
    extends: cc.Component,

    properties: {
       Btn: cc.Node,
       MenuBtn:cc.Node,
       ResultPanel: cc.Node,
       _IsBtning: true,
       
       SoundSprite: {
           type:cc.SpriteFrame,
           default:[]
       },

       SoundBtnSprite:cc.Sprite,
       _isfirst: true
    },

    onEnable()
    {
        var sound = cc.sys.localStorage.getItem("Sound");
        if(sound === ""|| sound == "1"|| sound == null)
        {
            this.SoundBtnSprite.spriteFrame = this.SoundSprite[0];
            if(this._isfirst)
            {
                Init.Instance.SoundControl(true);
                this._isfirst =false;
            }
        }
        else if(sound == "0")
        {
            this.SoundBtnSprite.spriteFrame = this.SoundSprite[1];
            if(this._isfirst)
            {
                Init.Instance.SoundControl(false);
                this._isfirst =false;
            }
        }
    },
    
    onLoad()
    {
        if(!CC_WECHATGAME)
            return;
        this.AdpativeUI();
    },

    AdpativeUI()
    {
        if(this.IsAdpative==undefined)
        {
            let sysInfo = window.wx.getSystemInfoSync();
            let width = sysInfo.screenWidth;
            let height = sysInfo.screenHeight;
            if(height/width>2)
            {
                this.MenuBtn.setPosition(-312,669);
            }
            this.IsAdpative = true;
        }
    },
 

    PauseGame(IsPause)
    {
        var UIgameing = Init.Instance.GetUINode("UIGameing");
        if(UIgameing!=null)
        {
            UIgameing.getComponent("GameContorl").IsPause = IsPause;
        }
        else
        {
            cc.log("空");
        }
    },

    ShowBtnsClick()
    {
       if(!this._IsBtning)
            return;
        this._IsBtning = false;
        this.scheduleOnce(function() {
            this._IsBtning = true;
        }, 0.5);
        if(Init.Instance.IsGameStata)
        {
            
            this.PauseGame(true);
            this.Btn.active = true;
            Init.Instance.SoundNode[0].play();
        }
            
        else
        {
            if(Init.Instance.IsGamingRank)
            {
                Init.Instance.ShowUIEndTwo();
                if(CC_WECHATGAME) 
                {
                    window.wx.postMessage({
                        messageType: 4,
                        MAIN_MENU_NUM: "x1"
                    });
                }
                Init.Instance.SoundNode[0].play();
                
            }
            else 
            {
                this.ReturnMianMenuClick();
                return;
            }
        }
        
    },

    //返回主页
    ReturnMianMenuClick()
    {
        Init.Instance.SoundNode[0].play();
        this.PauseGame(false);
        Init.Instance.closeAllTop();
        this.Btn.active = false;
        this.node.active = false;
        Init.Instance.ShowUIOnePage();
    },

    //关闭界面继续游戏
    CloseUIClick()
    {
        Init.Instance.SoundNode[0].play();
        this.PauseGame(false);
        this.Btn.active = false;
    },

    //重新开始
    BegainGameClick()
    {
        Init.Instance.SoundNode[0].play();
        this.PauseGame(false);  
        Init.Instance.closeAllTop();
        var UIgameing = Init.Instance.GetUINode("UIGameing");
        if(UIgameing!=null)
        {
            UIgameing.getComponent("GameContorl").clearAndGameStart();
        }
        else
        {
            cc.log("好玩游戏的场景为空！");
        }
        this.Btn.active = false;
    },

    SoundClick()
    {
        Init.Instance.SoundNode[0].play();
        var sound = cc.sys.localStorage.getItem("Sound");
       
        if(sound === ""|| sound == "1"|| sound == null)
        {
            Init.Instance.SoundControl(false);
            cc.sys.localStorage.setItem("Sound",0); 
            this.SoundBtnSprite.spriteFrame = this.SoundSprite[1];
        }
        else if(sound == "0")
        {
            Init.Instance.SoundControl(true);
            cc.sys.localStorage.setItem("Sound",1); 
            this.SoundBtnSprite.spriteFrame = this.SoundSprite[0];
        }
    },

    ResultClick()
    {
        Init.Instance.SoundNode[0].play();
        this.ResultPanel.active = true;
    },

    closeResult()
    {
        Init.Instance.SoundNode[0].play();
        this.ResultPanel.active = false;
    }
});
