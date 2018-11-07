
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

        /*
        WTol:
        {
            type:cc.Toggle,
            default:null,
        },

       

        FCheck: cc.Node,

        Wcheck:cc.Node,
        */
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

    },

    onEnable()
    {
        if(!Init.Instance.IsEnbaleFunction)
            return;
        if(!this.FTol.ischecked)
        {
            this.FTol.check();
        }
        
        /*
        this.FTol.ischecked = true;
        this.FCheck.active =true; 
        this.WTol.ischecked = false;
        this.Wcheck.active = false;
        */
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
        this.node.parent.parent.Rank.HideChild();
        this.ShowHideOneUI(true);
    },
    
    LoadItem(RankingNode)
    {
        var iteminfo = cc.instantiate(this.ItemRanking);
        RankingNode.addChild(iteminfo);
        return iteminfo;
    },

    ShowFrienRank()
    {
        Init.Instance.SoundNode[0].play();
        this.WRanking.active = false;
        this.myselfItem.active = false;
        this.node.parent.parent.Rank.ShowChild(false);
    },

    ShowWorldRank()
    {
        Init.Instance.SoundNode[0].play();
        this.node.parent.parent.Rank.HideChild();
        this.WRanking.active = true;
        this.myselfItem.active = true;
        var self = this;
        if(this.IsLoadJosn)
        {
            this.WNode.removeAllChildren();
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
                        var iteminfo = self.LoadItem(self.WNode);
                        
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
                    self.myselfItem.active = true;
                    self.IsLoadJosn = false;
                }
              })
          
        }
        
    },
  
    StartGameClick()
    {
        Init.Instance.SoundNode[0].play();
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
    }
});
