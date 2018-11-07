
cc.Class({
    extends: require("SkillBaseBox"),

    properties: {
       Mysprite:
       {
            type:cc.SpriteFrame,
            default:[],
       },

       Mystring:
       {
            type: cc.String,
            default:[],
       }

    },

    SkillJump1() {
        this.gameControl._Skilling = false;
        var index = Math.floor(Math.random()*4);
        var boxindex = this.player.AllBoxIndex;
        var count = this.gameControl.AllBoxs.length;
        for(var i = boxindex+1;i < count;i++)
        {
            //cc.log("变"+i);
            this.gameControl.AllBoxs[i].getComponent("Box").My_Color = this.Mystring[index];
            var skillbox =  this.gameControl.AllBoxs[i].getComponent("SkillBaseBox");
            if(skillbox!=null)
            {
                skillbox.IsSkill = false;
                skillbox.NodeLabel.active = false;
            }
            this.gameControl.AllBoxs[i].getComponent(cc.Sprite).spriteFrame = this.Mysprite[index];
        }
        //box.destroy();
        
    },

 
});
