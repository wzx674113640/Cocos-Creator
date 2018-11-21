var  WXRequ  = require("WXRequ");
var Hint = require("Hint");
//var Init = require("Init");
cc.Class({
    extends: require("BaseUIPop"),

    properties: {
        UpLayout: cc.Node,
        DownLayout:cc.Node,
        SignItem:cc.Prefab,
        Tol: cc.Toggle,
        BtnGet:cc.Node,
        ImgAlreadyGet:cc.Node,

        _isSign: false,
        _Signlist:[],
        _needSginIdnex:-1,
        _itemList:
        {
            type:cc.Node,
            default:[]
        }
       
    },

    start()
    {
        this._super();
        
        try 
        {
            WXRequ.Instance.C2G_Sgin(
               (data)=>{
                    this.action(data)
               } 
            );
            
        } 
        catch (error) 
        {
            console.log(error);
        }

    },

    action(data)
    {
        this._Signlist = data.list;
    
        this._isSign = data.is_sign==1? true:false;

        this.LoadItem();

        if(this._isSign)
        {
            this.ImgAlreadyGet.active = true;
            this.BtnGet.active = false;
        }
        else
        {
            this.ImgAlreadyGet.active = false;
            this.BtnGet.active = true;

        }
    },
   

    LoadItem()
    {
        var isenter = false;
        for(var i = 0;i<this._Signlist.length;i++)
        {
            var SignNode = cc.instantiate(this.SignItem);
            this._itemList.push(SignNode);
            var oneIssgin = this._Signlist[i].status==1? true:false;
            SignNode.getComponent("ItemSgin").SetItem(i+1,oneIssgin,this._Signlist[i].gold);
            if(isenter == false&&this._Signlist[i].status==false)
            {
                isenter = true;
                this._needSginIdnex = i;
            }
            if(i<4)
            {
                this.UpLayout.addChild(SignNode);
            }
            else
            {
                this.DownLayout.addChild(SignNode);
            }   
        }   
    },

    //领取物品
    getCountClick()
    {
        try 
        {
            var num = this.Tol.isChecked == true? 1:0;

            //向服务器发消息
            WXRequ.Instance.C2G_GetSgin(num,
                (data)=>
                {
                    if(num==1)
                        WXRequ.Instance.onShareBtn();
                    var goldtype = "";
                    if(data.cat == 1)
                    {
                        WXRequ.Instance.playInfo.coin += Number(data.gold);
                        goldtype = "金币";
                    }
                    else
                    {
                        WXRequ.Instance.playInfo.resurrectionCard += Number(data.gold);
                        goldtype = "复活卡";
                    }
                    this._itemList[this._needSginIdnex].getComponent("ItemSgin").SginNode.active = true;
                    Hint.Instance.ShowPop("获得x"+data.gold+goldtype);
                    this.ImgAlreadyGet.active = true;
                    this.BtnGet.active = false;
                }
                );
        } 
        catch (error)
        {
            console.error(error);   
        }
       
    }
   
});
