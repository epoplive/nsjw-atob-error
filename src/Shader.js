import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

const fragmentShader = `
#include <common>

uniform vec3 iResolution;
uniform float iTime;

// By iq: https://www.shadertoy.com/user/iq
// license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;

    // Time varying pixel color
    vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));

    // Output to screen
    fragColor = vec4(col,1.0);
}

void main() {
  mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

export default function Shader({ color }) {
    const shaderRef = useRef();

    console.log(color);

    const uniforms = {
        iTime: { value: 0 },
        iResolution: { value: new Vector3() },
        COLOR: { value: color },
        // COLOR: { value: new Vector3(0.33, 0.25, 0.44) },
        BG: { value: new Vector3(0, 0, 0) },
        ZOOM: { value: 1.0 },
        OCTAVES: { value: 6 },
        INTENSITY: { value: 3.0 }
    };
    // const { size } = useThree();

    useFrame(({ clock }) => {
        shaderRef.current.uniforms.iTime.value = clock.getElapsedTime();
        shaderRef.current.uniforms.iResolution.value.set(600, 600, 1);
        shaderRef.current.uniforms.COLOR.value = color;
    });

    return (
        <mesh>
            <planeBufferGeometry attach="geometry" args={[2, 2]} />
            <shaderMaterial
                ref={shaderRef}
                attach="material"
                uniforms={uniforms}
                fragmentShader={otherShader}
            />
        </mesh>
    );
}

// const vec3 COLOR = vec3(0.33, 0.15, 0.44);
// const vec3 BG = vec3(0.0, 0.0, 0.0);
// const float ZOOM = 1.0;
// const int OCTAVES = 6;
// const float INTENSITY = 3.;

const otherShader = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 iResolution;
uniform float iTime;
uniform vec3 COLOR;
uniform vec3 BG;
uniform float ZOOM;
uniform int OCTAVES;
uniform float INTENSITY;


float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9818,79.279)))*43758.5453123);
}

vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)), dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0 * fract(sin(st) * 43759.34517123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // smootstep
    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}


float fractal_brownian_motion(vec2 coord) {
	float value = 0.0;
	float scale = 0.5;
	for (int i = 0; i < 4; i++) {
		value += noise(coord) * scale;
		coord *= 2.0;
		scale *= 0.5;
	}
	return value + 0.2;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 st = fragCoord.xy / iResolution.xy;
	st *= iResolution.xy  / iResolution.y;    
    vec2 pos = vec2(st * ZOOM);
	vec2 motion = vec2(fractal_brownian_motion(pos + vec2(iTime * -0.2, iTime * -0.2)));
	float final = fractal_brownian_motion(pos + motion) * INTENSITY;
    fragColor = vec4(mix(BG, COLOR, final), 1.0);
}
void main() {
  mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;
