
cc.Class({
    extends: cc.Component,

    properties: {
       
        TxtRanking:
        {
            type:cc.Label,
            default:null,
        },
        ImgHead:
        {
            type:cc.Sprite,
            default:null,
        },
        TxtName:
        {
            type:cc.Label,
            default:null,
        },
        TxtScore:
        {
            type:cc.Label,
            default:null,
        },
        
        MySprite:
        {
            type:cc.Node,
            default :null,
        }
    },
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
       
    },

    setInfo(txtRanking,imgHeadUrl,txtName,txtScore)
    {
        if(txtRanking%2==0)
        {
            this.MySprite.active = false;
        }
        this.TxtRanking.string= txtRanking;
        switch(txtRanking)
        {
            case 1:
                this.TxtRanking.node.color = new cc.Color(255, 234, 0, 255);
                break;
            case 2:
                this.TxtRanking.node.color = new cc.Color(229, 64, 64, 255);
                break;
            case 3:
                this.TxtRanking.node.color = new cc.Color(77, 191, 71, 255);
                break;
        }
        let nick = txtName.length <= 8 ? txtName : txtName.substr(0, 8) + "...";
        this.TxtName.string = nick;
        this.TxtScore.string = txtScore;
        this.createImage(imgHeadUrl);
    },

    createImage(avatarUrl) {
        let image = window.wx.createImage();
        var self = this;
        image.onload = function(){
            let texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            self.ImgHead.spriteFrame = new cc.SpriteFrame(texture);
        };
        image.src = avatarUrl;
    } ,

    loadImg: function(ImgHead,url){
        cc.loader.load(url, function (err, texture) {
            var sprite  = new cc.SpriteFrame(texture);
            ImgHead.spriteFrame = sprite;
        });
    }
    
    // update (dt) {},
});
