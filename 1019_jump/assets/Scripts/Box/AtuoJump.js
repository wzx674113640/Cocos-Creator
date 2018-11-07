
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
                case "黄色":
                    self.player.BtnS();
                    break;
                case "红色":
                    self.player.BtnD();
                    break;
                case "蓝色":
                    self.player.BtnF();
                    break;
            }
            if(index>=10)
            {
                this.gameControl._Skilling = false;
            }
        },0.3,10,0.3);
    }
});
