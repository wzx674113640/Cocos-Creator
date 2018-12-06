
var Init = require("Init");

var SkillBaseBox =  cc.Class({
    extends: require("Box"),

    properties: {
        IsSkill: true,
        SkillPic : cc.Node,
        //NodeLabel:cc.Node
    },

    
    onLoad()
    {
        this.gameControl = this.node.parent.parent.parent.getComponent("GameContorl");
        this.player = this.node.parent.parent.getChildByName("Player").getComponent("Player");
        
        var num =  Math.floor(Math.random()*4);
        this.BoxNode.getComponent(cc.Sprite).spriteFrame = Init.Instance._BoxSkinPics[num];
        this.My_Color = Init.Instance._BoxSkinStrings[num]; 
    },

    onStart()
    {
        this.IsSkill = true;
    },

    SkillJump() {
       if(this.IsSkill)
       {
            this.gameControl._Skilling = true;

            this.SkillPic.active = false;

            this.SkillJump1();
       }
    },

    SkillJump1()
    {

    },
    
    creatCoin()
    {

    }
});

