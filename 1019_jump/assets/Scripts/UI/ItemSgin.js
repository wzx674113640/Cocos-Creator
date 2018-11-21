

cc.Class({
    extends: cc.Component,

    properties: {
        TxtDay:cc.Label,
        TxtCount:cc.Label,
        CardUI:cc.Node,
        CoinUI:cc.Node,
        SginNode:cc.Node,

        _Count:null,
        _UIType:null //0代表复活卡 1代表金币
    },


    SetItem(index,IsSgin,Count)
    {
        this.TxtDay.string = "第"+index+"天";
        if(Count>10)
        {
            this.CoinUI.active = true;
            this.CardUI.active = false;
            this._UIType = 1;
        }
        else
        {
            this.CoinUI.active = false;
            this.CardUI.active = true;
            this._UIType = 0;
        }
        this._Count = Count;
        this.TxtCount.string = Count;

        if(IsSgin)
        {
            this.SginNode.active = true;
        }
    }

    

    
});
