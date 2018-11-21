
var WXRequ = require("WXRequ");
 

var Init =  cc.Class({
    extends: cc.Component,

    statics:
    {
        Instance:null
    },

    properties: {
    

        UIMain:
        {
            type:cc.Prefab,
            default:[],
        },

        UITop:
        {
            type:cc.Prefab,
            default:[],
        },

        UIPop:
        {
            type:cc.Prefab,
            default:[],
        },

        IsGameStata : false,
        
         SoundNode:
         {
             type:cc.AudioSource,
             default:[]
         },

         IsEnbaleFunction: false,

         SoundParent: cc.Node,

         NodeUIPop: cc.Node,

         PanelMask: cc.Node,
         
         SkinPicPrefab:cc.Prefab,

         _SkinPics:null,
         _SkinStrings:null
    },
    ShowPanelMask()
    {
        this.PanelMask.active = true;
        wx.showLoading({
            //title: "",
          })
    },

    HidePanelMask(time)
    {
        this.scheduleOnce(function() {
            this.PanelMask.active = false;
            wx.hideLoading();
        }, time);
    },

    start () {
        //加载皮肤
        var SkinSprite = cc.instantiate(this.SkinPicPrefab).getComponent("SkinPrefab");
        this._SkinPics = SkinSprite.SkinPicList;
        this._SkinStrings = SkinSprite.SkinStringList; 
        this. IsSoundPlay = true;
        this.IsGamingRank = false;

        this.UIDic = new Array();

        for(var i = 0;i<this.UIMain.length;i++)
        {
            this.LoadGame(this.UIMain[i],this.node.getChildByName("UIMain"));
            if(i>0)
            {
                this.UIDic[this.UIMain[i].name].active = false;
            }
          
        }

        for(var i = 0;i<this.UITop.length;i++)
        {
            this.LoadGame(this.UITop[i],this.node.getChildByName("UITop"));
           
            this.UIDic[this.UITop[i].name].active = false;
            
        }

        for(var i = 0;i<this.UIPop.length;i++)
        {
            if(i==0)
               this.BtnOne = this.LoadGame(this.UIPop[i],this.NodeUIPop);
            this.BtnOne.active = false;
        }
        this.IsGameStata = false;

        var top =  this.UIDic[this.UITop[0].name];
        this.TopMask = top.parent.getChildByName("Mask");
        this.MaskRank = top.parent.getChildByName("MaskRank");
        this.IsEnbaleFunction = true;
    },

    LoadGame(PrefabName,_ParentNode)
    {
        var Nodegameing = cc.instantiate(PrefabName);
        _ParentNode.addChild(Nodegameing);

        this.UIDic[PrefabName.name] = Nodegameing;
        return Nodegameing;
    },

    
    GetUINode(P_name)
    {
        var uinode = this.UIDic[P_name];
        return uinode;
    },

//关闭所有弹窗
    closeAllTop()
    {
        for(var i = 0;i<this.UITop.length;i++)
        {
            this.UIDic[this.UITop[i].name].active = false;
        }
        this.TopMask.active = false;
        this.MaskRank.active = false;
        this.node.Rank.HideChild();
    },


    //游戏开始
    ShowUIGaming()
    {
        this.ShowUI(this.UIMain[1]);
        this.IsGameStata = true;
        
    },

    //显示排行榜
    ShowUIRanking()
    {
        this.IsGameStata = false;
        this.ShowUI(this.UITop[0]);
        this.BtnOne.active = true;
    },
    //主页面
    ShowUIOnePage()
    {
        this.ShowUI(this.UIMain[0]);
        this.IsGameStata = false;
    },
    //跳转第一个结束UI
    ShowUIEndOne()
    {
        this.IsGameStata = false;
        this.ShowUI(this.UITop[1]);
    },
    
    //跳转第二个结束UI
    ShowUIEndTwo()
    {
        this.IsGameStata = false;
        this.ShowUI(this.UITop[2]);
    },

    //皮肤页面
    ShowUISkin()
    {
        this.ShowUI(this.UIMain[2]);
    },
    //分享奖励页面
    ShowUIAward()
    {
        this.ShowUI(this.UITop[3]);
        //this.BtnOne.active = true;
    },
    //显示签到页面
    ShowUISgin()
    {   
        this.ShowUI(this.UITop[4]);
        //this.BtnOne.active = true;
    },

    //显示复活页面
    ShowUIResurt()
    {   
        this.ShowUI(this.UITop[5]);
        //this.BtnOne.active = true;
    },

    //更多金币页面
    ShowUIMoreCoin()
    {
        this.ShowUI(this.UITop[6]);
    },

    ShowUIGetSkin()
    {
        this.ShowUI(this.UITop[7]);
    },

    OnSharaBtn()
    {
        WXRequ.Instance.onShareBtn();
    },

    ShowUI(UIPrefabs)
    {
        var UINode = this.UIDic[UIPrefabs.name];
        var parentName = UINode.parent.name;
        switch(parentName)
        {
            case "UIMain":
                
                for(var i = 0;i<this.UIMain.length;i++)
                {
                    if( UIPrefabs == this.UIMain[i])
                    {
                        this.UIDic[this.UIMain[i].name].active = true; 
                        continue;
                    }
                    this.UIDic[this.UIMain[i].name].active = false; 
                }
                break;
            case "UITop":
            for(var i = 0;i<this.UITop.length;i++)
            {
                if( UIPrefabs == this.UITop[i])
                {
                    var top =  this.UIDic[this.UITop[i].name];
                    if(top.getComponent("BaseUIPop"))
                    {
                        //播放动画
                        top.getComponent("BaseUIPop").playAni();
                    }
                    if(i==1||i==2)
                        this.TopMask.active = true;
                    else
                        this.MaskRank.active = true;
                    top.active = true; 
                    continue;
                }
                this.UIDic[this.UITop[i].name].active = false; 
            }
                break;
            case "UIPop":
               
                break;
            default :
                cc.log("没有找到正确的UI父节点！！！");
                break;
        }
    },

    onEnable()
    {
        Init.Instance = this
        this.IsSounVote = false;
    },
    
//控制音乐
    SoundControl(IsSounVote)
    {
        for(var i = 0;i< this.SoundParent.children.length;i++)
        {
            this.SoundParent.children[i].getComponent(cc.AudioSource).mute = !IsSounVote;
        }
        this.IsSoundPlay = IsSounVote;
    },
   
    PlayVoice()
    {
        if(!this.SoundNode[1].isPlaying)
            this.SoundNode[1].play();
        else
            this.SoundNode[3].play();
    }
});

//Init.Instance = this;
module.exports = Init;
