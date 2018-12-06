
cc.Class({
    extends: require("SkillBaseBox"),

    properties: {
        
    },



    SkillJump1()
    {
        this.gamecontorl.IsPause = true;
        this.gameControl._Skilling = false;
    }
});
