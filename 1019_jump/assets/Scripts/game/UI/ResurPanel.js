
var WXRequ = require("WXRequ");
var Init = require("Init");

cc.Class({
    extends: require("BaseUIPop"),

    properties: {
        TxtCount: cc.Label,
        BtnNode:cc.Node,
    },

    onEnable()
    {
        this.BtnNode.active = WXRequ.Instance.playInfo.is_status==0 ? false:true;
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
    } 
});
