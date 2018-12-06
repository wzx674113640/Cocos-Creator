
cc.Class({
    extends: cc.Component,

    properties: {
        SkinPicList:
        {
            type:cc.SpriteFrame,
            default:[]
        },

        SkinStringList:
        {
            type:cc.String,
            default:[]
        },
        
        BoxSkinList:
        {
            type:cc.SpriteFrame,
            default:[]
        },

        BoxStringList:
        {
            type:cc.String,
            default:[]
        }
    },

    GetSkin(SkinID)
    {
        var skinSprite = this.SkinPicList[SkinID];
        var skinString = this.skinString[SkinID];
        return {mysprite:skinSprite,mystring,skinString};
    }


});
