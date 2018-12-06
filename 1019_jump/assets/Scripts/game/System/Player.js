
var game_Control = require("GameContorl");

var Init = require("Init");

var WXRequ = require("WXRequ");

var Hint = require("Hint");

cc.Class({
    extends: cc.Component,

    properties: {

        y_radio: 0.5560472,

        x_dis: 50,

        game_manager:{
            type: game_Control,
            default: null,
        },
        
        InputColor: "",

        AllBoxIndex: -1,

        CurBox:
        {
            type: cc.Node,
            default:null,
        },

        IsCanJump: true,

        GameingState: "Gameing",

        JumpCool:0.15,
        
        _JumpCool:0.15,
        
        MySprite:
        {
            type:cc.Sprite,
            default:null,
        },

        MySpriteList:
        {
            type:cc.SpriteFrame,
            default:[],
        },
        /*
        PlayerSkin:
        {
            type:cc.SpriteFrame,
            default:[],
        }
        */
    },

    Clear()
    {
        this.node.setRotation(0);
        this.MySprite.node.scaleX = 1;
        this.ResurtCount = 0;
        this.InputColor = "";
        this.AllBoxIndex = -1;

        this.CurBox = null;
        this.IsCanJump = true;
        this.GameingState = "Gameing";
        //this.JumpCool = this._JumpCool;
       
    },


    onLoad()
    {
        //cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.keyDown,this);
        this.ResurtCount = 0;
        this.direction = 1;
       
    },
    // LIFE-CYCLE CALLBACKS:

    keyDown(event)
    {
        if(this.IsCanJump==false||this.GameingState != "Gameing")
            return;
        this.game_manager.IsPause = false;
        //if(Init.Instance.IsSoundPlay)
            //this.game_manager.AllBoxs[this.AllBoxIndex+1].getComponent(cc.AudioSource).play();

      
        this.direction =  this.game_manager.AllBoxs[this.AllBoxIndex+1].getComponent("Box").Direction;
        this.nextdir = this.game_manager.AllBoxs[this.AllBoxIndex+2].getComponent("Box").Direction;
        var isNeedjump = true;
        
        switch(event.keyCode||event)
        {
            case cc.KEY.a:
                this.InputColor = "紫色";
                break;
            case cc.KEY.s:
                this.InputColor = "红色";
                break;
            case cc.KEY.d:
                this.InputColor = "橙色";
                break;
            case cc.KEY.f:
                this.InputColor = "绿色";
                break;
            default:
                isNeedjump = false;
                break;
        }
        if(isNeedjump)
        {
            //this.game_manager.add_Box(true);
            this.AllBoxIndex += 1;
            var _box = this.game_manager.AllBoxs[this.AllBoxIndex];
            this.CurBox = _box;
            if(_box.getComponent("Box").My_Color != this.InputColor)
            {
                this.GameingState = "Gameover";
            }
            
            this.playerjump();
        }
        isNeedjump = false;
    },

    BtnA()
    {
        this.keyDown(cc.KEY.a);
    },

    BtnS()
    {
        this.keyDown(cc.KEY.s);
    },

    BtnD()
    {
        this.keyDown(cc.KEY.d);
    },

    BtnF()
    {
        this.keyDown(cc.KEY.f);
    },


    playerjump()
    {
        //this.JumpCool= this._JumpCool,
        this.game_manager.coolTime = 0.8,
        this.game_manager.StopUpdate = false;
        this.IsCanJump = false;
        var x_distance = this.x_dis * this.direction;
        var y_distance = this.x_dis * this.y_radio;

        var target_pos = this.node.getPosition();
        target_pos.x += x_distance ;
        target_pos.y += y_distance ;

        var k = cc.jumpTo(this._JumpCool,target_pos,250,1);
        //var j =  k.easing(cc.easeSineInOut());
        var w_pos = this.node.parent.convertToWorldSpaceAR(target_pos);
        var end_func = cc.callFunc(function() {
            
            if(this.nextdir == 1)
            {
                this.MySprite.node.scaleX = 1;
                this.game_manager.move_Map(183-w_pos.x,-y_distance);
            }
            else
            {
                this.MySprite.node.scaleX = -1;
                this.game_manager.move_Map(567-w_pos.x,-y_distance);
            }
            //this.MySprite.node.scale.x = this.nextdir;
            //this.game_manager.move_Map(380-w_pos.x,-y_distance);

            //this.game_manager.move_Map(183-w_pos.x,-y_distance);
        }.bind(this));

        // var seq1 =cc.sequence(j,l);
        var seq = cc.spawn(k,end_func);
        this.node.runAction(seq);
        
    },

    Ani()
    {
        var p =  cc.moveBy(0.05, cc.v2(0, -60));
        var o = cc.moveBy(0.2, cc.v2(0, 60));
        var seq = cc.sequence(p,o);
        this.node.runAction (seq);
    },

    onEnable()
    {
        this.node.instance = this;
        if(!Init.Instance.IsEnbaleFunction)
            return;
         //设置皮肤
        this.startGame();
    },

    setSkin()
    {
        this.MySprite.spriteFrame = Init.Instance._SkinPics[WXRequ.Instance.playInfo.curSkin-1];
                
        this.node.getComponent(cc.MotionStreak).texture = Init.Instance._SkinPics[WXRequ.Instance.playInfo.curSkin-1]._texture;
    },

    startGame()
    {
        //发送开始消息
        WXRequ.Instance.C2G_GameStart(
            ()=>
            {
                if(WXRequ.Instance.playInfo.curSkin == null||WXRequ.Instance.playInfo.curSkin == undefined||WXRequ.Instance.playInfo.curSkin =="")
                {
                    this.MySprite.spriteFrame = Init.Instance._SkinPic[0];
                    this.node.getComponent(cc.MotionStreak).texture = Init.Instance._SkinPic[0];
                }
                else
                {
                    this.setSkin();
                }
                
            }
        );
    },
    start () 
    {
        this.rot_node = this.node.getChildByName("rot_node");
        
    },

    PlayerOverAni()
    {
         Hint.Instance.Mask.active = true;
         this.IsCanJump = false;
         if(CC_WECHATGAME)
         {
            wx.vibrateLong();
         }
         Init.Instance.SoundNode[1].play();
         var mo =  cc.moveBy(0.1,0,-95);
         var ro = cc.rotateTo(0.2,-90);
         var spa = cc.spawn(mo,ro);
         this.node.runAction(spa);
         this.scheduleOnce(function() {
            this.game_manager.game_over();
            Hint.Instance.Mask.active = false;
        }, 1);
    },
    

     update (dt) {
        //this.JumpCool-=dt;
        //if(this.JumpCool<=0)
        //{
            //this.IsCanJump = true;
            //return;
        //}
     },
});
