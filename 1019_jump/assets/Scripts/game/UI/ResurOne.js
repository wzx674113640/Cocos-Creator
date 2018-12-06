
var WXRequ = require("WXRequ");
//var Init = require("Init");
var Hint = require("Hint");
cc.Class({
    extends: cc.Component,

    properties: {
        TxtCount: cc.Label,
        BtnNode: cc.Node
    },

    start()
    {
        this.endOne = this.node.parent.getComponent("UIEndOne");
    },

    onEnable()
    {
        this.BtnNode.active = WXRequ.Instance.playInfo.is_status == 0 ? false:true;

        try 
        {
            WXRequ.Instance.C2G_GameInfo(false,()=>
            {
                this.TxtCount.string = WXRequ.Instance.playInfo.resurrectionCard;
            });
        } 
        catch (error)
        {
            console.error(error);
        }

    },

    BtnShara()
    {
        WXRequ.Instance.onSharaResurtBtn();
    }, 
//复活
    BtnResurt()
    {
        try {
            if(WXRequ.Instance.playInfo.resurrectionCard>0)
            {
                WXRequ.Instance.C2G_UseCard(()=>
                {
                    this.closeBtn();
                    
                    this.endOne.Res_Game();
                    WXRequ.Instance.playInfo.resurrectionCard --;
                    Hint.Instance.ShowPop("复活成功!");
                });
            }
            else
            {
                Hint.Instance.ShowFail("复活卡不足");
            }
        } 
        catch (error)
        {
            console.error(error);
        }
       
    },

    closeBtn()
    {
        this.endOne.MianUI.active = true;
        this.endOne.ResurPanel.active = false;
        this.endOne.isStop = false;
    }
});
