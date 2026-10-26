
"use client";

import { useEffect, useRef, useState } from "react";
import { Application, Graphics } from "pixi.js";
import "./style.css";

const benefits = [
  {
    number: "01",
    title: "Distinctive Natural Stone",
    description:
      "Discover natural stone with its own character, texture and variation. Explore materials suited to your design vision.",
    detail: "Material selection",
  },
  {
    number: "02",
    title: "Clear, Considered Pricing",
    description:
      "Make informed decisions with quotations based on your chosen material, dimensions, quantity and delivery requirements.",
    detail: "Pricing & quotations",
  },
  {
    number: "03",
    title: "Guidance on Stone Selection",
    description:
      "Compare Bangalore stone, Cuddapah, Kota and other natural stone options for the look and application you have in mind.",
    detail: "Expert guidance",
  },
  {
    number: "04",
    title: "Attention to the Details",
    description:
      "Discuss finish, dimensions, colour variation and specifications before confirming the material for your project.",
    detail: "Quality & specifications",
  },
  {
    number: "05",
    title: "Delivery Coordination",
    description:
      "Plan material movement with clear communication around quantities, destination and delivery arrangements.",
    detail: "From supply to site",
  },
  {
    number: "06",
    title: "A Personal Approach",
    description:
      "Tell us about your space, share your requirements and get practical support as you explore suitable stone options.",
    detail: "Project support",
  },
];

function StoneLight() {
  const hostRef = useRef(null);

  useEffect(() => {
    let app;
    let disposed = false;

    async function start() {
      const host = hostRef.current;
      if (!host) return;

      const pixi = new Application();

      await pixi.init({
        resizeTo: host,
        backgroundAlpha: 0,
        antialias: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        autoDensity: true,
      });

      if (disposed) {
        pixi.destroy(true);
        return;
      }

      app = pixi;
      host.appendChild(pixi.canvas);

      const glow = new Graphics();
      const dust = new Graphics();
      const contours = new Graphics();

      pixi.stage.addChild(contours, glow, dust);

      const particles = Array.from({ length: 42 }, (_, i) => ({
        x: ((i * 67) % 1000) / 1000,
        y: ((i * 43) % 1000) / 1000,
        size: 0.6 + (i % 4) * 0.45,
        speed: 0.00008 + (i % 5) * 0.000025,
        phase: i * 1.73,
      }));

      let elapsed = 0;

      pixi.ticker.add(() => {
        const w = pixi.screen.width;
        const h = pixi.screen.height;

        elapsed += 0.008;

        glow.clear();
        dust.clear();
        contours.clear();

        // Soft, moving champagne light.
        for (let i = 0; i < 5; i++) {
          const x = w * (0.18 + i * 0.17) +
            Math.sin(elapsed * 0.55 + i) * w * 0.035;
          const y = h * (0.25 + i * 0.105) +
            Math.cos(elapsed * 0.45 + i) * h * 0.035;

          glow.circle(x, y, 26 + i * 5);
          glow.fill({
            color: 0xd9bb80,
            alpha: 0.018 + Math.sin(elapsed + i) * 0.008,
          });
        }

        // Fine mineral dust drifting through the light.
        for (const p of particles) {
          const x = ((p.x + elapsed * p.speed * 8) % 1) * w;
          const y =
            ((p.y + Math.sin(elapsed + p.phase) * 0.025 + 1) % 1) * h;

          dust.circle(x, y, p.size);
          dust.fill({
            color: 0xf0d7a0,
            alpha: 0.15 + (Math.sin(elapsed * 1.4 + p.phase) + 1) * 0.17,
          });
        }

        // Restrained geological contour lines.
        for (let i = 0; i < 5; i++) {
          const offset = i * 17;
          contours.setStrokeStyle({
            width: 0.7,
            color: 0xd9bb80,
            alpha: 0.16 - i * 0.018,
          });

          contours.moveTo(w * 0.48, h * 0.03 + offset);

          for (let step = 0; step <= 36; step++) {
            const t = step / 36;
            const x = w * (0.48 + t * 0.55);
            const y =
              h * (0.03 + t * 0.9) +
              Math.sin(t * 8 + elapsed + i * 0.45) * 12 +
              offset;

            contours.lineTo(x, y);
          }

          contours.stroke();
        }
      });
    }

    start().catch((error) => {
      console.error("Unable to initialize the stone animation:", error);
    });

    return () => {
      disposed = true;
      if (app) app.destroy(true, { children: true });
    };
  }, []);

  return <div ref={hostRef} className="editorial-pixi" aria-hidden="true" />;
}

