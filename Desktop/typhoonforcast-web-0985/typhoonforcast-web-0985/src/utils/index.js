import * as util from './util';

let drawVert =
    `
    // 设定默认精度
precision mediump float;
    // attribute: 只能存在于vertex shader中，一般用于保存顶点或法线数据，它可以在数据缓冲区中读取数据
attribute float a_index;
    // uniform: 在运行时shader无法改变uniform变量，一般用来放置程序传递给shader的变换矩阵，材质，光照参数等等
uniform sampler2D u_particles;
uniform float u_particles_res;
    // varying: 主要负载在vertex和fragment之间传递变量
varying vec2 v_particle_pos;

void main() {
    // vec4: 四维浮点数向量
    // texture2D: 平面2D纹理查询
    vec4 color = texture2D(u_particles, vec2(
        // fract: 获取x的小数部分
        fract(a_index / u_particles_res),
        // floor: 获取<=x的最大整数
        floor(a_index / u_particles_res) / u_particles_res));

    // 从像素的RGBA值解码当前粒子位置
    v_particle_pos = vec2(
        color.r / 255.0 + color.b,
        color.g / 255.0 + color.a);

    gl_PointSize = 0.2;
    gl_Position = vec4(2.0 * v_particle_pos.x - 1.0, 1.0 - 2.0 * v_particle_pos.y, 0, 1);
}
`
let drawFrag =
    `
precision mediump float;
    // sampler2D: 2D纹理
uniform sampler2D u_wind;
uniform vec2 u_wind_min;
uniform vec2 u_wind_max;
uniform sampler2D u_color_ramp;

varying vec2 v_particle_pos;

void main() {
    vec2 velocity = mix(u_wind_min, u_wind_max, texture2D(u_wind, v_particle_pos).rg);
    float speed_t = length(velocity) / length(u_wind_max);

    // 颜色斜坡编码在一个16x16的纹理
    vec2 ramp_pos = vec2(
        fract(16.0 * speed_t),
        floor(16.0 * speed_t) / 16.0);

    gl_FragColor = texture2D(u_color_ramp, ramp_pos);
}
`
let quadVert =
    `
precision mediump float;

attribute vec2 a_pos;

varying vec2 v_tex_pos;

void main() {
    v_tex_pos = a_pos;
    gl_Position = vec4(1.0 - 2.0 * a_pos, 0, 1);
}
`
let screenFrag =
    `
precision mediump float;

uniform sampler2D u_screen;
uniform float u_opacity;

varying vec2 v_tex_pos;

void main() {
    vec4 color = texture2D(u_screen, 1.0 - v_tex_pos);
    // 一个hack值，以保持在即使值接近1.0的时候不透明度淡出
    gl_FragColor = vec4(floor(255.0 * color * u_opacity) / 255.0);
}
`
let updateFrag =
    `
precision highp float;

uniform sampler2D u_particles;
uniform sampler2D u_wind;
uniform vec2 u_wind_res;
uniform vec2 u_wind_min;
uniform vec2 u_wind_max;
uniform float u_rand_seed;
uniform float u_speed_factor;
uniform float u_drop_rate;
uniform float u_drop_rate_bump;

varying vec2 v_tex_pos;

// 伪随机信号发生器
const vec3 rand_constants = vec3(12.9898, 78.233, 4375.85453);
float rand(const vec2 co) {
    float t = dot(rand_constants.xy, co);
    return fract(sin(t) * (rand_constants.z + t));
}

// 风速查找；使用基于4个相邻像素的手动双线性滤波进行平滑插值
vec2 lookup_wind(const vec2 uv) {
    // return texture2D(u_wind, uv).rg; // lower-res hardware filtering
    vec2 px = 1.0 / u_wind_res;
    vec2 vc = (floor(uv * u_wind_res)) * px;
    vec2 f = fract(uv * u_wind_res);
    vec2 tl = texture2D(u_wind, vc).rg;
    vec2 tr = texture2D(u_wind, vc + vec2(px.x, 0)).rg;
    vec2 bl = texture2D(u_wind, vc + vec2(0, px.y)).rg;
    vec2 br = texture2D(u_wind, vc + px).rg;
    return mix(mix(tl, tr, f.x), mix(bl, br, f.x), f.y);
}

void main() {
    vec4 color = texture2D(u_particles, v_tex_pos);
    vec2 pos = vec2(
        color.r / 255.0 + color.b,
        color.g / 255.0 + color.a); // decode particle position from pixel RGBA

    vec2 velocity = mix(u_wind_min, u_wind_max, lookup_wind(pos));
    float speed_t = length(velocity) / length(u_wind_max);

    // 在计算粒子移动的位置时，考虑EPSG:4236失真
    float distortion = cos(radians(pos.y * 180.0 - 90.0));
    vec2 offset = vec2(velocity.x / distortion, -velocity.y) * 0.0001 * u_speed_factor;

    // 更新粒子位置，环绕date line
    pos = fract(1.0 + pos + offset);

    // 用于粒子掉落的随机种子
    vec2 seed = (pos + v_tex_pos) * u_rand_seed;

    // drop rate is a chance a particle will restart at random position, to avoid degeneration
    float drop_rate = u_drop_rate + speed_t * u_drop_rate_bump;
    float drop = step(1.0 - drop_rate, rand(seed));

    vec2 random_pos = vec2(
        rand(seed + 1.3),
        rand(seed + 2.1));
    pos = mix(pos, random_pos, drop);

    // 将新的粒子位置编码回RGBA
    gl_FragColor = vec4(
        fract(pos * 255.0),
        floor(pos * 255.0) / 255.0);
}
`
// const defaultRampColors = {
//     0.0: '#3288bd',
//     0.1: '#66c2a5',
//     0.2: '#abdda4',
//     0.3: '#e6f598',
//     0.4: '#fee08b',
//     0.5: '#fdae61',
//     0.6: '#f46d43',
//     1.0: '#d53e4f'
// };

