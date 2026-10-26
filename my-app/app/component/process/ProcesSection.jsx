
"use client";

import { useEffect, useRef, useState } from "react";
import { Application, Graphics } from "pixi.js";
import "./process.css";

const steps = [
  {
    number: "01",
    title: "Consultation",
    subtitle: "Tell us about your vision",
    description:
      "Share your dimensions, application, design preferences, and budget. Our stone advisors help narrow down the right materials for your project.",
    detail: "PROJECT BRIEF",
    points: ["Understand your requirements", "Explore suitable stone options", "Discuss budget and timelines"],
    icon: "◉",
  },
  {
    number: "02",
    title: "Sample Selection",
    subtitle: "Find the right character",
    description:
      "Explore colours, textures, finishes, and natural veining. Review samples before making your final selection.",
    detail: "MATERIAL SELECTION",
    points: ["Compare stone varieties", "Review colour and finish", "Confirm your preferred material"],
    icon: "◇",
  },
  {
    number: "03",
    title: "Custom Processing",
    subtitle: "Precision in every detail",
    description:
      "Once specifications are approved, your stone is prepared to the agreed dimensions and finish, with attention to consistency and detail.",
    detail: "CRAFT & PRECISION",
    points: ["Confirm cutting specifications", "Select the required finish", "Review processing requirements"],
    icon: "⌘",
  },
  {
    number: "04",
    title: "Delivery & Support",
    subtitle: "Ready for your space",
    description:
      "Coordinate delivery around your project schedule and receive support with handling, installation planning, and stone care.",
    detail: "DELIVERY & CARE",
    points: ["Coordinate dispatch", "Plan site delivery", "Get after-care guidance"],
    icon: "↗",
  },
];

function StoneProcessCanvas() {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let app;
    let initialized = false;
    let disposed = false;
    let draw;

    async function init() {
      const instance = new Application();
      app = instance;

      try {
        await instance.init({
          resizeTo: host,
          backgroundAlpha: 0,
          antialias: true,
          autoDensity: true,
          resolution: Math.min(window.devicePixelRatio || 1, 2),
        });
      } catch (error) {
        if (!disposed) {
          console.error("PixiJS process background failed to initialize.", error);
        }
        return;
      }

      initialized = true;

      if (disposed) {
        instance.destroy({ removeView: true }, { children: true });
        initialized = false;
        return;
      }

      instance.canvas.setAttribute("aria-hidden", "true");
      instance.canvas.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;pointer-events:none";

      host.appendChild(instance.canvas);

      const graphics = new Graphics();
      instance.stage.addChild(graphics);

      let time = 0;

      draw = (ticker) => {
        time += ticker.deltaTime * 0.005;

        const width = host.clientWidth;
        const height = host.clientHeight;

        graphics.clear();

        // Flowing geological contour lines.
        for (let band = 0; band < 12; band++) {
          const baseY = height * (band / 11);

          graphics.moveTo(-20, baseY);

          for (let x = 0; x <= width + 20; x += 14) {
            const wave =
              Math.sin(x * 0.006 + time + band * 0.4) * 19 +
              Math.sin(x * 0.0025 - time * 0.6 + band) * 25;

            graphics.lineTo(x, baseY + wave);
          }

          graphics.stroke({
            color: band % 4 === 0 ? 0xd4bc8a : 0x83a38b,
            alpha: band % 4 === 0 ? 0.18 : 0.075,
            width: band % 4 === 0 ? 1.2 : 0.8,
          });
        }
      };

      instance.ticker.add(draw);
    }

    init();

    return () => {
      disposed = true;

      if (app && initialized) {
        if (draw) app.ticker.remove(draw);
        app.destroy({ removeView: true }, { children: true });
        initialized = false;
      }
    };
  }, []);

  return <div ref={hostRef} className="process-pixi" aria-hidden="true" />;
}

export default function ProcessSection() {
  const [current, setCurrent] = useState(0);
  const step = steps[current];
  const progress = ((current + 1) / steps.length) * 100;

  const goTo = (index) => {
    setCurrent(Math.max(0, Math.min(index, steps.length - 1)));
  };

  return (
    <section id="process" className="process-section">
      <StoneProcessCanvas />

      <div className="process-inner">
        <header className="process-header">
          <p className="process-eyebrow">
            <span />
            A considered process
            <span />
          </p>

          <h2 className="process-heading">
            From <em>Quarry</em> to Your Space
          </h2>

          <p className="process-intro">
            Great spaces begin with the right stone. We guide you through
            every stage, from the first conversation to delivery.
          </p>
        </header>

        <div className="process-experience">
          <div className="process-timeline">
            <div
              className="process-progress-track"
              aria-hidden="true"
            >
              <div
                className="process-progress-fill"
                style={{ height: `${progress}%` }}
              />
            </div>

            {steps.map((item, index) => (
              <button
                key={item.number}
                type="button"
                className={`process-stage ${
                  current === index ? "is-active" : ""
                } ${current > index ? "is-complete" : ""}`}
                onClick={() => goTo(index)}
                aria-current={current === index ? "step" : undefined}
                aria-label={`Step ${item.number}: ${item.title}`}
              >
                <span className="process-stage-number">
                  {current > index ? "✓" : item.number}
                </span>

                <span className="process-stage-copy">
                  <span className="process-stage-title">{item.title}</span>
                  <span className="process-stage-subtitle">
                    {item.subtitle}
                  </span>
                </span>

                <span className="process-stage-arrow" aria-hidden="true">
                  ↗
                </span>
              </button>
            ))}
          </div>

          <article className="process-detail" aria-live="polite">
            <div className="process-detail-top">
              <span className="process-detail-label">{step.detail}</span>
              <span className="process-detail-count">
                {step.number} <i>/</i> 04
              </span>
            </div>

            <div className="process-detail-icon" aria-hidden="true">
              {step.icon}
            </div>

            <p className="process-detail-kicker">
              STEP {step.number}
            </p>

            <h3>{step.title}</h3>

            <p className="process-detail-description">
              {step.description}
            </p>

            <ul className="process-benefits">
              {step.points.map((point) => (
                <li key={point}>
                  <span aria-hidden="true">✳</span>
                  {point}
                </li>
              ))}
            </ul>

            <div className="process-detail-footer">
              <div className="process-dots" aria-label={`Step ${current + 1} of 4`}>
                {steps.map((item, index) => (
                  <button
                    key={item.number}
                    type="button"
                    className={current === index ? "active" : ""}
                    onClick={() => goTo(index)}
                    aria-label={`Go to step ${item.number}`}
                    aria-current={current === index ? "step" : undefined}
                  />
                ))}
              </div>

              <div className="process-navigation">
                <button
                  type="button"
                  className="process-nav-button"
                  onClick={() => goTo(current - 1)}
                  disabled={current === 0}
                  aria-label="Previous step"
                >
                  ←
                </button>

                <button
                  type="button"
                  className="process-next-button"
                  onClick={() => goTo(current === steps.length - 1 ? 0 : current + 1)}
                >
                  {current === steps.length - 1 ? "Start again" : "Next step"}
                  <span aria-hidden="true"> ↗</span>
                </button>
              </div>
            </div>
          </article>
        </div>

        <footer className="process-bottom-note">
          <span className="process-bottom-line" />
          <p>Thoughtfully sourced. Carefully prepared. Made for your space.</p>
          <span className="process-bottom-line" />
        </footer>
      </div>
    </section>
  );
}
