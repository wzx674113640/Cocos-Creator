
var Init = require("Init");

var getInfo = {code:null,nickName:null,avatarUrl:null,gender:null};

var playInfo = {id:null, openid:null, nickName:null,avatar_url:null,score:null,total_amount:null};

var ID = null;

var WXRequ = cc.Class({
    extends: cc.Component,

    statics:
    {
        Instance:null
    },

    properties: {
        IsGetUserInfo: false,
    },

    onLoad()
    { 
        this.C2G_GetUserInfo();
    },

    
//获取后台信息
    C2G_GetUserInfo()
    {

        if (!CC_WECHATGAME)
            return;
        console.log(cc.sys.localStorage.getItem("nickName"));
        if(cc.sys.localStorage.getItem("nickName")!= "")
        {
            console.log("有缓存:"+cc.sys.localStorage.getItem("nickName"));
            var self = this;
            getInfo.nickName = cc.sys.localStorage.getItem("nickName")
            getInfo.avatarUrl = cc.sys.localStorage.getItem("avatarUrl")
            getInfo.gender = cc.sys.localStorage.getItem("gender")
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
                        },
                        success (res) {
                        var severuserinfo =  res.data.data;
                        playInfo.openid = severuserinfo.openid,
                        self.openid = severuserinfo.openid;
                        playInfo.id = severuserinfo.id;
                        playInfo.nickName = severuserinfo.nickName;
                        playInfo.avatar_url = severuserinfo.avatar_url;
                        playInfo.score = severuserinfo.score;
                        self.bestscore = severuserinfo.score;
                        playInfo.total_amount = severuserinfo.total_amount;
                        self.IsGetUserInfo = true;
                        }
                    })
                    } else {
                    console.log('登录失败！' + res.errMsg)
                    }
                }
            })
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
                var userInfo = res.userInfo
                cc.sys.localStorage.setItem("nickName", userInfo.nickName);
                cc.sys.localStorage.setItem("avatarUrl", userInfo.avatarUrl);
                cc.sys.localStorage.setItem("gender", userInfo.gender);
                getInfo.nickName = userInfo.nickName
                getInfo.avatarUrl = userInfo.avatarUrl
                getInfo.gender = userInfo.gender //Sex 0: unknown, 1: male, 2: female
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
                            },
                            success (res) {
                            var severuserinfo =  res.data.data;
                            playInfo.openid = severuserinfo.openid,
                            self.openid = severuserinfo.openid;
                            playInfo.id = severuserinfo.id;
                            playInfo.nickName = severuserinfo.nickName;
                            playInfo.avatar_url = severuserinfo.avatar_url;
                            playInfo.score = severuserinfo.score;
                            self.bestscore = severuserinfo.score;
                            playInfo.total_amount = severuserinfo.total_amount;
                            self.IsGetUserInfo = true;
                            button.hide();
                            }
                        })
                        } else {
                        console.log('登录失败！' + res.errMsg)
                        }
                    }
                })
            })
    }

    },

//C2G游戏开始
    C2G_GameStart()
    {
        wx.request({
            url: 'https://tfk.qkxz.com/?act=index&openid={$openid}',
            data:
            {
                openid:playInfo.openid,
            },
            success (res) {
                ID = res.data.data.id;
            }
          })
    },

//C2G游戏结束
    C2G_GameOver(Score)
    {
        wx.request({
            url: 'https://tfk.qkxz.com/?act=end&openid={$openid}',
            data:
            {
                openid:playInfo.openid,
                score: Score,
                id : ID,
            },
            success (res) {
              console.log("游戏结束接口成功：");
            }
          })
    },
//C2G世界排行榜
    C2G_WorldRank()
    {
        wx.request({
            url: 'https://tfk.qkxz.com/?act=paihang&openid={$openid}',
            data:
            {
                openid:playInfo.openid,
            },
            success (res) {
              console.log("世界排行榜接口成功："+ res.data.data);
              myjson = res.data.data;
            }
          })
    },

    ShowAdervert()
    {
        try {
            var screenHeight = wx.getSystemInfoSync().screenHeight
            var screenWidth = wx.getSystemInfoSync().screenWidth
            console.log("广告显示");
            let bannerAd = wx.createBannerAd({
                adUnitId: '3ee87ccb18c5ac95',
                style: {
                  left: 0,
                  top: screenHeight-200,
                  width: screenWidth,
                  height:200,
                }
              });
              
            bannerAd.onLoad(() => {
                bannerAd.show();
                console.log('banner 广告加载成功');
              });
              
            bannerAd.show()
              .then(() => console.log('banner 广告显示'));
        } 
        catch (error) {
            cc.log("需要微信开发者环境:"+error);
            console.log("需要微信开发者环境:"+error);
        }
       
    },

    onShareBtn(action){ //分享按钮
        //Init.Instance.SoundNode[0].play();
        //this.node.getComponent("Init").SoundNode[0].play();
        //主动拉起分享接口
        wx.shareAppMessage({
            title: "谁来制止我，我已经跳的停不下来了！",
            imageUrl: "src/share.png",
            success(res){
                //console.log("转发成功!!!")
                action();
                common.diamond += 20;
            },
            fail(res){
                //console.log("转发失败!!!")
            } 
        })
    },
   
    getWXRanking(){
       
    },

    onEnable()
    {
        WXRequ.Instance = this
    },

    // update (dt) {},
});
module.exports = WXRequ;