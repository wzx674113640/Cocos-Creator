

cc.Class({
    extends: cc.Component,

    properties: {
        ImgHead:cc.Sprite,
        TxtScore:cc.Label,

        UINode:cc.Node,
        UIWinNode:cc.Node,
    },

    Clear()
    {
        this.UINode.active = false;
        this.UIWinNode.active = false;
    },

    init(data)
    {
        this.UINode.active = true;
        let avatarUrl = data.avatarUrl;
        let grade = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;
        this.createImage(avatarUrl);
        this.TxtScore.string = grade+"分";
    },
    
    createImage(avatarUrl) {
        let image = window.wx.createImage();
        console.log(image);
        var self = this;
        image.onload = function(){
            let texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            self.ImgHead.spriteFrame = new cc.SpriteFrame(texture);
        };
        console.log(avatarUrl);
        image.src = avatarUrl;
    } ,

    Win()
    {
        this.UIWinNode.active = true;
    }
});
