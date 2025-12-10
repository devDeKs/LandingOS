import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Sparkles, SendIcon, Paperclip, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

// ===================== SHADER =====================
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  #ifdef GL_ES
    precision lowp float;
  #endif
  uniform float iTime;
  uniform vec2 iResolution;
  varying vec2 vUv;
  
  vec4 buf[8];
  
  vec4 sigmoid(vec4 x) { return 1. / (1. + exp(-x)); }
  
  vec4 cppn_fn(vec2 coordinate, float in0, float in1, float in2) {
    // layer 1 *********************************************************************
    buf[6] = vec4(coordinate.x, coordinate.y, 0.3948333106474662 + in0, 0.36 + in1);
    buf[7] = vec4(0.14 + in2, sqrt(coordinate.x * coordinate.x + coordinate.y * coordinate.y), 0., 0.);

    // layer 2 ********************************************************************
    buf[0] = mat4(vec4(6.5404263, -3.6126034, 0.7590882, -1.13613), vec4(2.4582713, 3.1660357, 1.2219609, 0.06276096), vec4(-5.478085, -6.159632, 1.8701609, -4.7742867), vec4(6.039214, -5.542865, -0.90925294, 3.251348))
    * buf[6]
    + mat4(vec4(0.8473259, -5.722911, 3.975766, 1.6522468), vec4(-0.24321538, 0.5839259, -1.7661959, -5.350116), vec4(0.0, 0.0, 0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0))
    * buf[7]
    + vec4(0.21808943, 1.1243913, -1.7969975, 5.0294676);
    
    buf[1] = mat4(vec4(-3.3522482, -6.0612736, 0.55641043, -4.4719114), vec4(0.8631464, 1.7432913, 5.643898, 1.6106541), vec4(2.4941394, -3.5012043, 1.7184316, 6.357333), vec4(3.310376, 8.209261, 1.1355612, -1.165539))
    * buf[6]
    + mat4(vec4(5.24046, -13.034365, 0.009859298, 15.870829), vec4(2.987511, 3.129433, -0.89023495, -1.6822904), vec4(0.0, 0.0, 0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0))
    * buf[7]
    + vec4(-5.9457836, -6.573602, -0.8812491, 1.5436668);

    buf[0] = sigmoid(buf[0]);
    buf[1] = sigmoid(buf[1]);

    // layer 3 ********************************************************************
    buf[2] = mat4(vec4(-15.219568, 8.095543, -2.429353, -1.9381982), vec4(-5.951362, 4.3115187, 2.6393783, 1.274315), vec4(-7.3145227, 6.7297835, 5.2473326, 5.9411426), vec4(5.0796127, 8.979051, -1.7278991, -1.158976))
    * buf[6]
    + mat4(vec4(-11.967154, -11.608155, 6.1486754, 11.237008), vec4(2.124141, -6.263192, -1.7050359, -0.7021966), vec4(0.0, 0.0, 0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0))
    * buf[7]
    + vec4(-4.17164, -3.2281182, -4.576417, -3.6401186);
    
    buf[3] = mat4(vec4(3.1832156, -13.738922, 1.879223, 3.233465), vec4(0.64300746, 12.768129, 1.9141049, 0.50990224), vec4(-0.049295485, 4.4807224, 1.4733979, 1.801449), vec4(5.0039253, 13.000481, 3.3991797, -4.5561905))
    * buf[6]
    + mat4(vec4(-0.1285731, 7.720628, -3.1425676, 4.742367), vec4(0.6393625, 3.714393, -0.8108378, -0.39174938), vec4(0.0, 0.0, 0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0))
    * buf[7]
    + vec4(-1.1811101, -21.621881, 0.7851888, 1.2329718);
    
    buf[2] = sigmoid(buf[2]);
    buf[3] = sigmoid(buf[3]);

    // layer 5 & 6 ****************************************************************
    buf[4] = mat4(vec4(5.214916, -7.183024, 2.7228765, 2.6592617), vec4(-5.601878, -25.3591, 4.067988, 0.4602802), vec4(-10.57759, 24.286327, 21.102104, 37.546658), vec4(4.3024497, -1.9625226, 2.3458803, -1.372816))
    * buf[0]
    + mat4(vec4(-17.6526, -10.507558, 2.2587414, 12.462782), vec4(6.265566, -502.75443, -12.642513, 0.9112289), vec4(-10.983244, 20.741234, -9.701768, -0.7635988), vec4(5.383626, 1.4819539, -4.1911616, -4.8444734))
    * buf[1]
    + mat4(vec4(12.785233, -16.345072, -0.39901125, 1.7955981), vec4(-30.48365, -1.8345358, 1.4542528, -1.1118771), vec4(19.872723, -7.337935, -42.941723, -98.52709), vec4(8.337645, -2.7312303, -2.2927687, -36.142323))
    * buf[2]
    + mat4(vec4(-16.298317, 3.5471997, -0.44300047, -9.444417), vec4(57.5077, -35.609753, 16.163465, -4.1534753), vec4(-0.07470326, -3.8656476, -7.0901804, 3.1523974), vec4(-12.559385, -7.077619, 1.490437, -0.8211543))
    * buf[3]
    + vec4(-7.67914, 15.927437, 1.3207729, -1.6686112);
    
    buf[5] = mat4(vec4(-1.4109162, -0.372762, -3.770383, -21.367174), vec4(-6.2103205, -9.35908, 0.92529047, 8.82561), vec4(11.460242, -22.348068, 13.625772, -18.693201), vec4(-0.3429052, -3.9905605, -2.4626114, -0.45033523))
    * buf[0]
    + mat4(vec4(7.3481627, -4.3661838, -6.3037653, -3.868115), vec4(1.5462853, 6.5488915, 1.9701879, -0.58291394), vec4(6.5858274, -2.2180402, 3.7127688, -1.3730392), vec4(-5.7973905, 10.134961, -2.3395722, -5.965605))
    * buf[1]
    + mat4(vec4(-2.5132585, -6.6685553, -1.4029363, -0.16285264), vec4(-0.37908727, 0.53738135, 4.389061, -1.3024765), vec4(-0.70647055, 2.0111287, -5.1659346, -3.728635), vec4(-13.562562, 10.487719, -0.9173751, -2.6487076))
    * buf[2]
    + mat4(vec4(-8.645013, 6.5546675, -6.3944063, -5.5933375), vec4(-0.57783127, -1.077275, 36.91025, 5.736769), vec4(14.283112, 3.7146652, 7.1452246, -4.5958776), vec4(2.7192075, 3.6021907, -4.366337, -2.3653464))
    * buf[3]
    + vec4(-5.9000807, -4.329569, 1.2427121, 8.59503);

    buf[4] = sigmoid(buf[4]);
    buf[5] = sigmoid(buf[5]);

    // layer 7 & 8 ****************************************************************
    buf[6] = mat4(vec4(-1.61102, 0.7970257, 1.4675229, 0.20917463), vec4(-28.793737, -7.1390953, 1.5025433, 4.656581), vec4(-10.94861, 39.66238, 0.74318546, -10.095605), vec4(-0.7229728, -1.5483948, 0.7301322, 2.1687684))
    * buf[0]
    + mat4(vec4(3.2547753, 21.489103, -1.0194173, -3.3100595), vec4(-3.7316632, -3.3792162, -7.223193, -0.23685838), vec4(13.1804495, 0.7916005, 5.338587, 5.687114), vec4(-4.167605, -17.798311, -6.815736, -1.6451967))
    * buf[1]
    + mat4(vec4(0.604885, -7.800309, -7.213122, -2.741014), vec4(-3.522382, -0.12359311, -0.5258442, 0.43852118), vec4(9.6752825, -22.853785, 2.062431, 0.099892326), vec4(-4.3196306, -17.730087, 2.5184598, 5.30267))
    * buf[2]
    + mat4(vec4(-6.545563, -15.790176, -6.0438633, -5.415399), vec4(-43.591583, 28.551912, -16.00161, 18.84728), vec4(4.212382, 8.394307, 3.0958717, 8.657522), vec4(-5.0237565, -4.450633, -4.4768, -5.5010443))
    * buf[3]
    + mat4(vec4(1.6985557, -67.05806, 6.897715, 1.9004834), vec4(1.8680354, 2.3915145, 2.5231109, 4.081538), vec4(11.158006, 1.7294737, 2.0738268, 7.386411), vec4(-4.256034, -306.24686, 8.258898, -17.132736))
    * buf[4]
    + mat4(vec4(1.6889864, -4.5852966, 3.8534803, -6.3482175), vec4(1.3543309, -1.2640043, 9.932754, 2.9079645), vec4(-5.2770967, 0.07150358, -0.13962056, 3.3269649), vec4(28.34703, -4.918278, 6.1044083, 4.085355))
    * buf[5]
    + vec4(6.6818056, 12.522166, -3.7075126, -4.104386);
    
    buf[7] = mat4(vec4(-8.265602, -4.7027016, 5.098234, 0.7509808), vec4(8.6507845, -17.15949, 16.51939, -8.884479), vec4(-4.036479, -2.3946867, -2.6055532, -1.9866527), vec4(-2.2167742, -1.8135649, -5.9759874, 4.8846445))
    * buf[0]
    + mat4(vec4(6.7790847, 3.5076547, -2.8191125, -2.7028968), vec4(-5.743024, -0.27844876, 1.4958696, -5.0517144), vec4(13.122226, 15.735168, -2.9397483, -4.101023), vec4(-14.375265, -5.030483, -6.2599335, 2.9848232))
    * buf[1]
    + mat4(vec4(4.0950394, -0.94011575, -5.674733, 4.755022), vec4(4.3809423, 4.8310084, 1.7425908, -3.437416), vec4(2.117492, 0.16342592, -104.56341, 16.949184), vec4(-5.22543, -2.994248, 3.8350096, -1.9364246))
    * buf[2]
    + mat4(vec4(-5.900337, 1.7946124, -13.604192, -3.8060522), vec4(6.6583457, 31.911177, 25.164474, 91.81147), vec4(11.840538, 4.1503043, -0.7314397, 6.768467), vec4(-6.3967767, 4.034772, 6.1714606, -0.32874924))
    * buf[3]
    + mat4(vec4(3.4992442, -196.91893, -8.923708, 2.8142626), vec4(3.4806502, -3.1846354, 5.1725626, 5.1804223), vec4(-2.4009497, 15.585794, 1.2863957, 2.0252278), vec4(-71.25271, -62.441242, -8.138444, 0.50670296))
    * buf[4]
    + mat4(vec4(-12.291733, -11.176166, -7.3474145, 4.390294), vec4(10.805477, 5.6337385, -0.9385842, -4.7348723), vec4(-12.869276, -7.039391, 5.3029537, 7.5436664), vec4(1.4593618, 8.91898, 3.5101583, 5.840625))
    * buf[5]
    + vec4(2.2415268, -6.705987, -0.98861027, -2.117676);

    buf[6] = sigmoid(buf[6]);
    buf[7] = sigmoid(buf[7]);

    // layer 9 ********************************************************************
    buf[0] = mat4(vec4(1.6794263, 1.3817469, 2.9625452, 0.0), vec4(-1.8834411, -1.4806935, -3.5924516, 0.0), vec4(-1.3279216, -1.0918057, -2.3124623, 0.0), vec4(0.2662234, 0.23235129, 0.44178495, 0.0))
    * buf[0]
    + mat4(vec4(-0.6299101, -0.5945583, -0.9125601, 0.0), vec4(0.17828953, 0.18300213, 0.18182953, 0.0), vec4(-2.96544, -2.5819945, -4.9001055, 0.0), vec4(1.4195864, 1.1868085, 2.5176322, 0.0))
    * buf[1]
    + mat4(vec4(-1.2584374, -1.0552157, -2.1688404, 0.0), vec4(-0.7200217, -0.52666044, -1.438251, 0.0), vec4(0.15345335, 0.15196142, 0.272854, 0.0), vec4(0.945728, 0.8861938, 1.2766753, 0.0))
    * buf[2]
    + mat4(vec4(-2.4218085, -1.968602, -4.35166, 0.0), vec4(-22.683098, -18.0544, -41.954372, 0.0), vec4(0.63792, 0.5470648, 1.078634, 0.0), vec4(-1.5489894, -1.3075932, -2.6444845, 0.0))
    * buf[3]
    + mat4(vec4(-0.49252132, -0.39877754, -0.91366625, 0.0), vec4(0.95609266, 0.7923952, 1.640221, 0.0), vec4(0.30616966, 0.15693925, 0.8639857, 0.0), vec4(1.1825981, 0.94504964, 2.176963, 0.0))
    * buf[4]
    + mat4(vec4(0.35446745, 0.3293795, 0.59547555, 0.0), vec4(-0.58784515, -0.48177817, -1.0614829, 0.0), vec4(2.5271258, 1.9991658, 4.6846647, 0.0), vec4(0.13042648, 0.08864098, 0.30187556, 0.0))
    * buf[5]
    + mat4(vec4(-1.7718065, -1.4033192, -3.3355875, 0.0), vec4(3.1664357, 2.638297, 5.378702, 0.0), vec4(-3.1724713, -2.6107926, -5.549295, 0.0), vec4(-2.851368, -2.249092, -5.3013067, 0.0))
    * buf[6]
    + mat4(vec4(1.5203838, 1.2212278, 2.8404984, 0.0), vec4(1.5210563, 1.2651345, 2.683903, 0.0), vec4(2.9789467, 2.4364579, 5.2347264, 0.0), vec4(2.2270417, 1.8825914, 3.8028636, 0.0))
    * buf[7]
    + vec4(-1.5468478, -3.6171484, 0.24762098, 0.0);
    
    buf[0] = sigmoid(buf[0]);
    return vec4(buf[0].x , buf[0].y , buf[0].z, 1.0);
  }
  
  void main() {
    vec2 uv = vUv * 2.0 - 1.0; uv.y *= -1.0;
    vec4 noise = cppn_fn(uv, 0.1 * sin(0.3 * iTime), 0.1 * sin(0.69 * iTime), 0.1 * sin(0.44 * iTime));
    
    // Premium Deep Purple Palette
    vec3 color1 = vec3(0.0, 0.0, 0.02);    // Midnight Purple (Almost Black)
    vec3 color2 = vec3(0.08, 0.0, 0.25);   // Deep Royal Purple
    vec3 color3 = vec3(0.25, 0.0, 0.75);   // Electric Indigo/Purple
    vec3 color4 = vec3(0.6, 0.2, 1.0);     // Luminous Violet
    
    // Mix colors based on noise value
    float val = noise.x; // Use one of the output channels
    
    vec3 finalColor = mix(color1, color2, smoothstep(0.0, 0.4, val));
    finalColor = mix(finalColor, color3, smoothstep(0.4, 0.7, val));
    finalColor = mix(finalColor, color4, smoothstep(0.7, 1.0, val));
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const CPPNShaderMaterial = shaderMaterial(
    { iTime: 0, iResolution: new THREE.Vector2(1, 1) },
    vertexShader,
    fragmentShader
);

extend({ CPPNShaderMaterial });

function ShaderPlane() {
    const meshRef = useRef(null);
    const materialRef = useRef(null);
    const { viewport } = useThree();

    useFrame((state) => {
        if (!materialRef.current) return;
        materialRef.current.iTime = state.clock.elapsedTime;
        const { width, height } = state.size;
        materialRef.current.iResolution.set(width, height);
    });

    return (
        <mesh ref={meshRef} scale={[viewport.width, viewport.height * 1.5, 1]} position={[0, -viewport.height * 0.25, 0]}>
            <planeGeometry args={[1, 1]} />
            <cPPNShaderMaterial ref={materialRef} side={THREE.DoubleSide} />
        </mesh>
    );
}

function ShaderBackground() {
    const canvasRef = useRef(null);

    useGSAP(() => {
        if (canvasRef.current) {
            gsap.fromTo(canvasRef.current, { opacity: 0 }, { opacity: 1, duration: 1.5, ease: "power2.out" });
        }
    }, { scope: canvasRef });

    return (
        <div
            ref={canvasRef}
            className="fixed inset-0 h-screen w-screen -z-50 pointer-events-none"
            style={{ background: '#030014' }}
        >
            <Canvas
                camera={{ position: [0, 0, 1], fov: 75 }}
                gl={{ antialias: true, alpha: false }}
                dpr={[1, 1.5]}
                style={{ width: '100%', height: '100%' }}
            >
                <ShaderPlane />
            </Canvas>
        </div>
    );
}

function StarBackground({ color = "currentColor" }) {
    return (
        <svg
            width="100%"
            height="100%"
            preserveAspectRatio="none"
            viewBox="0 0 100 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clipPath="url(#clip0_408_119)">
                <path
                    d="M32.34 26.68C32.34 26.3152 32.0445 26.02 31.68 26.02C31.3155 26.02 31.02 26.3152 31.02 26.68C31.02 27.0448 31.3155 27.34 31.68 27.34C32.0445 27.34 32.34 27.0448 32.34 26.68Z"
                    fill={color}
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M56.1 3.96C56.4645 3.96 56.76 4.25519 56.76 4.62C56.76 4.98481 56.4645 5.28 56.1 5.28C55.9131 5.28 55.7443 5.20201 55.624 5.07762C55.5632 5.01446 55.5147 4.93904 55.4829 4.8559C55.4552 4.78243 55.44 4.70315 55.44 4.62C55.44 4.5549 55.4494 4.49174 55.4668 4.43244C55.4906 4.35188 55.5292 4.27775 55.5795 4.21329C55.7004 4.05926 55.8885 3.96 56.1 3.96ZM40.26 17.16C40.6245 17.16 40.92 17.4552 40.92 17.82C40.92 18.1848 40.6245 18.48 40.26 18.48C39.8955 18.48 39.6 18.1848 39.6 17.82C39.6 17.4552 39.8955 17.16 40.26 17.16ZM74.58 5.28C74.7701 5.28 74.9413 5.36057 75.0618 5.48882C75.073 5.50043 75.0837 5.51268 75.094 5.52557C75.1088 5.54426 75.1231 5.56359 75.1359 5.58357L75.1479 5.60291L75.1595 5.62353C75.1711 5.64481 75.1814 5.66672 75.1906 5.68928C75.2226 5.76662 75.24 5.85106 75.24 5.94C75.24 6.1585 75.1336 6.3525 74.9699 6.47238C74.9158 6.51234 74.8555 6.54393 74.7908 6.56584C74.7247 6.58775 74.6538 6.6 74.58 6.6C74.2156 6.6 73.92 6.30481 73.92 5.94C73.92 5.87684 73.929 5.8156 73.9455 5.7576C73.9596 5.70862 73.979 5.66221 74.0032 5.61903C74.0657 5.50688 74.1595 5.41471 74.2728 5.35541C74.3647 5.30707 74.4691 5.28 74.58 5.28ZM21.66 33.52C22.0245 33.52 22.32 33.8152 22.32 34.18C22.32 34.5448 22.0245 34.84 21.66 34.84C21.2955 34.84 21 34.5448 21 34.18C21 33.8152 21.2955 33.52 21.66 33.52ZM8.16 32.86C8.16 32.4952 7.8645 32.2 7.5 32.2C7.1355 32.2 6.84 32.4952 6.84 32.86C6.84 33.2248 7.1355 33.52 7.5 33.52C7.8645 33.52 8.16 33.2248 8.16 32.86ZM7.5 23.68C7.8645 23.68 8.16 23.9752 8.16 24.34C8.16 24.7048 7.8645 25 7.5 25C7.1355 25 6.84 24.7048 6.84 24.34C6.84 23.9752 7.1355 23.68 7.5 23.68ZM19.32 18.48C19.32 18.1152 19.0245 17.82 18.66 17.82C18.2955 17.82 18 18.1152 18 18.48C18 18.8448 18.2955 19.14 18.66 19.14C19.0245 19.14 19.32 18.8448 19.32 18.48ZM5.66 11.84C6.0245 11.84 6.32001 12.1352 6.32001 12.5C6.32001 12.8648 6.0245 13.16 5.66 13.16C5.2955 13.16 5 12.8648 5 12.5C5 12.1352 5.2955 11.84 5.66 11.84ZM35.16 35.5C35.16 35.1352 34.8645 34.84 34.5 34.84C34.1355 34.84 33.84 35.1352 33.84 35.5C33.84 35.8648 34.1355 36.16 34.5 36.16C34.8645 36.16 35.16 35.8648 35.16 35.5ZM53.5 36.18C53.8645 36.18 54.16 36.4752 54.16 36.84C54.16 37.2048 53.8645 37.5 53.5 37.5C53.1355 37.5 52.84 37.2048 52.84 36.84C52.84 36.4752 53.1355 36.18 53.5 36.18ZM48.5 28.66C48.5 28.2952 48.2045 28 47.84 28C47.4755 28 47.18 28.2952 47.18 28.66C47.18 29.0248 47.4755 29.32 47.84 29.32C48.2045 29.32 48.5 29.0248 48.5 28.66ZM60.34 27.34C60.7045 27.34 61 27.6352 61 28C61 28.3648 60.7045 28.66 60.34 28.66C59.9755 28.66 59.68 28.3648 59.68 28C59.68 27.6352 59.9755 27.34 60.34 27.34ZM56.284 16.5C56.284 16.1352 55.9885 15.84 55.624 15.84C55.2595 15.84 54.964 16.1352 54.964 16.5C54.964 16.8648 55.2595 17.16 55.624 17.16C55.9885 17.16 56.284 16.8648 56.284 16.5ZM46.2 7.26C46.2 6.89519 45.9045 6.6 45.54 6.6C45.5174 6.6 45.4953 6.60129 45.4733 6.60387L45.453 6.60579L45.4124 6.61225L45.3857 6.61804L45.3845 6.61836C45.3675 6.62277 45.3504 6.62721 45.3341 6.63287C45.2522 6.65929 45.1774 6.70184 45.1134 6.75597C45.0627 6.79916 45.0186 6.84943 44.9828 6.90551C44.9178 7.00799 44.88 7.12981 44.88 7.26C44.88 7.62481 45.1755 7.92 45.54 7.92C45.7372 7.92 45.9141 7.83363 46.0353 7.69635C46.0808 7.64478 46.1182 7.58613 46.1459 7.52232C46.1807 7.4424 46.2 7.35346 46.2 7.26ZM33 9.34C33 8.9752 32.7045 8.68 32.34 8.68C31.9755 8.68 31.68 8.9752 31.68 9.34C31.68 9.7048 31.9755 10 32.34 10C32.7045 10 33 9.7048 33 9.34ZM16 4.8559C16.3645 4.8559 16.66 5.1511 16.66 5.5159C16.66 5.8807 16.3645 6.1759 16 6.1759C15.6355 6.1759 15.34 5.8807 15.34 5.5159C15.34 5.1511 15.6355 4.8559 16 4.8559ZM69.66 21.16C69.66 20.7952 69.3645 20.5 69 20.5C68.6355 20.5 68.34 20.7952 68.34 21.16C68.34 21.5248 68.6355 21.82 69 21.82C69.3645 21.82 69.66 21.5248 69.66 21.16ZM80.52 15.18C80.52 14.8152 80.2245 14.52 79.86 14.52C79.4956 14.52 79.2 14.8152 79.2 15.18C79.2 15.5448 79.4956 15.84 79.86 15.84C80.2245 15.84 80.52 15.5448 80.52 15.18ZM78.16 34.84C78.16 34.4752 77.5 34.18 77.5 34.18C77.5 34.18 76.84 34.4752 76.84 34.84C76.84 35.2048 77.1355 35.5 77.5 35.5C77.8645 35.5 78.16 35.2048 78.16 34.84ZM85.66 24.34C86.0245 24.34 86.32 24.6352 86.32 25C86.32 25.3648 86.0245 25.66 85.66 25.66C85.2955 25.66 85 25.3648 85 25C85 24.6352 85.2955 24.34 85.66 24.34ZM91.32 10C91.32 9.6352 91.0245 9.34 90.66 9.34C90.2955 9.34 90 9.6352 90 10C90 10.3648 90.2955 10.66 90.66 10.66C91.0245 10.66 91.32 10.3648 91.32 10ZM138.6 0H0V46.2H138.6V0ZM92.64 34.84C92.64 34.4752 91.98 34.18 91.98 34.18C91.98 34.18 91.32 34.4752 91.32 34.84C91.32 35.2048 91.6155 35.5 91.98 35.5C92.3445 35.5 92.64 35.2048 92.64 34.84Z"
                    fill={color}
                />
            </g>
            <defs>
                <clipPath id="clip0_408_119">
                    <rect width="100" height="40" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}

function LiquidSendButton({ onClick, disabled }) {
    if (disabled) {
        return (
            <button
                type="button"
                disabled
                className="relative h-9 min-w-[100px] px-4 cursor-not-allowed overflow-hidden rounded-lg border border-white/10 bg-white/5 text-center font-semibold text-sm text-white/40 flex items-center justify-center"
            >
                <span style={{ fontFamily: 'Montserrat, sans-serif' }}>Enviar</span>
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className="group relative h-9 min-w-[120px] px-4 cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-white text-center font-semibold text-sm transition-all duration-300 hover:border-[#575756] hover:shadow-[0_15px_50px_rgba(153,0,255,0.2),0_5px_25px_rgba(64,0,191,0.15)] flex items-center justify-center gap-3 ring-0 outline-none"
        >
            {/* Bolinha/Background animado - começa da esquerda */}
            <div className="absolute left-[18%] top-1/2 -translate-y-1/2 h-2 w-2 scale-[1] rounded-full bg-[#6000FF] transition-all duration-500 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[2.5] group-hover:translate-y-0 group-hover:bg-gradient-to-br group-hover:from-[#6000FF] group-hover:via-[#4000BF] group-hover:to-[#140033] z-0"></div>

            {/* Texto - centraliza e aumenta no hover */}
            <span className="relative z-10 text-[#0A0A0B] group-hover:text-white transition-all duration-300 whitespace-nowrap ml-2 group-hover:ml-0 group-hover:scale-125" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Enviar
            </span>
        </button>
    );
}

export default function HeroSection({
    title,
    description,
    onOpenChat,
}) {
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const paraRef = useRef(null);
    const inputRef = useRef(null);
    const textareaRef = useRef(null);
    const examplesRef = useRef(null);
    const [inputValue, setInputValue] = useState('');
    const [textIndex, setTextIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSendClicked, setIsSendClicked] = useState(false);
    const [isSendHovered, setIsSendHovered] = useState(false);

    const phrases = [
        "Gostaria de uma página elegante para minha clínica de cirurgia plástica.",
        "Preciso de um site para o lançamento de um condomínio de alto padrão.",
        "Quero um portfólio digital que valorize meus projetos de arquitetura."
    ];

    useEffect(() => {
        const currentPhrase = phrases[textIndex];
        const speed = isDeleting ? 20 : 35;
        const delay = isDeleting ? 0 : (displayText === currentPhrase ? 2000 : 0);

        const timer = setTimeout(() => {
            if (!isDeleting && displayText === currentPhrase) {
                setIsDeleting(true);
            } else if (isDeleting && displayText === '') {
                setIsDeleting(false);
                setTextIndex((prev) => (prev + 1) % phrases.length);
            } else {
                setDisplayText(
                    currentPhrase.substring(0, displayText.length + (isDeleting ? -1 : 1))
                );
            }
        }, Math.max(speed, delay));

        return () => clearTimeout(timer);
    }, [displayText, isDeleting, textIndex]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [inputValue]);

    useGSAP(
        () => {
            // Animate the entire header as one block to support the gradient text effect
            if (headerRef.current) {
                gsap.set(headerRef.current, {
                    autoAlpha: 0,
                    y: 30,
                    scale: 0.95,
                    filter: 'blur(10px)'
                });
            }

            if (paraRef.current) {
                gsap.set(paraRef.current, { autoAlpha: 0, y: 20 });
            }
            if (inputRef.current) {
                gsap.set(inputRef.current, { autoAlpha: 0, y: 30, scale: 0.95 });
            }
            if (examplesRef.current) {
                gsap.set(examplesRef.current, { autoAlpha: 0, y: 20 });
            }

            const tl = gsap.timeline({
                defaults: { ease: 'power3.out' },
            });

            if (headerRef.current) {
                tl.to(
                    headerRef.current,
                    {
                        autoAlpha: 1,
                        y: 0,
                        scale: 1,
                        filter: 'blur(0px)',
                        duration: 1.2,
                    },
                    0.1
                );
            }

            if (paraRef.current) {
                tl.to(paraRef.current, { autoAlpha: 1, y: 0, duration: 0.8 }, '-=0.8');
            }
            if (inputRef.current) {
                tl.to(inputRef.current, { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.2)" }, '-=0.6');
            }
            if (examplesRef.current) {
                tl.to(examplesRef.current, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.5');
            }
        },
        { scope: sectionRef },
    );

    return (
        <section ref={sectionRef} className="relative h-screen w-screen overflow-hidden flex flex-col items-center justify-center">
            <ShaderBackground />

            <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-8 px-6 text-center">

                <div className="flex flex-col items-center gap-6">
                    <h1 ref={headerRef} className="max-w-5xl text-center text-6xl leading-[1.1] tracking-tight sm:text-7xl md:text-8xl bg-gradient-to-b from-gray-300 via-white to-gray-300 bg-clip-text text-transparent" style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 600 }}>
                        Design que define o mercado.
                    </h1>

                    <p ref={paraRef} className="max-w-2xl text-center text-lg font-light leading-relaxed tracking-tight text-white/75 sm:text-xl">
                        Transformamos profissionais excepcionais em marcas dominantes. Com uma presença digital tão poderosa quanto a qualidade do seu trabalho.
                    </p>
                </div>

                {/* AI Input Box */}
                <div ref={inputRef} className="w-full max-w-2xl mt-8">
                    <motion.div
                        className="relative bg-[#0A0A0B] backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg"
                        initial={{ scale: 0.98 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="px-4 py-3">
                            {/* Input no topo */}
                            <div className="relative mb-3">
                                {!inputValue && (
                                    <div className="absolute inset-0 pointer-events-none flex items-start pt-0">
                                        <span className="text-base font-light text-white/50 btn-shine leading-[1.5]" style={{ fontFamily: "'Work Sans', sans-serif" }}>
                                            {displayText}
                                            <span className="animate-pulse">|</span>
                                        </span>
                                    </div>
                                )}
                                <textarea
                                    ref={textareaRef}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="w-full resize-none bg-transparent border-none text-white/90 text-base font-light focus:outline-none min-h-[24px] max-h-[120px] leading-[1.5]"
                                    style={{ overflow: "hidden", fontFamily: "'Work Sans', sans-serif" }}
                                    rows={1}
                                />
                            </div>

                            {/* Ícones na parte inferior */}
                            <div className="flex items-center justify-between">
                                {/* Ícone de anexo à esquerda */}
                                <button
                                    type="button"
                                    className="flex-shrink-0 text-white/60 hover:text-white/90 transition-colors"
                                >
                                    <Paperclip className="h-5 w-5" strokeWidth={1.5} />
                                </button>

                                {/* Botão de enviar à direita */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsSendClicked(true);
                                        setTimeout(() => setIsSendClicked(false), 300);
                                        onOpenChat(inputValue);
                                    }}
                                    onMouseEnter={() => setIsSendHovered(true)}
                                    onMouseLeave={() => setIsSendHovered(false)}
                                    disabled={!inputValue.trim()}
                                    className={`group flex-shrink-0 h-8 w-8 rounded-lg border flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${isSendClicked || isSendHovered
                                        ? 'bg-gradient-to-br from-[#000005] via-[#140040] to-[#4000BF] border-[#4000BF]/50 text-white shadow-[0_0_20px_rgba(64,0,191,0.4)]'
                                        : 'bg-[#1a1a1a] border-white/10 text-white/60 hover:text-white hover:bg-[#252525]'
                                        }`}
                                >
                                    <ArrowUp
                                        className={`transition-all duration-200 ${isSendClicked || isSendHovered
                                            ? 'h-5 w-5'
                                            : 'h-4 w-4'
                                            }`}
                                        strokeWidth={isSendClicked || isSendHovered ? 2.5 : 1.5}
                                    />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div ref={examplesRef} className="inline-block group relative mt-4">
                    <a href="#showcase" className="group relative inline-flex min-w-[140px] cursor-pointer overflow-hidden rounded-full bg-white/5 border border-white/5 px-5 py-2 text-sm font-medium transition-all duration-300 text-white/80 hover:text-white hover:scale-105 items-center justify-center gap-2">
                        <Sparkles className="relative z-10 h-4 w-4 text-white/60 group-hover:text-violet-400 group-hover:drop-shadow-[0_0_16px_rgba(139,92,246,1),0_0_32px_rgba(139,92,246,0.6)] transition-all duration-300" strokeWidth={1.5} />
                        <span className="relative z-10">Ver exemplos</span>
                    </a>
                </div>

            </div>
        </section>
    );
}

