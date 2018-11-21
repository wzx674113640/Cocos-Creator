var Init = require("Init");
var WXRequ = require("WXRequ");
var Hint = require("Hint");

var BaseUIPop =  cc.Class({
    extends: cc.Component,

    properties: {
        //缩放的起始点
        startPos: cc.v2(0,0),

        MaskClose: cc.Node,
        BtnClose: cc.Node,
        //需要播放动画的UI
        AniUI: cc.Node,
        
    },

    start() {
        this.MaskClose.on('click',this.CloseClick,this);
        this.BtnClose.on('click',this.CloseClick,this);
    },

    CloseClick()
    {
        Hint.Instance.Mask.active = true;
        Init.Instance.SoundNode[0].play();
        var action1 = cc.scaleTo(0.2,0.1,0.1);
        var action2 = cc.moveTo(0.2,this.startPos.x,this.startPos.y);
        var spa =  cc.spawn(action1,action2);
        var self  = this;
        var call = cc.callFunc(
            ()=>{
                self.node.active = false;
                Init.Instance.TopMask.active = false;
                Init.Instance.MaskRank.active = false;
                Hint.Instance.Mask.active = false;
            }
        )
        var seq = cc.sequence(spa,call);
        this.AniUI.runAction(seq);
    },  
    
    //程序关闭
    setClose()
    {
        this.AniUI.scale = cc.v2(0.1, 0.1), 
        this.AniUI.position = this.startPos;
        Init.Instance.TopMask.active = false;
        Init.Instance.MaskRank.active = false;
        this.node.active = false;
    },

    playAni()
    {
        Hint.Instance.Mask.active = true;
        var action1 = cc.scaleTo(0.2,1,1);
        var action2 = cc.moveTo(0.2,0,0);
        var spa =  cc.spawn(action1,action2);
        this.scheduleOnce(function() {
            Hint.Instance.Mask.active = false;
        }, 0.2);
        this.AniUI.runAction(spa);
    },

    // update (dt) {},
});
