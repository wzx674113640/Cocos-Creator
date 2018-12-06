

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
        },

        CoinNode: cc.Node,
        
//盒子上是不是有金币
        _IsCoinBox: false,

        BoxNode:cc.Node,

        shadow: cc.Node,
        shadowspeed: 0.02,
        _shadowScalespeed: -0.01,

        InitDis: 30,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start()
    {
        this.gamecontorl = this.node.parent.parent.parent.getComponent("GameContorl");
        this.player = this.node.parent.parent.getChildByName("Player").getComponent("Player");
        //this.MoveAni();
        var shadowpos =  this.shadow.getPosition();
        this.posy = shadowpos.y;
        this.posx = shadowpos.x;
    },

    Boxblink()
    {
        var my_pos =  this.BoxNode.getPosition();
        //var action = cc.blink(2, 10);
        //var action1 = cc.scaleTo(0.05, 1, 0.6);
        var move1 = cc.moveTo(0.05,my_pos.x,my_pos.y-60);
        //var spa1 = cc.spawn(action1,move1);
        //var action2 = cc.scaleTo(0.05,1,1);
        var move2 = cc.moveTo(0.2,my_pos.x,my_pos.y);
        //var spa2 = cc.spawn(action2,move2);
        //var actionTo = action.easing(cc.easeSineInOut());
        var action = cc.sequence(move1,move2);
        this.BoxNode.runAction(action);

        this.CoinNode.active = false;
        //this._IsCoinBox = false;
    },

    //生成金币
    creatCoin()
    {
        var num =  Math.floor(Math.random()*5);
        if(num <=2)
        {
            this.CoinNode.active = true;
            this._IsCoinBox = true;
        }
    },

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
        this.node.active = true;
        this.node.opacity = 255;
        this.IsStartOpacity = false;
    },

    MoveAni(movedir)
    {
        var mynode = this.BoxNode.getPosition()
        mynode.y += -movedir*(10/2);
        this.BoxNode.setPosition(mynode);
        var left = cc.moveBy(1,0,10*movedir);
        var right = cc.moveBy(1,0,-(10*movedir));
        var seq = cc.sequence(left,right);
        var rep = cc.repeatForever(seq);
        this.BoxNode.runAction(rep);

        //var first = cc.moveBy(0.5,0,-(movedir*5));
        //var callfun = cc.callFunc(function(){
            
        //}.bind(this));
        //var sequ = cc.sequence(first,callfun);
        //this.BoxNode.runAction(sequ);
    },

    update (dt) 
    {
        var boxpos = this.BoxNode.getPosition();
        //var dis = boxpos.y - this.groundPos.y
        var _x =  - boxpos.y;
        if(_x!=0)
        {
            var scax = this._shadowScalespeed*_x<-0.1? 0:this._shadowScalespeed;
            this.shadow.setPosition(this.posx,this.posy + scax*_x);
            this.shadow.setScale(1+scax*_x,1+scax*_x);
        }
        if(this.gamecontorl.IsPause)
            return;
        if(this.IsStartOpacity)
        {
            this.DestoryTime -= dt;
            if(this.DestoryTime>0)
                return;
            this.node.opacity -= this.OpacitySpeed;
          
            if(this.node.opacity<=0)
            {
              
                this.node.opacity = 0;
                this.IsStartOpacity = false;
                if(this.player.CurBox==this.node)
                {
                    this.player.PlayerOverAni();
                    //this.gamecontorl.game_over();
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
