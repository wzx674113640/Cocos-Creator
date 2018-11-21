let vert_file = require("./bright_vert.js");
let frag_file = require("./bright_frag.js");

cc.Class({
    extends : cc.Component,

    properties : {
        _time : 0.0,
        //_IsOpen: false
    },

    onLoad : function(){

        this._time = 0;
        this._sin = 0;
        this._use();
       
    },

    _use : function(){
        this._program = new cc.GLProgram();
        // this._program.initWithVertexShaderByteArray( vert_file, frag_file);
        this._program.initWithString(vert_file, frag_file);
        // 添加程序属性至GLSL中
        this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
        this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
        this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

        this._program.link();
        this._program.updateUniforms();
        this._program.use();
        this.updateGLParameters();

        // this._program.setUniformLocationWith1f(this._program.getUniformLocationForName("sys_time"),this._time);
        gl.uniform1f(this._program.getUniformLocationForName("sys_time"),this._time);
        this.setProgram(this.node._sgNode, this._program);
    },

    update : function( dt){
        //if(!this._IsOpen)
            //return;
        this._time += 1.5*dt;
        if(this._program){
            this._program.use();
            this._sin = Math.sin(this._time) * 10;
            if(this._sin >= 9.9){
                //this.IsOpen = false;
                this._sin = 0;
                this._time = 0;
            }        
            this._sin = Math.ceil(this._sin);
                //  this._program.setUniformLocationWith1f(this._program.getUniformLocationForName("sys_time"), this._sin);
            gl.uniform1f(this._program.getUniformLocationForName("sys_time"), this._sin);
        }
    },

    updateGLParameters : function(){
        this._time = Math.sin(Date.now());
    },

    setProgram : function(node, program){
        node.setShaderProgram(program);  

        var children = node.children;
        if (!children)
            return;
        for (var i = 0; i < children.length; i++)
        {
            this.setProgram(children[i], program);
        }
    },
});
