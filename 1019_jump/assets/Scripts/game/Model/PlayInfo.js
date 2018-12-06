
var PlayInfo =  cc.Class({
    //extends: cc.Component,

    properties: {
        id:null, 
        openid:null, 
        nickName:null,
        avatar_url:null,
        total_amount:null,

        score:null,//总分数
        coin:null,//总金币数
        _resurrectionCard:null, //复活卡
        resurrectionCard:
        {
            get()
            {
                return this._resurrectionCard
            },
            set(value)
            {
                //this._resurrectionCard = value >10? 10:value
                this._resurrectionCard = value;
            } 
        },
        _curSkin:null, //当前皮肤
        curSkin:
        {
            get()
            {
                
                if(this._curSkin==undefined||this._curSkin ==  null)
                {
                    if(cc.sys.localStorage.getItem("curSkin")!="")
                    {
                        this._curSkin = cc.sys.localStorage.getItem("curSkin");
                    }
                    else
                    {
                        cc.sys.localStorage.setItem("curSkin",0);
                        this._curSkin = 0;
                    }
                }
                else
                {
                    this._curSkin = cc.sys.localStorage.getItem("curSkin");
                }
                
                return this._curSkin;
            },
            set(value)
            {
                cc.sys.localStorage.setItem("curSkin",value);
                this._curSkin = value;
            }
        },

        activeSkin:null,
        
        hasSkin:[], //拥有的皮肤
        
        is_status:-1, // 是否显示分享的按钮 0关闭 1开启

        CoinAdd: 1, //金币buff

        invincible: false, //无敌buff
        
       
    },
    //+10 -10...
    SetCoin(count)
    {
        this.coin += count;
    }
   
    
});
