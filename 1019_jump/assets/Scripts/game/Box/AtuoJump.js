
var AtuoJump =  cc.Class({
    extends: require("SkillBaseBox"),

    properties: {
        
    },

    SkillJump1()
    {
        var self  = this;
        var index = 0;
        this.schedule(function() {
            var color =  self.gameControl.AllBoxs[self.player.AllBoxIndex+1].getComponent("Box").My_Color;
            index++;
            switch(color)
            {
                case "紫色":
                    self.player.BtnA();
                    break;
                case "红色":
                    self.player.BtnS();
                    break;
                case "橙色":
                    self.player.BtnD();
                    break;
                case "绿色":
                    self.player.BtnF();
                    break;
            }
            if(index>=10)
            {
                self.gameControl._Skilling = false;
                this.node.destroy();
            }
        },0.3,10,0.3);
    }
});
