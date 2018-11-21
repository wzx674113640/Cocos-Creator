 var WXRequ = require("WXRequ");
 var Init = require("Init");

cc.Class({
    extends: require("BaseUIPop"),

    properties: {
        SkinSprite: cc.Sprite,
        ImgTX: cc.Node,
    },

    start () {
        this._super();
    },

    onEnable()
    {
        this.SkinSprite.spriteFrame = WXRequ.Instance.playInfo.activeSkin;
    },
    
    update(dt)
    {
        this.ImgTX.rotation += dt*10;
    }
});
