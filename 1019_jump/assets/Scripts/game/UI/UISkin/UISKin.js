var  WXRequ = require("WXRequ");
var Init = require("Init");
var Hint = require("Hint");

cc.Class({
    extends: cc.Component,

    properties: {
        Page1:cc.Node,
        Page2:cc.Node,
        //Page3:cc.Node,
        ItemSkin:cc.Prefab,

        TxtCoin:cc.Label,

        _ItemList:[],
        _first: true
    },  

    start () {
        
    },

    onEnable()
    {
        if(!Init.Instance.IsEnbaleFunction)
            return;
        this.setCoin();
        WXRequ.Instance.C2G_Skin((data)=>{
            this._ItemList = data;
            this.LoadItem();
        });
        WXRequ.Instance.C2G_GameInfo(false,()=>
        {
            this.TxtCoin.string = WXRequ.Instance.playInfo.coin;
        });
    },

    setCoin()
    {
        this.TxtCoin.string = WXRequ.Instance.playInfo.coin;
    },


    closeUI()
    {
        Init.Instance.ShowUIOnePage();
    },

    Working()
    {
        Hint.Instance.ShowPop("开发中...");
    },

    LoadItem()
    {
        this.Page1.removeAllChildren();
        this.Page2.removeAllChildren();
        for(var i = 0;i<this._ItemList.length;i++)
        {
            if(i>18)
                break;
            var SkinNode = cc.instantiate(this.ItemSkin);
            if(this._ItemList[i].status==2)
            {
                WXRequ.Instance.playInfo.curSkin = this._ItemList[i].id;
            }
            SkinNode.getComponent("ItemSkin").SetItemAndShow(this._ItemList[i].status,this._ItemList[i].id-1,this._ItemList[i].gold);
            if(i<=5)
            {
                this.Page1.addChild(SkinNode);
            }
            if(i>=6&&i<=11)
            {
                this.Page2.addChild(SkinNode);
            }
            if(i>=12)
            {
                //this.Page3.addChild(SkinNode);
            }
        }
        var indexnum = this._ItemList.length;

        if(indexnum<=5)
        {
            this.Page1.active = true;
            this.Page2.active = false;
            //this.Page3.active = false;
        }
        if(indexnum>=6&&indexnum<=11)
        {
            this.Page1.active = true;
            this.Page2.active = true;
            //this.Page3.active = false;
        }
        if(indexnum>=12)
        {
            this.Page1.active = true;
            this.Page2.active = true;
            //this.Page3.active = true;
        }

    }
});
