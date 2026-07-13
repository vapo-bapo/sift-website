import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";

export function AetherStats() {
  const cards = [
    {
      title: "DELIVERY SLA",
      value: "72h",
      footer: "FROM BRIEF CONFIRMATION",
      details: [
        "Scored list, ready to sequence",
        "PDF + DOCX delivery included",
        "Exportable to any CRM",
      ],
    },
    {
      title: "ICP SCORING",
      value: "0–100",
      footer: "SCORE ON EVERY SINGLE CONTACT",
      details: [
        "Firmographic and tech-stack fit",
        "Buying trigger, cited and sourced",
        "One-line outreach hook included",
      ],
    },
    {
      title: "DEEP MAPPING",
      value: "5",
      footer: "ACCOUNTS DEEP-MAPPED PER LYNX RUN",
      details: [
        "Full decision-maker org chart",
        "Stakeholder roles and entry points",
        "AI chat trained on the account",
      ],
    },
    {
      title: "SIGNAL FEED",
      value: "90d",
      footer: "SIGNAL WINDOW PER ACCOUNT",
      details: [
        "Hiring and funding events",
        "Leadership changes tracked",
        "Intent signals, each one cited",
      ],
    },
    {
      title: "LEAD VOLUME",
      value: "20+",
      footer: "QUALIFIED LEADS PER ARGUS RUN",
      details: [
        "Built from your ICP only",
        "Every contact scored and cited",
        "Ready-to-use outreach hooks",
      ],
    },
    {
      title: "PROPOSAL TIME",
      value: "24h",
      footer: "FROM BRIEF TO SCOPED PROPOSAL",
      details: [
        "Manual review of every brief",
        "Right-sized recommendation",
        "Free revision if leads miss brief",
      ],
    },
  ];

  const css = `
    .AetherCarousal {
      width: 100%;
      height: 520px;
      padding-bottom: 20px !important;
      overflow: visible !important;
    }

    .AetherCarousal .swiper-slide {
      background-position: center;
      background-size: cover;
      width: 380px;
      max-width: 85%;
      height: 480px;
    }
  `;

  return (
    <div id="aether-stats-panel" className="w-full pointer-events-auto">
      <style>{css}</style>

      <Swiper
        effect="coverflow"
        grabCursor={true}
        slidesPerView="auto"
        centeredSlides={true}
        loop={true}
        observer={true}
        observeParents={true}
        spaceBetween={32}
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false,
        }}
        className="AetherCarousal"
        modules={[EffectCoverflow]}
      >
        {cards.map((card, index) => (
          <SwiperSlide key={index}>
            <div className="p-1.5 rounded-[28px] bg-white/5 border border-white/10 flex flex-col justify-between h-[480px]">
              <div className="bg-[#09090B]/60 backdrop-blur-xl border border-white/10 rounded-[23px] p-8 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-[#A1A1AA] uppercase tracking-[0.08em]">
                      {card.title}
                    </span>
                  </div>

                  <div className="mt-[24px] text-left">
                    <span className="font-sans font-semibold text-[60px] md:text-[68px] lg:text-[76px] tracking-[-0.04em] text-[#F4F4F5] leading-none block">
                      {card.value}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  {card.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-[#A1A1AA] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4B4BA0]/60 mt-1 shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 pb-2.5 px-6">
                <span className="font-mono text-[10px] font-medium text-[#52525B] uppercase tracking-widest block truncate">
                  {card.footer}
                </span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
