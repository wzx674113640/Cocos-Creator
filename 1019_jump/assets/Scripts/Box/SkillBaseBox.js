

var SkillBaseBox =  cc.Class({
    extends: require("Box"),

    properties: {
        IsSkill: true,

        NodeLabel:cc.Node
    },


    onLoad()
    {
        this.gameControl = this.node.parent.parent.parent.getComponent("GameContorl");
        this.player = this.node.parent.parent.getChildByName("Player").getComponent("Player");
    },

    onStart()
    {
        this.IsSkill = true;
    },

    SkillJump() {
       
       if(this.IsSkill)
       {
            this.gameControl._Skilling = true;
            this.SkillJump1();
       }
    },

    SkillJump1()
    {

    }
});

