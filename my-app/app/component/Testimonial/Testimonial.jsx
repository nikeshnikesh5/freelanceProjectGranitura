
"use client";

import { useEffect, useRef } from "react";
import { Application, Graphics } from "pixi.js";
import "./testimonial.css";

const testimonials = [
  {
    name: "Rajiv Nair",
    role: "Director, The Meridian Hotel, Bangalore",
    text: "The Carrara marble Granitura sourced for our hotel lobby is breathtaking. Guests consistently mention it. The team guided us through every detail, and delivery was flawless.",
  },
  {
    name: "Priya Menon",
    role: "Principal Architect, Form & Space Studio",
    text: "As an architect, I need a supplier who understands precision. Granitura's custom cutting service saved us weeks. The Verde Guatemala marble for our penthouse project was museum-quality.",
  },
  {
    name: "Anand Krishnamurthy",
    role: "MD, Prism Constructions",
    text: "We've been using Granitura's Kota Blue for our commercial builds for three years. Consistent quality, honest pricing, and the kind of after-sales service that's genuinely rare in this industry.",
  },
  {
    name: "Deepa Subramaniam",
    role: "Homeowner, Whitefield, Bangalore",
    text: "Our villa kitchen countertop in Italian Crema Marfil is the single most complimented thing in the house. Granitura's team matched the veining across six slabs. Exceptional attention to detail.",
  },
];

function StoneContourCanvas() {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let app;
    let disposed = false;
    let initialized = false;

    async function start() {
      const instance = new Application();
      app = instance;

      try {
        await instance.init({
          resizeTo: host,
          backgroundAlpha: 0,
          antialias: true,
          resolution: Math.min(window.devicePixelRatio || 1, 2),
          autoDensity: true,
        });
      } catch (error) {
        console.error("PixiJS initialization failed:", error);
        return;
      }

      initialized = true;

      if (disposed) {
        instance.destroy({ removeView: true }, { children: true });
        return;
      }

      const canvas = instance.canvas;
      canvas.setAttribute("aria-hidden", "true");
      canvas.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;";

      host.appendChild(canvas);

      const lines = new Graphics();
      instance.stage.addChild(lines);

      let time = 0;

      const draw = (ticker) => {
        time += ticker.deltaTime * 0.006;
        const width = host.clientWidth;
        const height = host.clientHeight;

        lines.clear();

        for (let band = 0; band < 10; band++) {
          const baseY = height * (0.08 + band * 0.105);

          lines.moveTo(-30, baseY);

          for (let x = 0; x <= width + 30; x += 12) {
            const wave =
              Math.sin(x * 0.008 + time + band * 0.44) *
                (14 + band * 1.2) +
              Math.sin(x * 0.0034 - time * 0.7 + band) * 22;

            lines.lineTo(x, baseY + wave);
          }

          lines.stroke({
            color: band % 3 === 0 ? 0xd4bc8a : 0x7fa18a,
            alpha: band % 3 === 0 ? 0.16 : 0.09,
            width: band % 3 === 0 ? 1.2 : 0.8,
          });
        }
      };

      instance.ticker.add(draw);

      instance.__testimonialDraw = draw;
    }

    start();

    return () => {
      disposed = true;

      if (app && initialized) {
        if (app.__testimonialDraw) {
          app.ticker.remove(app.__testimonialDraw);
        }

        app.destroy({ removeView: true }, { children: true });
        initialized = false;
      }
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="testimonial-pixi"
      aria-hidden="true"
    />
  );
}

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="gt-testimonials">
      <StoneContourCanvas />

      <div className="gt-testimonials-inner">
        <header className="gt-testimonials-header">
          <p className="gt-eyebrow">
            <span className="gt-eyebrow-line" />
            Client Stories
            <span className="gt-eyebrow-line" />
          </p>

          <h2 className="gt-title">
            Spaces That <em>Speak</em>
          </h2>

          <p className="gt-intro">
            Trusted by architects, builders, and homeowners
            who believe the right stone makes a lasting impression.
          </p>
        </header>

        <div className="gt-testimonial-grid">
          {testimonials.map((item, index) => (
            <article
              key={item.name}
              className={`gt-testimonial-card ${
                index % 2 ? "is-offset" : ""
              }`}
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="gt-card-top">
                <span className="gt-quote-mark" aria-hidden="true">
                  “
                </span>
                <span className="gt-card-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <p className="gt-testimonial-text">{item.text}</p>

              <div className="gt-card-divider" />

              <div className="gt-testimonial-name">{item.name}</div>
              <div className="gt-testimonial-role">{item.role}</div>
            </article>
          ))}
        </div>

        <div className="gt-testimonials-footer">
          <span className="gt-footer-rule" />
          <p>Material integrity. Thoughtful service. Enduring spaces.</p>
          <span className="gt-footer-rule" />
        </div>
      </div>
    </section>
  );
}
