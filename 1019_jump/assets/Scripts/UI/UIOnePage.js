
var Init = require("Init");
var WXRequ = require("WXRequ");

cc.Class({
    extends: cc.Component,

    properties: {
        SoundBtnSprite:
        {
            type:cc.Sprite,
            default:null,
        },
        SpriteList:
        {
            type:cc.SpriteFrame,
            default:[],
        },

        MyUI: cc.Node,
        SoundBtnNode: cc.Node,
    },

    onLoad()
    {
        if(!CC_WECHATGAME)
            return;
        this.AdpativeUI();
    },

    AdpativeUI()
    {
        if(this.IsAdpative==undefined)
        {
            let sysInfo = window.wx.getSystemInfoSync();
            let width = sysInfo.screenWidth;
            let height = sysInfo.screenHeight;
            if(height/width>2)
            {
                console.log("适配..");
                //需要适配
                this.SoundBtnNode.setPosition(-322,695);
            }
            this.IsAdpative = true;
        }
        
    },

    CustomerServicesBtn()
    {
        Init.Instance.SoundNode[0].play();
        if(!CC_WECHATGAME)
            return;
        window.wx.openCustomerServiceConversation({
            success: (res) => {
            }
        });
    },

    start () {
        /*
        if(this.LoadPic == undefined||this.LoadPic == null)
        {
            cc.log("音乐！");
            console.log("音乐！");
            //this.PicSoundClose = cc.url.raw('resources/Pic/SoundClose.png');
            //this.PicSoundOn = cc.url.raw('resources/Pic/SoundOn.png');
            this.LoadPic = true;
            var sound = cc.sys.localStorage.getItem("Sound");s
            console.log(sound);
            if(sound == ""|| sound == 1|| sound == null)
            {
                Init.Instance.SoundControl(true);
                this.SoundBtnSprite.spriteFrame = this.SpriteList[0];
            }
            else if(sound == 0)
            {
                Init.Instance.SoundControl(false);
                this.SoundBtnSprite.spriteFrame = this.SpriteList[1];
            }
        }
        */
    },

    BtnsStartClick()
    {
        Init.Instance.ShowUIGaming();
        Init.Instance.SoundNode[0].play();
    },
    
    OnSharaBtn()
    {
        //Init.Instance.SoundNode[0].play();
        WXRequ.Instance.onShareBtn(
            ()=>{
                wx.showToast({
                    title: '分享成功',
                    icon: 'success',
                    duration: 800
                  })
            }
        );
    },

    OnAllShare()
    {
        //Init.Instance.SoundNode[0].play();
        WXRequ.Instance.onShareBtn(
            ()=>{
                Init.Instance.ShowUIRanking();
        });
    },

    OnSoundBtn()
    {
        Init.Instance.SoundNode[0].play();
        var sound = cc.sys.localStorage.getItem("Sound");
       
        if(sound === ""|| sound == "1"|| sound == null)
        {
            Init.Instance.SoundControl(false);
            cc.sys.localStorage.setItem("Sound",0); 
            this.SoundBtnSprite.spriteFrame = this.SpriteList[1];
        }
        else if(sound == "0")
        {
            Init.Instance.SoundControl(true);
            cc.sys.localStorage.setItem("Sound",1); 
            this.SoundBtnSprite.spriteFrame = this.SpriteList[0];
        }
        
    },

    

    BtnsRankingClick()
    {
        Init.Instance.SoundNode[0].play();
        Init.Instance.ShowUIRanking();
    },
    
    onEnable()
    {
        if(!Init.Instance.IsEnbaleFunction)
            return;
        Init.Instance.BtnOne.active = false;
    },

    onDisable()
    {
        if(!Init.Instance.IsEnbaleFunction)
            return;
        Init.Instance.BtnOne.active = true;
    },
    
    OnWorking()
    {
        Init.Instance.SoundNode[0].play();
        wx.showToast({
            title: '开发中...',
            icon: 'success',
            duration: 2000
          })
    },

    //清理缓存
    clearItem()
    {
        cc.sys.localStorage.removeItem("Teach");
        cc.sys.localStorage.removeItem("nickName")
        cc.sys.localStorage.removeItem("avatarUrl")
        cc.sys.localStorage.removeItem("gender")
    },

});
