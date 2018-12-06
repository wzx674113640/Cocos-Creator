cc.Class({
    extends: cc.Component,
    name: "RankItem",
    properties: {
        rankLabel: cc.Label,
        avatarImgSprite: cc.Sprite,
        nickLabel: cc.Label,
        topScoreLabel: cc.Label,
        MySprite:cc.Node,
    },
    start() {

    },

    init: function (rank, data,IsBg = true) {
        let avatarUrl = data.avatarUrl;
        let nick = data.nickname.length <= 8 ? data.nickname : data.nickname.substr(0, 8) + "...";
        //let nick = data.nickname;
        let grade = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;

        this.rankLabel.string = (rank + 1).toString();

        var txtRanking = rank+1;

       
        switch(txtRanking)
        {
            case 1:
                this.rankLabel.node.color = new cc.Color(255, 234, 0, 255);
                break;
            case 2:
                this.rankLabel.node.color = new cc.Color(229, 64, 64, 255);
                break;
            case 3:
                this.rankLabel.node.color = new cc.Color(77, 191, 71, 255);
                break;
        }
        
        this.createImage(avatarUrl,this.avatarImgSprite);
        if(IsBg)
        {
            var bg = this.MySprite.getComponent(cc.Sprite);
            this.createImage("src/bg.png",bg);
            
            if(txtRanking%2==0)
            {
                this.MySprite.active = false;
            }
            else
            {
                this.MySprite.active = true;
            }
        }
        //this.loadImg(this.avatarImgSprite,avatarUrl);
        this.nickLabel.string = nick;
        this.topScoreLabel.string = grade.toString();
    },

    clear()
    {
        this.rankLabel.string = "";
        this.avatarImgSprite.node.active = false;
        this.nickLabel.string = "";
        this.topScoreLabel.string = "";
        this.MySprite.active = false;
    },


    createImage(avatarUrl,avatarImgSprite) {
        let image = window.wx.createImage();
        var self = this;
        image.onload = function(){
            let texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture);
            if(avatarImgSprite == self.avatarImgSprite)
                avatarImgSprite.node.active = true;
        };
        image.src = avatarUrl;
    } 
});
