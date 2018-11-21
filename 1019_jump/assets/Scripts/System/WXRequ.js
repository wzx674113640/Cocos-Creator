
var Init = require("Init");
var PlayInfo = require("PlayInfo");

var getInfo = {code:null,nickName:null,avatarUrl:null,gender:null};

//var playInfo = {id:null, openid:null, nickName:null,avatar_url:null,score:null,total_amount:null};

var ID = null;

var Hint = require("Hint");

var WXRequ = cc.Class({
    extends: cc.Component,

    statics:
    {
        Instance:null
    },

    properties: {
        IsGetUserInfo: false,

        is_open: 0,

        playInfo:
        {
            type: PlayInfo,
            default: null,
            visible :true
        },
        
        Mask:cc.Node
        
    },

    onLoad()
    { 
        
        this.C2G_GetUserInfo();
    },
   
    //获取游戏数值信息
    C2G_GameInfo(isclose = false,action = null)
    {
        if (!CC_WECHATGAME)
            return;
        var obj =  wx.getLaunchOptionsSync();
        var self = this;
        this.key = obj.query.key==undefined? null:obj.query.key;
        wx.request({
            url:'https://tfk.qkxz.com/?act=user',
            data:
            {
                openid:self.openid,
                uid:self.key,
            },
            success (res) 
            {
                var infodata =  res.data.data;
                self.playInfo.coin = Number(infodata.gold);
                self.playInfo.resurrectionCard = Number(infodata.card);
                self.playInfo.score = infodata.score;
                if(isclose)
                {
                    self.C2G_Sgin(
                        (data)=>
                        {
                            self._isSign = data.is_sign==1? true:false;
                            if(!self._isSign)
                                self.node.getComponent("Init").ShowUISgin();
                            self.HidePanelMask();
                        }
                    );
                }
                if(action!=null)
                    action();
            }
        });
    },

    //签到
    C2G_Sgin(action)
    {
        if (!CC_WECHATGAME)
            return;
        var self = this;
        //this.mydata = null;
        wx.request({ 
            url:'https://tfk.qkxz.com/index.php?act=signlist',
            data:
            {
                openid:self.openid,
            },
            success (res) 
            {
                //self.mydata = res.data.data;
                action(res.data.data);
            }
        });
        
    },

    //领取签到奖励 0 单倍 1双倍
    C2G_GetSgin(num,action)
    {
        if (!CC_WECHATGAME)
            return;
        var self = this;
        
        wx.request({ 
            url:'https://tfk.qkxz.com/index.php?act=sign',
            data:
            {
                openid:self.openid,
                type:num
            },
            success (res) 
            {
                action(res.data.data);
            }
        });
        
    },

    //皮肤列表
    C2G_Skin(action)
    {
        if (!CC_WECHATGAME)
        return;
        var self = this;
        wx.request({ 
            url:'https://tfk.qkxz.com/index.php?act=skinlist',
            data:
            {
                openid:self.openid,
            },
            success (res) 
            {
                action(res.data.data);
            }
        });
    },

    //买皮肤TODO
    C2G_BuySkin(skinID,action)
    {
        if (!CC_WECHATGAME)
        return;
        var self = this;
        wx.request({ 
            url:'https://tfk.qkxz.com/index.php?act=buy',
            data:
            {
                openid:self.openid,
                id:skinID
            },
            success (res) 
            {
                action();
            }
        });
    },

    //使用皮肤
    C2G_UseSkin(skinID,action)
    {
        if (!CC_WECHATGAME)
        return;
        var self = this;
        wx.request({ 
            url:'https://tfk.qkxz.com/index.php?act=skinbut',
            data:
            {
                openid:self.openid,
                id:skinID
            },
            success (res) 
            {
                action();
                //action(res.data.data);
            }
        });
    },
    //使用复活卡
    C2G_UseCard(action)
    {
        if (!CC_WECHATGAME)
        return;
        var self = this;
        wx.request({ 
            url:'https://tfk.qkxz.com/index.php?act=fuhuo',
            data:
            {
                openid:self.openid,
                id:self.gameID
            },
            success (res) 
            {
                action();
            }
        });
    },

    //活动
    C2G_Activety(action)
    {
        if (!CC_WECHATGAME)
        return;
        var self = this;
        wx.request({ 
            url:'https://tfk.qkxz.com/index.php?act=activity',
            data:
            {
                openid:self.openid,
            },
            success (res) 
            {
                action(res.data.data);
            }
        });
    },

    C2G_GetActivety(action)
    {
        if (!CC_WECHATGAME)
        return;
        var self = this;
        wx.request({ 
            url:'https://tfk.qkxz.com/index.php?act=abut',
            data:
            {
                openid:self.openid,
            },
            success (res) 
            {
                action();
            }
        });
    },

    
    ShowPanelMask()
    {
        /*
        console.log("打开加载");
        this.Mask.active = true;
        wx.showLoading({
            //title: "",
          })
          */
    },

    HidePanelMask()
    {
        /*
        console.log("关闭加载");
        this.Mask.active = false;
        wx.hideLoading();
        */
    },
    
//获取后台信息
    C2G_GetUserInfo()
    {
        this.playInfo = new PlayInfo();
        if (!CC_WECHATGAME)
            return;
        if(cc.sys.localStorage.getItem("nickName")!= "")
        {
            this.ShowPanelMask();
            var self = this;
            getInfo.nickName = cc.sys.localStorage.getItem("nickName")
            getInfo.avatarUrl = cc.sys.localStorage.getItem("avatarUrl")
            getInfo.gender = cc.sys.localStorage.getItem("gender")
            self.Login(getInfo,self);
        }
        else{
            var self = this;
            let sysInfo = window.wx.getSystemInfoSync();
            let width = sysInfo.screenWidth;
            let height = sysInfo.screenHeight;
            let button = wx.createUserInfoButton({
                type: 'text',
                text: '',
                style: {
                    left: 10,
                    top: 10,
                    width: width - 20,
                    height: height - 20,
                    textAlign: 'center'
                }
            })
            button.onTap((res) => {
                self.ShowPanelMask();
                var userInfo = res.userInfo
                cc.sys.localStorage.setItem("nickName", userInfo.nickName);
                cc.sys.localStorage.setItem("avatarUrl", userInfo.avatarUrl);
                cc.sys.localStorage.setItem("gender", userInfo.gender);
                getInfo.nickName = userInfo.nickName
                getInfo.avatarUrl = userInfo.avatarUrl
                getInfo.gender = userInfo.gender //Sex 0: unknown, 1: male, 2: female
                button.hide();
                self.Login(getInfo,self);
            })
    }
    },

    Login(getInfo,self)
    {
        wx.login({
            success (res) {
                if (res.code) {
                getInfo.code = res.code
                //发起网络请求
                wx.request({
                    url: 'https://tfk.qkxz.com/index.php?act=userinfo',
                    data: {
                    code: getInfo.code,
                    nickName:getInfo.nickName,
                    avatarUrl: getInfo.avatarUrl,
                    gender:getInfo.gender,
                    scene:0,
                    uid: self.key
                    },
                    success (res) {
                    var severuserinfo =  res.data.data;
                    
                    //this.PlayInfo.curSkin = 0;
                    self.playInfo.openid = severuserinfo.openid,
                    self.openid = severuserinfo.openid;
                    self.playInfo.id = severuserinfo.id;
                    self.playInfo.nickName = severuserinfo.nickName;
                    self.playInfo.avatar_url = severuserinfo.avatar_url;
                    self.playInfo.score = severuserinfo.score;
                    self.bestscore = severuserinfo.score;
                    self.playInfo.total_amount = severuserinfo.total_amount;
                    self.IsGetUserInfo = true;
                    self.is_open = severuserinfo.is_open;
                    self.C2G_GameInfo(true);
                    }
                })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    },

//C2G游戏开始
    C2G_GameStart(action)
    {
        if (!CC_WECHATGAME)
        return;
        var self =this;
        wx.request({
            url: 'https://tfk.qkxz.com/?act=index&openid={$openid}',
            data:
            {
                openid: self.playInfo.openid,
            },
            success (res) {
                self.gameID = res.data.data.id;
                self.playInfo.curSkin = res.data.data.skin_id;
                action();

            }
          })
    },

//C2G游戏结束
    C2G_GameOver(gold,Score,action)
    {
        if (!CC_WECHATGAME)
        return;
        var self = this;
        wx.request({
            url: 'https://tfk.qkxz.com/?act=end&openid={$openid}',
            data:
            {
                openid:self.playInfo.openid,
                score: Score,
                id : self.gameID,
                gold: gold
            },
            success (res) {
                action(); 
            }
          })
    },
//C2G世界排行榜
    C2G_WorldRank()
    {
        if (!CC_WECHATGAME)
        return;
        wx.request({
            url: 'https://tfk.qkxz.com/?act=paihang&openid={$openid}',
            data:
            {
                openid:this.playInfo.openid,
            },
            success (res) {
              console.log("世界排行榜接口成功："+ res.data.data);
              myjson = res.data.data;
            }
          })
    },


    ShowOrHideAdervert(Active)
    {
        if(Active)
        {
            var screenHeight = wx.getSystemInfoSync().screenHeight
            var screenWidth = wx.getSystemInfoSync().screenWidth
            let bannerAd = wx.createBannerAd({
                adUnitId: 'adunit-e8e30be4a0b05273',
                style: {
                    left: 0,
                    top: screenHeight-130,
                    width: screenWidth,
                    height:200,
                }
                });
                
            bannerAd.onLoad(() => {
                bannerAd.style.top = screenHeight-bannerAd.style.realHeight;
                bannerAd.show();
                });
                
            //bannerAd.show().then(() => console.log('banner 广告显示'));
            
            bannerAd.onError(err => {
                console.log(err)
            })

            this.bannerAd = bannerAd;
        }
        else
        {
            if(this.bannerAd!=null&&this.bannerAd!=undefined)
            {
                this.bannerAd.destroy();
            }
        }
        
       
    },

    onShareBtn(action=null){ //分享按钮
        wx.shareAppMessage({
            title: "谁来制止我，我已经跳的停不下来了！",
            imageUrl: "src/share.png",
            success(res){
                //action();
                //common.diamond += 20;
            },
            fail(res){
                //action();
            } 
        })
        if(action !=null)
        {
            action();
        }
        
    },
    //分享得复活卡
    onSharaResurtBtn()
    {
        var self = this;
        wx.shareAppMessage({
            title: "谁来制止我，我已经跳的停不下来了！",
            imageUrl: "src/share.png",
            query: 'key=' + self.playInfo.id,
        })
        console.log("我的openID"+this.playInfo.id);
    },

    WXTopUI(TXT,State)
    {
        if(cc.CC_WECHATGAME)
        {
            wx.showToast({
                title: TXT,
                icon: State,
                duration: 800
              })
        }
    },

    onEnable()
    {
        WXRequ.Instance = this;
    },

    //关联程序
    associatedProgram(AppID)
    {
        wx.navigateToMiniProgram({
            appId: AppID,
           
            envVersion: 'develop',
            success(res) {
             
            }
          })
    }

    // update (dt) {},
});
module.exports = WXRequ;