var  WXRequ = require("WXRequ");
var Init = require("Init");
var Hint = require("Hint");
cc.Class({
    extends: cc.Component,

    properties: {
       
        TxtName:cc.Label,
        ImgSkin:cc.Sprite,
        TxtPric:cc.Label,

        _Pric:null,
        _ID : null,
        _UIState:null,

        Btns:
        {
            type:cc.Node,
            default:[]
        }
    },

    ShowBtnUser()
    {
        this.ShowBtn(1);
    },

    ShowUsering()
    {   
        this.ShowBtn(2);
        //通知所有的同级对象 我使用了皮肤 
        var parents = this.node.parent.parent.children;
        //var childrens = this.node.parent.children;
        for(var j = 0;j<parents.length;j++)
        {
            var childrens = parents[j].children;
            for(var i = 0;i< childrens.length;i++)
            {
                if(childrens[i] == this.node)
                    continue;
                var s = childrens[i].getComponent("ItemSkin");
                if(s._UIState == 2)
                    s.ShowBtnUser();
            }
        }
        
    },

    ShowActivity()
    {
        this.ShowBtn(3);
    },

    ShowNeedCoin()
    {
        this.ShowBtn(0);
        
    },

    ShowBtn(num)
    {
        for(var i = 0;i<this.Btns.length;i++)
        {
            if(i == num)
            {
                this.Btns[i].active = true;
            }
            else
                this.Btns[i].active = false;
        }
/*
        switch(num)
        {
            case 1:
                this.Btns[0].on('click',this.UseSkinClick,this);
                break;
            case 2:
                //不需要注册事件
                break;
            case 3:
                //活动获得
                this.Btns[2].on('click',this.ActivityClick,this);
                break;
            case 0:
                //买皮肤
                this.Btns[3].on('click',this.NeedCoinClick,this);
                break;
            default:
                break;
        }
        */
        this._UIState = num;
    },

    UseSkinClick()
    {
        try {
            var self = this;
            var skin_id = Number(this._ID) +1;
            WXRequ.Instance.C2G_UseSkin(skin_id,()=>
            {
                WXRequ.Instance.playInfo.curSkin = self._ID;
                self.ShowUsering();
                Hint.Instance.ShowPop("使用成功！");
            });

        } catch (error) {
            console.error(error);
        }
        
    },

    
    ActivityClick()
    {
       
    },

    NeedCoinClick()
    {
        try
        {
            if(this._Pric!=null)
            {
                if(WXRequ.Instance.playInfo.coin>=this._Pric)
                {
                    var self = this;
                    var skin_id = Number(this._ID) +1;
                    WXRequ.Instance.C2G_BuySkin(skin_id,()=>
                    {
                        WXRequ.Instance.playInfo.coin-=self._Pric;
                        self.ShowBtnUser();
                        Hint.Instance.ShowBuy();
                        Init.Instance.GetUINode("UISkin").getComponent("UISKin").setCoin();
                    });
                }
                else
                {
                    console.log("金币不足！");
                    Hint.Instance.ShowCoin();
                }
            }
        } 
        catch (error)
        {
            console.log(error);
        }
        
    },

    //设置皮肤的Item  
    SetItemAndShow(BtnTepy,SkinIndex,SkinPric)
    {
        this._ID = SkinIndex;
        this.ShowBtn(BtnTepy);
        //var UISkinScript = Init.Instance.GetUINode("UISkin").getComponent("UISkin");
        this.TxtName.string = Init.Instance._SkinStrings[SkinIndex];
        this.ImgSkin.spriteFrame = Init.Instance._SkinPics[SkinIndex];
        
        this._Pric = Number(SkinPric);
        this.TxtPric.string = SkinPric;
    }

});
