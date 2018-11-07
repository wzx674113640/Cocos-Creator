
var Init = require("Init");

cc.Class({
    extends: cc.Component,

    properties: {
       Btn: cc.Node,
       MenuBtn:cc.Node,
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
       
        if(Init.Instance.IsGameStata)
        {
            
            this.PauseGame(true);
            this.Btn.active = true;
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
                Init.Instance.IsGamingRank = false;
            }
            else
            {
                this.ReturnMianMenuClick();
                return;
            }
        }
        Init.Instance.SoundNode[0].play();
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
    }

});
