
var WXRequ = require("WXRequ");

var Init = require("Init");
cc.Class({
    extends: cc.Component,

    properties: {
      
        WRanking:
        {
            type: cc.Node,
            default:null,
        },
        
        WNode:
        {
            type:cc.Node,
            default:null,
        },
        
        ItemRanking:
        {
            type:cc.Prefab,
            default:null,
        },

        myselfItem:
        {
            type:cc.Node,
            default:null,
        },

        FTol:
        {
            type:cc.Toggle,
            default:null,
        },

       
        Content:
        {
            type:cc.Node,
            default:null,
        },

        LayoutNode:
        {
            type:cc.Node,
            default:null,
        },

        TxtTol1: cc.Node,
       

        TxtTol2: cc.Node,
        
      
    },

    onEnable()
    {
        if(!Init.Instance.IsEnbaleFunction)
            return;
        if(!this.FTol.ischecked)
        {
            this.FTol.check();
        }
        
       
        this.TxtTol1.opacity = 255;
        this.TxtTol2.opacity = 150;
        this.IsLoadJosn = true;
        this.node.self = this;
        this.WRanking.active = false;
        this.myselfItem.active = false;
        this.node.parent.parent.Rank.ShowChild();
        this.ShowHideOneUI(false);
    },

    ShowHideOneUI(IsShow)
    {
        var UIOnePage = Init.Instance.GetUINode("UIOnePage");
        if(UIOnePage.active == true)
        {
            UIOnePage.getComponent("UIOnePage").MyUI.active = IsShow;
        }
    },

    onDisable()
    {
        if(!Init.Instance.IsEnbaleFunction)
            return;
        var rank = this.node.parent.parent.Rank;
        rank.HideChild();
        rank.ClearRanking();
        this.WorldClearRanking();
        this.ShowHideOneUI(true);
        Init.Instance.IsGamingRank = false;
    },
    
    WorldClearRanking()
    {
        var childrens = this.WNode.children;
        for(var i= 0;i<childrens.length;i++)
        {
            childrens[i].getComponent("ItemRanking").clear();
        }
    },

    LoadItem(RankingNode,index)
    {
        var childrens = RankingNode.children;
        if(childrens.length>index)
        {
            return childrens[index];
        }
        else
        {
            var iteminfo = cc.instantiate(this.ItemRanking);
            RankingNode.addChild(iteminfo);
            return iteminfo;
        }
    },

    ShowFrienRank()
    {
        this.TxtTol1.opacity = 255;
        this.TxtTol2.opacity = 150;
        Init.Instance.SoundNode[0].play();
        this.WRanking.active = false;
        this.myselfItem.active = false;
        var rank = this.node.parent.parent.Rank;
        rank.ShowChild(false);
        rank.RankingTop();
    },

    ShowWorldRank()
    {
        Init.Instance.ShowPanelMask();
        this.TxtTol2.opacity = 255;
        this.TxtTol1.opacity = 150;
        Init.Instance.SoundNode[0].play();
        this.node.parent.parent.Rank.HideChild();
        //this.WRanking.active = true;
        //this.myselfItem.active = true;
        var self = this;
        if(this.IsLoadJosn)
        {
            Init.Instance.ShowPanelMask();
            //this.WNode.removeAllChildren();
            wx.request({
                url: 'https://tfk.qkxz.com/?act=paihang&openid={$openid}',
                data:
                {
                    openid:WXRequ.Instance.openid,
                },
                success (res) {
                    var obj = res.data.data.list;
                    var view = res.data.data.view;
                    for(var i = 0;i< obj.length;i++)
                    {
                        var iteminfo = self.LoadItem(self.WNode,i);
                        
                        iteminfo.getComponent("ItemRanking").setInfo(obj[i].num, obj[i].avatar_url,obj[i].nick_name,obj[i].score);
                    }
                    if(self.LayoutNode.children.length>=8)
                    {
                        var height = 45 + self.LayoutNode.children.length*90+250;
                        self.Content.setContentSize(645,height); 
                    }
                    else
                    {
                        self.Content.setContentSize(645,925);
                    }
                    self.myselfItem.getComponent("ItemRanking").setInfo(view.num, view.avatar_url,view.nick_name,view.score);
                    self.IsLoadJosn = false;
                    self.WRanking.active = true;
                    self.myselfItem.active = true;
                }
              })
        }
        else
        {
            self.WRanking.active = true;
            self.myselfItem.active = true;
        }
        self.WRanking.getComponent(cc.ScrollView).scrollToTop(0);
        Init.Instance.HidePanelMask(0);
    },
  
    StartGameClick()
    {
        Init.Instance.SoundNode[0].play();
        if(Init.Instance.GetUINode("UIGameing")._activeInHierarchy == true)
        {
            Init.Instance.GetUINode("UIGameing").getComponent("GameContorl").player.instance.startGame();
        }
        this.ShowHideOneUI(true);
        Init.Instance.ShowUIGaming();
        Init.Instance.GetUINode("UIGameing").getComponent("GameContorl").clearAndGameStart();
        Init.Instance.closeAllTop();
        
    },
    
    FlockRank()
    {
        //Init.Instance.SoundNode[0].play();
        //群排行分享
        WXRequ.Instance.onShareBtn();
    },
});
