var Init = require("Init");
var WXRequ = require("WXRequ");
var Hint = require("Hint");

var UIAward =  cc.Class({
    extends: require("BaseUIPop"),

    properties: {
        CoinCount:cc.Label,
        CardCount:cc.Label,
        SkinString:cc.Label,
        SkinSprite:cc.Sprite,
        BtnShara:cc.Node,
        BtnGet: cc.Node,
        AlreadyGet:cc.Node,
        title: cc.Label,
        ImgHeadList:
        {
            type:cc.Sprite,
            default:[]
        },

      
    },

    
    onEnable()
    {
        if(!Init.Instance.IsEnbaleFunction)
            return;
        this.Userindex = 0;
        try
        {
            WXRequ.Instance.C2G_Activety(
                (data)=>
                {
                    var dataList = data.list;
                  
                    for(var i = 0;i<dataList.length;i++)
                    {
                        if(i>=3)
                            break;
                        if(dataList[i].avatar_url!=null&&dataList[i].avatar_url!="")
                        {
                            this.Userindex++;
                            this.ImgHeadList[i].node.active = true;
                            this.createImage(dataList[i].avatar_url,this.ImgHeadList[i])
                        }
                        else
                        {
                            this.ImgHeadList[i].node.active = false;
                        }
                    }

                    var skinid = Number(data.row.id);
                    skinid--;
                    this.SkinSprite.spriteFrame = Init.Instance._SkinPics[skinid];
                    this.SkinString.string = Init.Instance._SkinStrings[skinid];
                    this._coin = data.gold;
                    this._card = data.gold;
                    this.CoinCount.string = "x" + data.gold;
                    this.CardCount.string = "x" + data.card;
                    this.title.string = data.title;
                    if(this.Userindex == 3)
                    {
                        if(data.type == 0)
                        {
                            this.BtnGet.active = true;
                            this.AlreadyGet.active =false;
                            this.BtnShara.active = false;
                        }
                        else
                        {
                            this.BtnGet.active = false;
                            this.AlreadyGet.active = true;
                            this.BtnShara.active = false;
                        }
                    }
                    else
                    {
                        this.BtnGet.active = false;
                        this.AlreadyGet.active = false;
                        this.BtnShara.active = true;
                    }
                    
                });
        } 
        catch (error)
        {
            console.log("活动界面错误" + error);
            console.error(error);
        }
    }, 
   
    GetAwardClick()
    {
        try 
        {
            if(this.Userindex!=3)
            {
                return;
            }
            WXRequ.Instance.C2G_GetActivety(()=>
            {
                WXRequ.Instance.playInfo.coin += this.coin;
                WXRequ.Instance.playInfo.resurrectionCard += this.card;
                WXRequ.Instance.playInfo.activeSkin = this.SkinSprite.spriteFrame;
                this.ShowGetSkinPanel();
                //console.log("领取活动奖励成功!");
            });
        } 
        catch (error)
        {
            console.error(error);
        }
    },
//领取奖励成功的UI
    ShowGetSkinPanel()
    {
        this.BtnGet.active = false;
        this.AlreadyGet.active = true;
        this.BtnShara.active = false;
        this.setClose();
        var UIEndTwo = Init.Instance.GetUINode("UIEndTwo");
        //弹窗特殊处理
        if(UIEndTwo.active == true)
        {
            Init.Instance._temporaryEvent = ()=>
            {
                this.node.parent.parent.Rank.ShowChild(false);
            }
        }
        Init.Instance.ShowUIGetSkin();
    },

  
    SharaBtn()
    {
        WXRequ.Instance.onSharaResurtBtn();
    },

    createImage(avatarUrl,ImgHead)
    {
        let image = window.wx.createImage();
        //var self = this;
        image.onload = function(){
            let texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            ImgHead.spriteFrame = new cc.SpriteFrame(texture);
        };
        image.src = avatarUrl;
    },

});
