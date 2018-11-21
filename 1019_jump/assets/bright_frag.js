module.exports = 
`
#ifdef GL_ES
precision mediump float;
#endif
varying vec2 v_texCoord;
uniform float sys_time;
void main()
{
    vec4 src_color = texture2D(CC_Texture0, v_texCoord).rgba;

    float width = 0.25;       //流光的宽度范围 (调整该值改变流光的宽度)
    float start = sys_time/7.0;  //流光的起始x坐标
    float strength = 0.01;   //流光增亮强度   (调整该值改变流光的增亮强度)
    float offset = 0.2;      //偏移值         (调整该值改变流光的倾斜程度)
    //if( start <= v_texCoord.x && v_texCoord.x <= (start + width))
    if( v_texCoord.x < (start - offset * v_texCoord.y) &&  v_texCoord.x > (start - offset * v_texCoord.y - width))
    {
        float center_l = (start - offset * v_texCoord.y - width) - (start - offset * v_texCoord.y);
        center_l = abs(center_l);
        float l = abs((start - offset * v_texCoord.y) - center_l/2.0 - v_texCoord.x);
        float a = 5.0 * (center_l/2.0-l)/(center_l/2.0); // tony 流光中心强度（只有调整这个值才会生效，*前面的数值）
        float strength = 0.005 * a;
        if (strength < 0.00392) strength = 0.00392;
        vec3 improve = strength * vec3(255, 100, 100); //颜色
        //tony 保证不变黑
        if (improve.x < 1.0) improve.x = 1.0;
        if (improve.y < 1.0) improve.y = 1.0;
        if (improve.z < 1.0) improve.z = 1.0;
        vec3 result = improve * vec3( src_color.r, src_color.g, src_color.b);
        gl_FragColor = vec4(result, src_color.a);

    }else{
        gl_FragColor = src_color;
    }
}
`
