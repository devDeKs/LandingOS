import React, { useEffect, useState } from "react";

const INTRO_STYLE_ID = "faq1-animations";

const faqs = [
    {
        question: "Como garantimos a entrega em 72h?",
        answer:
            "Utilizamos nossa biblioteca proprietária de componentes 'Neural Design'. Já temos a infraestrutura de alta conversão pronta, apenas adaptamos a inteligência visual para a sua marca.",
        meta: "Velocidade",
    },
    {
        question: "Preciso entender de design ou código?",
        answer:
            "Absolutamente não. Nossa proposta é 'Done-For-You'. Você foca no seu negócio, nós cuidamos de toda a infraestrutura digital.",
        meta: "Facilidade",
    },
    {
        question: "O que é Neural Design?",
        answer:
            "É nossa metodologia que une estética premium com dados de comportamento do usuário. Criamos layouts que não são apenas bonitos, mas cientificamente projetados para converter.",
        meta: "Mecanismo",
    },
    {
        question: "Serve para o meu nicho?",
        answer:
            "Se você vende serviços de alto valor (High-Ticket) e precisa transmitir autoridade imediata, sim. Nossa infraestrutura é agnóstica ao nicho, mas específica para autoridade.",
        meta: "Público",
    },
];

function FAQSection() {
    const [introReady, setIntroReady] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [hasEntered, setHasEntered] = useState(false);

    useEffect(() => {
        if (typeof document === "undefined") return;
        if (document.getElementById(INTRO_STYLE_ID)) return;
        const style = document.createElement("style");
        style.id = INTRO_STYLE_ID;
        style.innerHTML = `
      @keyframes faq1-fade-up {
        0% { transform: translate3d(0, 20px, 0); opacity: 0; filter: blur(6px); }
        60% { filter: blur(0); }
        100% { transform: translate3d(0, 0, 0); opacity: 1; filter: blur(0); }
      }
      @keyframes faq1-beam-spin {
        0% { transform: rotate(0deg) scale(1); }
        100% { transform: rotate(360deg) scale(1); }
      }
      @keyframes faq1-pulse {
        0% { transform: scale(0.7); opacity: 0.55; }
        60% { opacity: 0.1; }
        100% { transform: scale(1.25); opacity: 0; }
      }
      @keyframes faq1-meter {
        0%, 20% { transform: scaleX(0); transform-origin: left; }
        45%, 60% { transform: scaleX(1); transform-origin: left; }
        80%, 100% { transform: scaleX(0); transform-origin: right; }
      }
      @keyframes faq1-tick {
        0%, 30% { transform: translateX(-6px); opacity: 0.4; }
        50% { transform: translateX(2px); opacity: 1; }
        100% { transform: translateX(20px); opacity: 0; }
      }
      .faq1-intro {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.85rem;
        padding: 0.85rem 1.4rem;
        border-radius: 9999px;
        overflow: hidden;
        border: 1px solid rgba(168, 85, 247, 0.2);
        background: rgba(10, 10, 11, 0.6);
        color: rgba(248, 250, 252, 0.92);
        text-transform: uppercase;
        letter-spacing: 0.35em;
        font-size: 0.65rem;
        width: 100%;
        max-width: 24rem;
        margin: 0 auto;
        opacity: 0;
        transform: translate3d(0, 12px, 0);
        filter: blur(8px);
        transition: opacity 720ms ease, transform 720ms ease, filter 720ms ease;
        isolation: isolate;
      }
      .faq1-intro--active {
        opacity: 1;
        transform: translate3d(0, 0, 0);
        filter: blur(0);
      }
      .faq1-intro__beam {
        position: absolute;
        inset: -110%;
        pointer-events: none;
        border-radius: 50%;
        background: conic-gradient(from 160deg, rgba(168, 85, 247, 0.25), transparent 32%, rgba(139, 92, 246, 0.22) 58%, transparent 78%, rgba(168, 85, 247, 0.18));
        animation: faq1-beam-spin 18s linear infinite;
        opacity: 0.55;
      }
      .faq1-intro__pulse {
        position: absolute;
        inset: -110%;
        pointer-events: none;
        border-radius: 50%;
        border: 1px solid rgba(168, 85, 247, 0.3);
        opacity: 0.25;
        animation: faq1-pulse 3.4s ease-out infinite;
      }
      .faq1-intro__label {
        position: relative;
        z-index: 1;
        font-weight: 600;
        letter-spacing: 0.4em;
        color: #d8b4fe;
      }
      .faq1-intro__meter {
        position: relative;
        z-index: 1;
        flex: 1 1 auto;
        height: 1px;
        background: linear-gradient(90deg, transparent, #a855f7 35%, transparent 85%);
        transform: scaleX(0);
        transform-origin: left;
        animation: faq1-meter 5.8s ease-in-out infinite;
        opacity: 0.7;
      }
      .faq1-intro__tick {
        position: relative;
        z-index: 1;
        width: 0.55rem;
        height: 0.55rem;
        border-radius: 9999px;
        background: #a855f7;
        box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.1);
        animation: faq1-tick 3.2s ease-in-out infinite;
      }
      .faq1-fade {
        opacity: 0;
        transform: translate3d(0, 24px, 0);
        filter: blur(12px);
        transition: opacity 700ms ease, transform 700ms ease, filter 700ms ease;
      }
      .faq1-fade--ready {
        animation: faq1-fade-up 860ms cubic-bezier(0.22, 0.68, 0, 1) forwards;
      }
    `;

        document.head.appendChild(style);

        return () => {
            if (style.parentNode) style.remove();
        };
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") {
            setIntroReady(true);
            return;
        }
        const frame = window.requestAnimationFrame(() => setIntroReady(true));
        return () => window.cancelAnimationFrame(frame);
    }, []);

    const toggleQuestion = (index) => setActiveIndex((prev) => (prev === index ? -1 : index));

    useEffect(() => {
        if (typeof window === "undefined") {
            setHasEntered(true);
            return;
        }

        let timeout;
        const onLoad = () => {
            timeout = window.setTimeout(() => setHasEntered(true), 120);
        };

        if (document.readyState === "complete") {
            onLoad();
        } else {
            window.addEventListener("load", onLoad, { once: true });
        }

        return () => {
            window.removeEventListener("load", onLoad);
            window.clearTimeout(timeout);
        };
    }, []);

    const setCardGlow = (event) => {
        const target = event.currentTarget;
        const rect = target.getBoundingClientRect();
        target.style.setProperty("--faq-x", `${event.clientX - rect.left}px`);
        target.style.setProperty("--faq-y", `${event.clientY - rect.top}px`);
    };

    const clearCardGlow = (event) => {
        const target = event.currentTarget;
        target.style.removeProperty("--faq-x");
        target.style.removeProperty("--faq-y");
    };

    return (
        <div className="relative w-full overflow-hidden">
            <section
                className={`relative z-10 mx-auto flex max-w-4xl flex-col gap-12 px-6 py-24 lg:max-w-5xl lg:px-12 ${hasEntered ? "faq1-fade--ready" : "faq1-fade"
                    }`}
            >

                <header className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-4">
                        <p className="text-xs uppercase tracking-[0.35em] text-purple-400">Dúvidas Frequentes</p>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal leading-tight tracking-tight bg-gradient-to-b from-gray-300 via-white to-gray-300 bg-clip-text text-transparent" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            Sua Autoridade, Sem Dúvidas.
                        </h1>
                        <p className="max-w-xl text-base text-slate-400">
                            Entenda como o Neural Design coloca você no topo em 72h.
                        </p>
                    </div>
                </header>

                <ul className="space-y-4">
                    {faqs.map((item, index) => {
                        const open = activeIndex === index;
                        const panelId = `faq-panel-${index}`;
                        const buttonId = `faq-trigger-${index}`;

                        return (
                            <li
                                key={item.question}
                                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-0.5 focus-within:-translate-y-0.5 shadow-lg shadow-black/20"
                                onMouseMove={setCardGlow}
                                onMouseLeave={clearCardGlow}
                            >
                                <div
                                    className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                        }`}
                                    style={{
                                        background: `radial-gradient(240px circle at var(--faq-x, 50%) var(--faq-y, 50%), rgba(168, 85, 247, 0.15), transparent 70%)`,
                                    }}
                                />

                                <button
                                    type="button"
                                    id={buttonId}
                                    aria-controls={panelId}
                                    aria-expanded={open}
                                    onClick={() => toggleQuestion(index)}
                                    style={{ "--faq-outline": "rgba(168,85,247,0.35)" }}
                                    className="relative flex w-full items-start gap-6 px-8 py-7 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--faq-outline)]"
                                >
                                    <span
                                        className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/10 transition-all duration-500 group-hover:scale-105"
                                    >
                                        <span
                                            className={`pointer-events-none absolute inset-0 rounded-full border border-purple-500/30 opacity-30 ${open ? "animate-ping" : ""}`}
                                        />
                                        <svg
                                            className={`relative h-5 w-5 transition-transform duration-700 ease-in-out text-purple-400 ${open ? "rotate-45" : ""}`}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M12 5v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            <path d="M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </span>

                                    <div className="flex flex-1 flex-col gap-4">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                                            <h2 className="text-lg font-medium leading-tight sm:text-xl text-white">
                                                {item.question}
                                            </h2>
                                            {item.meta && (
                                                <span
                                                    className="inline-flex w-fit items-center rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.35em] transition-opacity duration-300 sm:ml-auto text-slate-400"
                                                >
                                                    {item.meta}
                                                </span>
                                            )}
                                        </div>

                                        <div
                                            id={panelId}
                                            role="region"
                                            aria-labelledby={buttonId}
                                            className={`overflow-hidden text-sm leading-relaxed transition-[max-height] duration-700 ease-in-out ${open ? "max-h-64" : "max-h-0"
                                                } text-slate-400`}
                                        >
                                            <p className="pr-2">
                                                {item.answer}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </section>
        </div>
    );
}

export default FAQSection;
