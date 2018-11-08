
cc.Class({
    extends: cc.Component,

    properties: {
       MidRank: cc.Label,
       LeftRank: cc.Label,
       RightRank:cc.Label,

       MidScore: cc.Label,
       LeftScore: cc.Label,
       RightScore:cc.Label,

       MidImg: cc.Sprite,
       LeftImg: cc.Sprite,
       RightImg:cc.Sprite,

       MidNode: cc.Node,
       LeftNode:cc.Node,
       RightNode:cc.Node,
    },


    Clear()
    {
        this.MidNode.active = false;
        this.LeftNode.active = false;
        this.RightNode.active = false;
    },

    setSelf(rankNum,data)
    {
        this.MidNode.active = true;
        this.MidRank.string = "第"+rankNum+"名";
        let score  = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;
        this.MidScore.string =score+"分";
        this.createImage(data.avatarUrl,this.MidImg);                      
    },
    
    setLeft(rankNum,data)
    {
        this.LeftNode.active = true;
        this.LeftRank.string = "第"+rankNum+"名";
        let score  = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;
        this.LeftScore.string =score+"分";
        this.createImage(data.avatarUrl,this.LeftImg);                      
    },


    setRight(rankNum,data)
    {
        this.RightNode.active = true;
        this.RightRank.string = "第"+rankNum+"名";
        let score  = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;
        this.RightScore.string = score +"分";
        this.createImage(data.avatarUrl,this.RightImg);                      
    },

    createImage(avatarUrl,ImgHead) {
        let image = window.wx.createImage();
        image.onload = function(){
            let texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            ImgHead.spriteFrame = new cc.SpriteFrame(texture);
        };
        image.src = avatarUrl;
    } ,

});
