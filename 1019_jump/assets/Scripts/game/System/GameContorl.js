
var Init = require("Init");
var WXRequ = require("WXRequ");
var SkillBaseBox =  require("SkillBaseBox");


cc.Class({
    extends: cc.Component,

    properties: {
       
        player: {
            default:null,
            type:cc.Node,
        },

        box_prefab: {
            default: [],
            type: cc.Prefab,
        },

        box_root :{
            type: cc.Node,
            default : null,
        },
        
        map_root: {
            type: cc.Node,
            default: null,
        },
//盒子的初始位置
        Pos_rot: cc.v2(0,0),
        
        y_radio: 0.5560472,

        x_dis: 150,

        cur_mybox:{
            type:cc.Node,
            default: null,
        },

        AllBoxs:{
            type:cc.Node,
            default:[],
        },

        //跳完后0.8秒之内必须跳
        coolTime:0.8,

        //****数据模型
        curScore:0,

        curCoin:0,
        //****数据模型


        UIScore:
        {
            type:cc.Node,
            default:null,
        },

        UICoin:
        {
            type:cc.Node,
            default: null,
        },

        IsPause: false,

        groundColor:
        {
            type:cc.Color,
            default:[],
        },

        corlorCoolTime: 10,

        groundPanel: cc.Node,

        IsCanChangeColor: true,

        BestScore: cc.Label,
//按钮UI 用来适配
        BtnsControl: cc.Node,

        TeachUI:cc.Node,
//技能是否在发动中
        _Skilling: false,
//小于-1是随机生成盒子
        //_radomIndex = -1,
        
        _NotSkillBoxIndex: 0,
    },

    HideTeachUI()
    {
        this.TeachUI.active = false;
        cc.sys.localStorage.setItem("Teach","1");
    },


    
//适配UI
    AdpativeUI()
    {
        if(this.IsAdpative==undefined)
        {
            let sysInfo = window.wx.getSystemInfoSync();
            let width = sysInfo.screenWidth;
            let height = sysInfo.screenHeight;
            if(height/width>2)
            {
                //需要适配
                this.BtnsControl.setPosition(0,-640);
                this.BestScore.node.setPosition(0,720);
                //console.log("盒子初始化点"+ this.Pos_rot);
                //this.Pos_rot = cc.v2(370,595);
                //console.log("盒子初始化点"+ this.Pos_rot);
            }
            this.IsAdpative = true;
        }
    },

    
    clearAndGameStart()
    {
        this.clear();
        this.Init();
    },

    clear()
    {
        this.ScoreIndex = 1;
        this.IsPause = false;
        this.cur_mybox = null;
        this.curScore = 0;
        this.curCoin = 0;
        this.UIScore.getComponent(cc.Label).string = 0;
        this.UICoin.getComponent(cc.Label).string = 0;
        this.box_root.removeAllChildren();
       
        this.AllBoxs.length = 0;
        this.player.instance.Clear();
        if(CC_WECHATGAME)
            wx.triggerGC();
    },

    onDisable()
    {
        this.clearAndGameStart();
        Init.Instance.IsGamingRank = false;
    },


    onLoad () {
        this.direction = 1;
        this.index = 0;
        if(cc.sys.localStorage.getItem("Teach") == "1")
        {
            this.TeachUI.active = false;
        }
        this.Index =  Math.floor(Math.random()*5);
        if(!CC_WECHATGAME)
            return;
        this.AdpativeUI();
    },

    randomColor()
    {
        this.groundColor.color = this.groundColor[this.Index];
        this.targetColor = this.GetCorlor();
        this.ratio = 0;
        this.IsCanChangeColor = true;
    },

    ScoreHideOrShow(IsShow)
    {
        //this.UIScore.active = IsShow;
        //this.UICoin.active = IsShow;
        this.BestScore.node.active = IsShow;
    },

    Init()
    {
        this.indexRodom = Math.floor(Math.random()*6)+5;
        this._NotSkillBoxIndex = 0;
        this.block_zorder = -1;
        WXRequ.Instance.ShowOrHideAdervert(false);
        //难度递增 
        this.mindex = 1;
        this._Skilling = false;
        this.index = 0;
        Init.Instance.IsGameStata = true;
        this.BestScore.string = "历史最高"+  WXRequ.Instance.bestscore + "分";
        this.ScoreHideOrShow(true);
        this.StopUpdate = false;
        this.player.instance.GameingState = "Gameing";
        this.cur_box = cc.instantiate(this.box_prefab[Math.floor(Math.random()*4)]);
        this.box_root.addChild(this.cur_box);
        this.cur_box.setPosition(this.box_root.convertToNodeSpaceAR(this.Pos_rot));
        
        var w_pos = this.cur_box.getChildByName("Pos").convertToWorldSpaceAR(cc.v2(0,0));
        this.player.setPosition(this.map_root.convertToNodeSpaceAR(w_pos));
        
        this.firstbox = this.cur_box;
        this.next_block = this.cur_box;
       
        for (var i=0;i<3;i++)
        {
            //** 方块左右生成
            this.add_Box(false);
            //this.add_block();
        }
        
    },

    add_Box(isdown)
    {
        this.index++;
        var isdir = (this.index>=this.indexRodom)? true : false;
        if(isdir)
        {
            if(this.index>=2*this.indexRodom)
            {
                this.index = 0;
                this.indexRodom = Math.floor(Math.random()*6)+5;
            }
        }
        //if(this.index>=20)
            //this.index = 0;
        this.add_block(isdir,isdown);
    },
    
    start () {
        this.isboxmove  = 1;
        this.mindex = 1;
        this.randomColor();
        this.BestScore.string = "历史最高"+  WXRequ.Instance.bestscore + "分";
        this.clearAndGameStart();
    },

    RandomBox()
    {
        this._NotSkillBoxIndex++;
        var resultNum = Math.floor(Math.random()*100);
        var nodebox = null;
        if(this._NotSkillBoxIndex>20)
        {
            if(resultNum<5)
            {
                var re = Math.floor(Math.random()*2);
                if(re == 0)
                {
                    nodebox = cc.instantiate(this.box_prefab[4]);
                }
                else
                {
                    nodebox = cc.instantiate(this.box_prefab[5]);
                }
                this._NotSkillBoxIndex = 0;
            }
            else
            { 
                nodebox = cc.instantiate(this.box_prefab[Math.floor(Math.random()*4)]);
            }
        }
        else
        {
            nodebox = cc.instantiate(this.box_prefab[Math.floor(Math.random()*4)]);
        }
        return nodebox;
    },

    add_block(IsNeedChangedir = false,isdown = false){
        
        this.isboxmove  = -this.isboxmove;

        this.direction = IsNeedChangedir? -1:1;
        this.cur_box = this.next_block;
        //this.next_block = cc.instantiate(this.box_prefab[Math.floor(Math.random()*this.box_prefab.length)]);
        this.next_block = this.RandomBox();
        this.box_root.addChild(this.next_block);
        this.next_block.setLocalZOrder(this.block_zorder);
        this.block_zorder --;
        var sbox = this.next_block.getComponent("Box");
        sbox.Direction = this.direction ;
        if(this.curScore >= (20 * this.mindex)-5)
        {
            if(this.curScore >=55)
            {
                this.mindex = 1;
                sbox.DestoryTime = 0.1;
            }
            else
            {
                this.mindex++;
                sbox.DestoryTime -= 0.3 * this.mindex;
            }
        }
        var x_distance = this.x_dis;
        var y_distance = x_distance*this.y_radio;

        var next_pos = this.cur_box.getPosition();
        next_pos.x += x_distance * this.direction;
        if(!isdown)
        {
            next_pos.y += y_distance;
        }
        else
        {
            next_pos.y += (y_distance + 500);
        }
        this.next_block.setPosition(next_pos);
        this.next_block.getComponent("Box").creatCoin();
        this.AllBoxs.push(this.next_block);
        
        if(isdown)
        {
            var boxmove = cc.moveBy(0.1,0,-560);
            var boxup = cc.moveBy(0.05,0,60);
            var mm = cc.sequence(boxmove,boxup);
            var callf =  cc.callFunc(function(){
                sbox.MoveAni(this.isboxmove,null);
            }.bind(this));
            var ss = cc.sequence(mm,callf)
            this.next_block.runAction(ss);
        }
        else
        {
            sbox.MoveAni(this.isboxmove,null);
        }
    },

    move_Map(offer_x,offer_y)
    {
        this.add_Box(true);
        //this.player.instance.AllBoxIndex += 1;
        var _box = this.AllBoxs[this.player.instance.AllBoxIndex]
        //this.player.instance.CurBox = _box;
        var m1 = cc.moveBy(0.15,offer_x,offer_y);
        var end_func = cc.callFunc(function(){
            
            this.player.instance.IsCanJump = true;
            //**方块左右生成s
            
            if(Init.Instance.IsSoundPlay)
                _box.getComponent(cc.AudioSource).play();
            //this.add_block();
            var indexs = this.player.instance.AllBoxIndex-1;
            this.AllBoxs[indexs+1].getComponent("Box").Boxblink();
            this.player.instance.Ani();
            if(indexs>=0)
            {
                var boxcom =  this.AllBoxs[indexs].getComponent("Box");
                if(boxcom instanceof SkillBaseBox)
                {
                    boxcom.DestoyBox(false);
                }
                else
                {
                    boxcom.DestoyBox();
                }
            }
            else
            {
                //todo 消除第一个
            }
            var result = this.ColorIsSame();
            if(result ==false)
            {
                _box.active = false;
                this.player.instance.PlayerOverAni();
                //this.game_over();
            }
            else
            {
                if(!this._Skilling)
                {
                    var SkillBase =  this.AllBoxs[indexs+1].getComponent("SkillBaseBox");
                
                    if(SkillBase != null&&SkillBase!=undefined)
                    {
                        SkillBase.SkillJump();
                    }
                }
            
                //播放声音
            }
        }.bind(this));
        
        var seq = cc.sequence(m1, end_func);

        this.map_root.runAction(seq);
        
    },

    ColorIsSame()
    {
        var _box = this.AllBoxs[this.player.instance.AllBoxIndex]
        
        var Boxcolor = _box.getComponent("Box").My_Color;
        if(Boxcolor == this.player.instance.InputColor)
        {
            this.curScore+=1;
            if(_box.getComponent("Box")._IsCoinBox)
            {
                this.curCoin += 1;
                _box.getComponent("Box")._IsCoinBox = false;
                _box.getComponent("Box").CoinNode.active = false;
                Init.Instance.SoundNode[2].play();
                
                //播放音效
            }
            
            this.UIScore.getComponent(cc.Label).string = this.curScore;
            this.UICoin.getComponent(cc.Label).string = this.curCoin;
            return true;
        }
        return false;
    },

    game_over()
    {
        if(this.player.instance.GameingState == "GameOver")
            return;
        //this.play.instance.ResurtCount++;
        this.player.instance.IsCanJump = false;
        
        this.player.instance.GameingState = "GameOver";
        if(this.player.instance.ResurtCount>=3)
        {
            Init.Instance.ShowUIEndTwo();
            this.node.parent.parent.Rank.submitScoreButtonFunc(this.curScore);
            if(CC_WECHATGAME)
            {
                window.wx.postMessage({
                    messageType: 4,
                    MAIN_MENU_NUM: "x1"
                });
                WXRequ.Instance.ShowOrHideAdervert(false);
            }
        }
        else
        {
            Init.Instance.ShowUIEndOne();
            this.node.parent.parent.Rank.submitScoreButtonFunc(this.curScore);
        }
        
        //if(CC_WECHATGAME)
        //{
            //WXRequ.Instance.C2G_GameOver(this.curScore);
        //}
    },

    game_Next()
    {
        this.clearAndGameStart();
        this.player.instance.startGame();
    },

    game_Resur()
    {
        WXRequ.Instance.ShowOrHideAdervert(false);
        this.player.instance.ResurtCount++;
        this.player.instance.GameingState = "Gameing";
        this.player.instance.IsCanJump = true;
        this.player.setRotation(0);
        var move = cc.moveBy(0,0,95);
        this.player.runAction(move);
        var box = this.AllBoxs[this.player.instance.AllBoxIndex].getComponent("Box");
        box.ShowBox();
    },

    update (dt) {
        
        if(this.BestScore.string == "历史最高undefined分");
        {
            this.BestScore.string = "历史最高"+  WXRequ.Instance.bestscore + "分";
        }
        
        if(this.curScore>=10*this.ScoreIndex)
        {
            this.ScoreIndex++;
            this.randomColor();
        }
        if(this.IsPause)
            return;
        this.changeColor(dt);
        if(this.player.instance.AllBoxIndex<=-1||this.StopUpdate == true)
            return;
        this.coolTime-=dt;
        
        if(this.coolTime<=0)
        {
            this.AllBoxs[this.player.instance.AllBoxIndex].getComponent("Box").DestoyBox(false);
            this.StopUpdate = true;
        }
    },

    changeColor(dt)
    {
        if(this.player.instance.GameingState == "GameOver")
            return;
        if(this.IsCanChangeColor)
        {
            this.ratio += dt * 0.05;
            this.groundPanel.color = this.groundPanel.color.lerp(this.targetColor,this.ratio);
            if(this.groundPanel.color.equals(this.targetColor))
            {
                this.IsCanChangeColor = false;
            }
        }
       
    }, 
    
    GetCorlor()
    {
        var isreture = false;
        while(isreture == false)
        {
            var outindex =  Math.floor(Math.random()*5);
            if(outindex != this.Index)
            {
                this.Index = outindex;
                isreture = true;
            }
        }
        return this.groundColor[this.Index];
    }
});
