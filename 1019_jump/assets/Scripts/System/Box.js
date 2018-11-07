

cc.Class({
    extends: cc.Component,

    properties: {
       
        My_Color: "蓝色",

        OpacitySpeed:{       // 非下划线开头原本会显示
            default: 8,
            visible: false
        },

        IsStartOpacity: {       // 非下划线开头原本会显示
            default: false,
            visible: false
        },
//盒子消失前的时间
        DestoryTime:1,

        Direction:{       // 非下划线开头原本会显示
            default: 1,
            visible: false
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    

    onEnable(){
        this.node.a = this;
    },

    DestoyBox(ISDestory=true)
    {
        this.IsStartOpacity = true;
        this.isDes = ISDestory;
    },


    ShowBox()
    {
        this.node.opacity = 255;
        this.IsStartOpacity = false;
    },


    update (dt) 
    {
        if(this.node.parent.parent.parent.getComponent("GameContorl").IsPause)
            return;
        if(this.IsStartOpacity)
        {
            this.DestoryTime -= dt;
            if(this.DestoryTime>0)
                return;
            this.node.opacity -= this.OpacitySpeed;
            if(this.node.opacity <=0)
            {
                this.node.opacity = 0;
                this.IsStartOpacity = false;
                if(this.node.parent.parent.getChildByName("Player").getComponent("Player").CurBox==this.node)
                {
                    this.node.parent.parent.parent.getComponent("GameContorl").game_over();
                    this.IsStartOpacity = false;
                }
                if(this.isDes)
                {
                    this.node.destroy(); 
                }
                
            }
        }
        
    },
});
