import React from 'react';
import { ContainerScroll } from './ContainerScroll';
import { ImageComparison, ImageComparisonImage, ImageComparisonSlider } from './ImageComparison';
import { GripVertical } from 'lucide-react';

const ProductShowcase = () => {
    return (
        <section className="relative pb-10 pt-0 overflow-hidden" id="showcase-scroll">
            <ContainerScroll
                titleComponent={
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-6xl font-bold text-white" style={{ fontFamily: "'Barlow', sans-serif" }}>
                            Design que{" "}
                            <span className="bg-gradient-to-br from-violet-500 to-indigo-600 bg-clip-text text-transparent">
                                Vende
                            </span>
                        </h2>
                        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto" style={{ fontFamily: "'Work Sans', sans-serif" }}>
                            Interfaces de alto padrão que não apenas impressionam, mas convertem.
                        </p>
                    </div>
                }
            >
                <div className="h-full w-full flex items-center justify-center relative overflow-hidden bg-[#0a0a0f]">
                    <ImageComparison className="h-full w-full rounded-2xl overflow-hidden border border-white/5">
                        <ImageComparisonImage
                            src="/dashboard-dark.png"
                            alt="Dark Mode"
                            position="left"
                        />
                        <ImageComparisonImage
                            src="/dashboard-light.png"
                            alt="Light Mode"
                            position="right"
                        />
                        <ImageComparisonSlider className="w-1 bg-white/50 backdrop-blur-sm transition-all hover:bg-white/80">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-lg">
                                <GripVertical size={16} className="text-white" />
                            </div>
                        </ImageComparisonSlider>
                    </ImageComparison>
                </div>
            </ContainerScroll>
        </section>
    );
};

export default ProductShowcase;