export default function WhySection() {
  const [active, setActive] = useState(0);
  const selected = benefits[active];

  return (
    <section className="editorial-why" id="why">
      <div className="editorial-shell">
        <div className="editorial-topline">
          <a className="editorial-brand" href="/" aria-label="Granitura home">
            GRANITURA<span>®</span>
          </a>
          <span className="editorial-category">
            NATURAL STONE · THOUGHTFULLY SOURCED
          </span>
        </div>

        <div className="editorial-intro">
          <div className="editorial-copy">
            <p className="editorial-kicker">
              <span /> THE GRANITURA DIFFERENCE
            </p>

            <h2>
              More than
              <br />
              stone. <em>A lasting</em>
              <br />
              impression.
            </h2>

            <p className="editorial-lead">
              The right material changes how a space feels. We help you
              explore natural stone with clarity, care and attention to
              the details that matter.
            </p>

            <a className="editorial-cta" href="#contact">
              Discuss your project <span>↗</span>
            </a>

            <div className="editorial-caption">
              <span className="editorial-caption-line" />
              MATERIALS WITH NATURAL CHARACTER
            </div>
          </div>

          <div className="editorial-art" aria-label="Abstract natural stone artwork">
            <StoneLight />

            <div className="editorial-art-frame">
              <div className="editorial-stone">
                <div className="editorial-stone-vein vein-one" />
                <div className="editorial-stone-vein vein-two" />
                <div className="editorial-stone-vein vein-three" />
              </div>
              <div className="editorial-art-glow" />
            </div>

            <span className="editorial-art-index">FIG. 01 — NATURAL FORM</span>
            <span className="editorial-art-note">
              Every surface tells a story.
            </span>
            <span className="editorial-art-ring" />
          </div>
        </div>

        <div className="editorial-divider" />

        <div className="editorial-benefits">
          <div className="editorial-benefits-heading">
            <div>
              <p className="editorial-kicker">WHAT YOU CAN EXPECT</p>
              <h3>A considered approach, <em>at every step.</em></h3>
            </div>
            <p className="editorial-benefits-aside">
              Explore what matters most to your project.
            </p>
          </div>

          <div className="editorial-benefits-layout">
            <div className="editorial-list">
              {benefits.map((benefit, index) => (
                <button
                  type="button"
                  key={benefit.number}
                  className={`editorial-benefit ${
                    active === index ? "selected" : ""
                  }`}
                  onClick={() => setActive(index)}
                  aria-expanded={active === index}
                >
                  <span className="editorial-benefit-number">
                    {benefit.number}
                  </span>

                  <span className="editorial-benefit-text">
                    <span className="editorial-benefit-title">
                      {benefit.title}
                    </span>
                    {active === index && (
                      <span className="editorial-benefit-description">
                        {benefit.description}
                      </span>
                    )}
                  </span>

                  <span className="editorial-benefit-arrow">
                    {active === index ? "−" : "+"}
                  </span>
                </button>
              ))}
            </div>

            <aside className="editorial-detail" aria-live="polite">
              <p className="editorial-detail-label">
                <span>0{active + 1}</span> / YOUR GRANITURA EXPERIENCE
              </p>

              <div className="editorial-detail-rule" />

              <h4 key={selected.number}>{selected.detail}</h4>
              <p key={`${selected.number}-detail`}>
                {selected.description}
              </p>

              <a href="#contact" className="editorial-detail-link">
                Let’s talk about your project <span>↗</span>
              </a>
            </aside>
          </div>
        </div>

        <footer className="editorial-footer">
          <span>BUILT AROUND YOUR VISION.</span>
          <span>NATURAL STONE · TIMELESS DESIGN</span>
        </footer>
      </div>
    </section>
  );
}