const defaultRampColors = {
    0.0: '#fff',
    0.1: '#fff',
    0.2: '#fff',
    0.3: '#fff',
    0.4: '#fff',
    0.5: '#fff',
    0.6: '#fff',
    1.0: '#fff'
};

export default class WindGL {
    constructor(gl) {
        this.gl = gl;

        this.fadeOpacity = 0.99; // 粒子轨迹在每帧中的衰减速度
        this.speedFactor = 0.05; // 粒子移动速度
        this.dropRate = 0.001; // 粒子移动到随机位置的频率是多少
        this.dropRateBump = 0.02; // drop rate increase relative to individual particle speed

        this.drawProgram = util.createProgram(gl, drawVert, drawFrag);
        this.screenProgram = util.createProgram(gl, quadVert, screenFrag);
        this.updateProgram = util.createProgram(gl, quadVert, updateFrag);

        this.quadBuffer = util.createBuffer(gl, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]));
        this.framebuffer = gl.createFramebuffer();

        this.setColorRamp(defaultRampColors);
        this.resize();
    }

    resize() {
        const gl = this.gl;
        const emptyPixels = new Uint8Array(gl.canvas.width * gl.canvas.height * 4);
        // 屏幕纹理用于保存前一帧和当前帧绘制的屏幕
        this.backgroundTexture = util.createTexture(gl, gl.NEAREST, emptyPixels, gl.canvas.width, gl.canvas.height);
        this.screenTexture = util.createTexture(gl, gl.NEAREST, emptyPixels, gl.canvas.width, gl.canvas.height);
    }

    setColorRamp(colors) {
        // 根据粒子的速度查找着色纹理
        this.colorRampTexture = util.createTexture(this.gl, this.gl.LINEAR, getColorRamp(colors), 16, 16);
    }

    set numParticles(numParticles) {
        const gl = this.gl;

        // 我们创建了一个正方形纹理，每个像素都拥有一个编码为RGBA的粒子位置
        const particleRes = this.particleStateResolution = Math.ceil(Math.sqrt(numParticles));
        this._numParticles = particleRes * particleRes;

        const particleState = new Uint8Array(this._numParticles * 4);
        for (let i = 0; i < particleState.length; i++) {
            particleState[i] = Math.floor(Math.random() * 256); // 随机化初始粒子的位置
        }
        // 纹理保存当前和下一帧的粒子状态
        this.particleStateTexture0 = util.createTexture(gl, gl.NEAREST, particleState, particleRes, particleRes);
        this.particleStateTexture1 = util.createTexture(gl, gl.NEAREST, particleState, particleRes, particleRes);

        const particleIndices = new Float32Array(this._numParticles);
        for (let i = 0; i < this._numParticles; i++) particleIndices[i] = i;
        this.particleIndexBuffer = util.createBuffer(gl, particleIndices);
    }
    get numParticles() {
        return this._numParticles;
    }

    setWind(windData) {
        this.windData = windData;
        this.windTexture = util.createTexture(this.gl, this.gl.LINEAR, windData.image);
    }

    draw() {
        const gl = this.gl;
        // 禁用深度比较并更新深度缓冲区
        gl.disable(gl.DEPTH_TEST);
        // 停用模板测试并更新模板缓冲区
        gl.disable(gl.STENCIL_TEST);

        util.bindTexture(gl, this.windTexture, 0);
        util.bindTexture(gl, this.particleStateTexture0, 1);

        this.drawScreen();
        this.updateParticles();
    }

    drawScreen() {
        const gl = this.gl;
        // 将屏幕绘制到一个临时帧缓冲区中，以保留它作为下一帧的背景
        util.bindFramebuffer(gl, this.framebuffer, this.screenTexture);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        this.drawTexture(this.backgroundTexture, this.fadeOpacity);
        this.drawParticles();

        util.bindFramebuffer(gl, null);

        //支持在现有背景上绘制(例如地图)
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        this.drawTexture(this.screenTexture, 1.0);
        gl.disable(gl.BLEND);

        //保存当前屏幕为下一帧的背景
        const temp = this.backgroundTexture;
        this.backgroundTexture = this.screenTexture;
        this.screenTexture = temp;
    }

    drawTexture(texture, opacity) {
        const gl = this.gl;
        const program = this.screenProgram;
        gl.useProgram(program.program);

        util.bindAttribute(gl, this.quadBuffer, program.a_pos, 2);
        util.bindTexture(gl, texture, 2);
        gl.uniform1i(program.u_screen, 2);
        gl.uniform1f(program.u_opacity, opacity);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    drawParticles() {
        const gl = this.gl;
        const program = this.drawProgram;
        gl.useProgram(program.program);

        util.bindAttribute(gl, this.particleIndexBuffer, program.a_index, 1);
        util.bindTexture(gl, this.colorRampTexture, 2);

        gl.uniform1i(program.u_wind, 0);
        gl.uniform1i(program.u_particles, 1);
        gl.uniform1i(program.u_color_ramp, 2);

        gl.uniform1f(program.u_particles_res, this.particleStateResolution);
        gl.uniform2f(program.u_wind_min, this.windData.uMin, this.windData.vMin);
        gl.uniform2f(program.u_wind_max, this.windData.uMax, this.windData.vMax);

        gl.drawArrays(gl.POINTS, 0, this._numParticles);
    }

    updateParticles() {
        const gl = this.gl;
        util.bindFramebuffer(gl, this.framebuffer, this.particleStateTexture1);
        gl.viewport(0, 0, this.particleStateResolution, this.particleStateResolution);

        const program = this.updateProgram;
        gl.useProgram(program.program);

        util.bindAttribute(gl, this.quadBuffer, program.a_pos, 2);

        gl.uniform1i(program.u_wind, 0);
        gl.uniform1i(program.u_particles, 1);

        gl.uniform1f(program.u_rand_seed, Math.random());
        gl.uniform2f(program.u_wind_res, this.windData.width, this.windData.height);
        gl.uniform2f(program.u_wind_min, this.windData.uMin, this.windData.vMin);
        gl.uniform2f(program.u_wind_max, this.windData.uMax, this.windData.vMax);
        gl.uniform1f(program.u_speed_factor, this.speedFactor);
        gl.uniform1f(program.u_drop_rate, this.dropRate);
        gl.uniform1f(program.u_drop_rate_bump, this.dropRateBump);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // 交换粒子状态纹理，使新纹理成为当前纹理
        const temp = this.particleStateTexture0;
        this.particleStateTexture0 = this.particleStateTexture1;
        this.particleStateTexture1 = temp;
    }
}

function getColorRamp(colors) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 256;
    canvas.height = 1;

    const gradient = ctx.createLinearGradient(0, 0, 256, 0);
    for (const stop in colors) {
        gradient.addColorStop(+stop, colors[stop]);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 1);

    return new Uint8Array(ctx.getImageData(0, 0, 256, 1).data);
}
