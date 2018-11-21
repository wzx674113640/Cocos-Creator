var Init = require("Init");
var WXRequ  = require("WXRequ");

cc.Class({
    extends: require("BaseUIPop"),

    properties: {
        
    },


    


//跳转程序
    jumpProgram()
    {
        WXRequ.Instance.associatedProgram('wxa835be15c6c0e072');
    },

    jumpProgram2()
    {
        WXRequ.Instance.associatedProgram('wx716f0b4ba78a47e8');
    },
});
