import React, { useState } from "react";
import { GripVertical } from "lucide-react";
import { BubbleText } from "./BubbleText";

function ImageComparisonSection() {
    const [inset, setInset] = useState(50);
    const [onMouseDown, setOnMouseDown] = useState(false);

    const onMouseMove = (e) => {
        if (!onMouseDown) return;

        const rect = e.currentTarget.getBoundingClientRect();
        let x = 0;

        if ("touches" in e && e.touches.length > 0) {
            x = e.touches[0].clientX - rect.left;
        } else if ("clientX" in e) {
            x = e.clientX - rect.left;
        }

        const percentage = (x / rect.width) * 100;
        setInset(percentage);
    };

    return (
        <div className="w-full py-12 lg:py-24 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col gap-4 mb-8">
                    <div>
                        <span className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-purple-300">
                            Transformação Real
                        </span>
                    </div>
                    <div className="flex gap-2 flex-col">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight lg:max-w-xl font-normal whitespace-nowrap bg-gradient-to-b from-gray-300 via-white to-gray-300 bg-clip-text text-transparent" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            De Comum a Extraordinário.
                        </h2>
                        <p className="text-base max-w-xl lg:max-w-2xl leading-relaxed tracking-tight text-white/50 font-medium">
                            Veja como elevamos a percepção de valor da marca{" "}
                            <BubbleText text="Mappie" className="text-orange-400/90 font-medium" />
                            , transformando uma interface padrão em uma experiência premium que converte.
                        </p>
                    </div>
                </div>

                <div className="pt-4 w-full">
                    <div
                        className="relative aspect-video w-full h-full overflow-hidden rounded-2xl select-none border border-white/10 shadow-2xl shadow-purple-900/20"
                        onMouseMove={onMouseMove}
                        onMouseUp={() => setOnMouseDown(false)}
                        onTouchMove={onMouseMove}
                        onTouchEnd={() => setOnMouseDown(false)}
                        onMouseLeave={() => setOnMouseDown(false)}
                    >
                        <div
                            className="absolute z-20 top-0 bottom-0 w-1 -ml-0.5 select-none cursor-ew-resize group"
                            style={{
                                left: inset + "%",
                            }}
                            onTouchStart={(e) => {
                                setOnMouseDown(true);
                                onMouseMove(e);
                            }}
                            onMouseDown={(e) => {
                                setOnMouseDown(true);
                                onMouseMove(e);
                            }}
                            onTouchEnd={() => setOnMouseDown(false)}
                            onMouseUp={() => setOnMouseDown(false)}
                        >
                            {/* Vertical Glow Line */}
                            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-transparent via-orange-400 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_20px_2px_rgba(251,146,60,0.6)]"></div>

                            {/* Central Handle */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-12 bg-black/50 backdrop-blur-md border border-orange-400/50 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(251,146,60,0.5)] transition-transform duration-200 group-hover:scale-110">
                                <GripVertical className="h-5 w-5 text-white drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
                            </div>
                        </div>

                        {/* Imagem da Esquerda (Base - Versão Antiga/Simples - Agora visível na esquerda) */}
                        <div className="absolute left-0 top-0 w-full h-full">
                            <div className="absolute top-6 left-6 z-20 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full shadow-lg">
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Antes</span>
                            </div>
                            <img
                                src="https://i.imgur.com/IcHHnOZ.png"
                                alt="Versão Anterior"
                                className="w-full h-full object-cover bg-[#050505]"
                                draggable="false"
                                loading="eager"
                            />
                            {/* Overlay de escurecimento leve */}
                            <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
                        </div>

                        {/* Imagem da Direita (Sobreposta - Versão Nova/Premium - Agora visível na direita) */}
                        <div
                            className="absolute left-0 top-0 z-10 w-full h-full overflow-hidden"
                            style={{
                                clipPath: "inset(0 0 0 " + inset + "%)",
                            }}
                        >
                            <div className="absolute top-6 right-6 z-20 bg-purple-600/90 backdrop-blur-md border border-purple-400/30 px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Depois</span>
                            </div>
                            <img
                                src="https://i.imgur.com/uC5OA3F.png"
                                alt="Versão Nova"
                                className="w-full h-full object-cover bg-[#050505]"
                                draggable="false"
                                loading="eager"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default ImageComparisonSection;
