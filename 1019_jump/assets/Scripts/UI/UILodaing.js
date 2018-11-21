
cc.Class({
    extends: cc.Component,

    properties: {
        UIGround:cc.Sprite,
        LabelProgress:cc.Label,
        BtnLogin:cc.Node,

        UIbar:cc.ProgressBar

        
    },

    start () {
        if(cc.sys.localStorage.getItem("nickName") == "")
        {
            this.BtnLogin.active = true;
            this.LabelProgress.active = false;
        }
        else
        {
            this.BtnLogin.active = false;
            this.LabelProgress.active = true;
            this.loadLabel();
        }   
    },

    loadLabel()
    {
        var index = 0;
        this.schedule(function() {
            if(index == 0)
            {
                this.LabelProgress.string = "加载中";
            }
            else
                this.LabelProgress.string +="."
            index ++;
            if(index == 4)
            {
                this.isagin = true;
            }
        }, 0.5,4,0.5);
    },

    
    
    update(dt)
    {
        if(this.isagin)
        {
            this.isagin = false
            this.loadLabel();
        }
    }
});
