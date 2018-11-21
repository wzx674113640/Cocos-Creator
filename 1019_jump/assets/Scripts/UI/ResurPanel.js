
var WXRequ = require("WXRequ");
var Init = require("Init");

cc.Class({
    extends: require("BaseUIPop"),

    properties: {
        TxtCount: cc.Label,
    },

    onEnable()
    {
        WXRequ.Instance.C2G_GameInfo(false,()=>
        {
            this.TxtCount.string = WXRequ.Instance.playInfo.resurrectionCard;
        });
    },

    
    BtnShara()
    {
        WXRequ.Instance.onSharaResurtBtn();
    } 
});
