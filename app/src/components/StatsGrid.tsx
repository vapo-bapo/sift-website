import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";

// Import Swiper core and required modules styles
import "swiper/css";
import "swiper/css/effect-coverflow";

export function StatsGrid() {
  const cards = [
    {
      title: "DELIVERY SLA",
      value: "72h",
      footer: "FROM BRIEF CONFIRMATION",
      details: [
        "Scored list, ready to sequence",
        "PDF + DOCX delivery included",
        "Exportable to any CRM"
      ]
    },
    {
      title: "ICP SCORING",
      value: "0–100",
      footer: "SCORE ON EVERY SINGLE CONTACT",
      details: [
        "Firmographic and tech-stack fit",
        "Buying trigger, cited and sourced",
        "One-line outreach hook included"
      ]
    },
    {
      title: "DEEP MAPPING",
      value: "5",
      footer: "ACCOUNTS DEEP-MAPPED PER LYNX RUN",
      details: [
        "Full decision-maker org chart",
        "Stakeholder roles and entry points",
        "AI chat trained on the account"
      ]
    },
    {
      title: "SIGNAL FEED",
      value: "90d",
      footer: "SIGNAL WINDOW PER ACCOUNT",
      details: [
        "Hiring and funding events",
        "Leadership changes tracked",
        "Intent signals, each one cited"
      ]
    },
    {
      title: "LEAD VOLUME",
      value: "20+",
      footer: "QUALIFIED LEADS PER ARGUS RUN",
      details: [
        "Built from your ICP only",
        "Every contact scored and cited",
        "Ready-to-use outreach hooks"
      ]
    },
    {
      title: "PROPOSAL TIME",
      value: "24h",
      footer: "FROM BRIEF TO SCOPED PROPOSAL",
      details: [
        "Manual review of every brief",
        "Right-sized recommendation",
        "Free revision if leads miss brief"
      ]
    }
  ];

  const css = `
    .Carousal_003 {
      width: 100%;
      height: 520px;
      padding-bottom: 20px !important;
      overflow: visible !important;
    }
    
    .Carousal_003 .swiper-slide {
      background-position: center;
      background-size: cover;
      width: 380px;
      max-width: 85%;
      height: 480px;
    }
  `;

  return (
    <div id="edra-stats-panel" className="w-full pointer-events-auto">
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
        className="Carousal_003"
        modules={[EffectCoverflow]}
      >
        {cards.map((card, index) => (
          <SwiperSlide key={index}>
            <div className="p-1.5 rounded-[28px] bg-[#F4EFE0]/70 border border-[#F0E8D4] flex flex-col justify-between h-[480px]">
              {/* Warm paper-white card with soft editorial shadow */}
              <div className="bg-white border border-[#E8DFC8] rounded-[23px] p-8 flex flex-col justify-between h-full shadow-[0_12px_40px_rgba(14,12,6,0.08)]">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-[#a07828] uppercase tracking-[0.08em]">
                      {card.title}
                    </span>
                  </div>

                  {/* High priority metric text perfectly aligned exactly 24px in size/margin below the header */}
                  <div className="mt-[24px] text-left">
                    <span className="font-serif font-light text-[60px] md:text-[68px] lg:text-[76px] tracking-[-0.04em] text-[#0E0C06] leading-none block">
                      {card.value}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  {card.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-[#7A6248] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c9943a]/60 mt-1 shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Symmetrical footer label bar without borders */}
              <div className="pt-3 pb-2.5 px-6">
                <span className="font-mono text-[10px] font-medium text-[#7A6248] uppercase tracking-widest block truncate">
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
