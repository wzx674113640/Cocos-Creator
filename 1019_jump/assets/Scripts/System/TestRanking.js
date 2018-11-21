
var Init = require("Init");

cc.Class({
    extends: cc.Component,
    name: "RankingView",
  
    properties: {
        //groupFriendButton: cc.Node,
        //friendButton: cc.Node,
        //gameOverButton: cc.Node,
        rankingScrollView: cc.Sprite,//显示排行榜
        isShow : false,
    },

    onEnable()
    {
        this.node.Rank = this;
    },
    
    onLoad() {
    },
    start() {
        if(!CC_WECHATGAME)
            return;
        window.wx.showShareMenu({withShareTicket: true});//设置分享按钮，方便获取群id展示群排行榜
        this.tex = new cc.Texture2D();
        window.sharedCanvas.width = 750;
        window.sharedCanvas.height = 1334;
         /*window.wx.postMessage({
            messageType: 1,
            MAIN_MENU_NUM: "x1"
        });*/
    },
    friendButtonFunc(event) {
        window.wx.postMessage({
            messageType: 1,
            MAIN_MENU_NUM: "x1"
        });
    },

    groupFriendButtonFunc: function (event) {
        window.wx.shareAppMessage({
            success: (res) => {
                if (res.shareTickets != undefined && res.shareTickets.length > 0) {
                    window.wx.postMessage({
                        messageType: 5,
                        MAIN_MENU_NUM: "x1",
                        shareTicket: res.shareTickets[0]
                    });
                }
            }
        });
    },

    gameOverButtonFunc: function (event) {
        
        window.wx.postMessage({// 发消息给子域
            messageType: 4,
            MAIN_MENU_NUM: "x1"
        });
    
    },

    submitScoreButtonFunc(curscore){
        if(!CC_WECHATGAME)
            return;
        //console.log("提交分...");
        let score = curscore;
        window.wx.postMessage({
            messageType: 3,
            MAIN_MENU_NUM: "x1",
            score: score,
        });
        //console.log("提交分");
    },

    ShowChild(isRequ = true)
    {
        //Init.Instance.SoundNode[0].play();
        if(CC_WECHATGAME&&isRequ)
        {
            this.friendButtonFunc();
        }
        this.isShow = true;

        this.rankingScrollView.node.active = true;
      
    },

    HideChild()
    {
        this.isShow = false;
        this.rankingScrollView.node.active = false;
        
    },

    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if(this.isShow == false)
            return;
        if (window.sharedCanvas != undefined&&window.sharedCanvas!=null) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.rankingScrollView.spriteFrame = new cc.SpriteFrame(this.tex);
            //this.node.Instance.UIRanking.self.RankViewContent.spriteFrame = new cc.SpriteFrame(this.tex);

        }
    },
    update() {
        this._updateSubDomainCanvas();
    },
});