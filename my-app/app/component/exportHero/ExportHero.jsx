
"use client";

import { useEffect, useRef, useState } from "react";
import { Application, Assets, Container, Sprite, Graphics } from "pixi.js";
import "./ExportHero.css";

const varieties = [
  "Black Galaxy",
  "Absolute Black",
  "Black Pearl",
  "Steel Grey",
  "Tan Brown",
  "River White",
  "Colonial White",
  "Imperial White",
  "Alaska White",
  "Viscount White",
  "Kashmir White",
  "Moon White",
  "Ivory Brown",
  "Paradiso",
  "Himalayan Blue",
  "Vizag Blue",
  "Sapphire Blue",
  "Blue Dunes",
  "Lavender Blue",
  "Coffee Brown",
  "Cat's Eye",
  "Copper Silk",
  "Crystal Yellow",
  "Almond Gold",
  "New Imperial Red",
  "Ruby Red",
  "Lakha Red",
  "Multicolor Red",
  "Indian Aurora",
  "Chima Pink",
  "Rosy Pink",
  "Bash Paradiso",
  "Steel Grey Flamed",
  "Black Galaxy Leather",
  "Absolute Black Honed",
  "Black Galaxy Polished",
  "Colonial Gold",
  "Hassan Green",
  "Kuppam Green",
  "P White",
  "Sadarahalli Grey",
  "Kengeri Pink",
  "Black Markino",
  "Crystal Blue",
  "Platinum White",
  "Black Forest",
  "Fantasy Brown",
  "Thunder White",
  "Silver Waves",
  "Premium Grey",
];

const stoneSlides = [
  {
    name: "Black Galaxy",
    type: "PREMIUM INDIAN GRANITE",
    image: "/assets/Granites.jpg",
    finish: "Polished / Honed",
    description: "A dramatic dark surface for premium architectural projects.",
  },
  {
    name: "Imperial White",
    type: "LIGHT GRANITE COLLECTION",
    image: "/assets/ItalianMarbles.jpg",
    finish: "Polished / Leather",
    description: "A light, refined look for contemporary spaces.",
  },
  {
    name: "Tan Brown",
    type: "WARM GRANITE COLLECTION",
    image: "/assets/BangloreStone.jpg",
    finish: "Polished / Flamed",
    description: "Rich natural tones for indoor and outdoor applications.",
  },
  {
    name: "Steel Grey",
    type: "ARCHITECTURAL GRANITE",
    image: "/assets/KotaBlackStone.jpg",
    finish: "Honed / Flamed",
    description: "A versatile grey aesthetic for commercial projects.",
  },
];

const features = [
  { number: "01", title: "50+ varieties", subtitle: "Granite selection" },
  { number: "02", title: "Cut to size", subtitle: "Project dimensions" },
  { number: "03", title: "Fresh blocks", subtitle: "Quarry sourcing" },
  { number: "04", title: "Export supply", subtitle: "Middle East focus" },
];

export default function ExportHero() {
  const canvasHost = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const activeStone = stoneSlides[activeIndex];

  useEffect(() => {
    const host = canvasHost.current;
    if (!host) return;

    let app;
    let destroyed = false;
    let resizeObserver;
    let tickerFn;

    async function init() {
      app = new Application();

      await app.init({
        backgroundAlpha: 0,
        antialias: true,
        autoDensity: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        resizeTo: host,
      });

      if (destroyed) {
        app.destroy(true, { children: true });
        return;
      }

      host.appendChild(app.canvas);

      const stage = new Container();
      app.stage.addChild(stage);

      const panels = [];
      const textures = [];

      for (let i = 0; i < stoneSlides.length; i++) {
        try {
          textures.push(await Assets.load(stoneSlides[i].image));
        } catch (error) {
          console.warn(
            `Could not load ${stoneSlides[i].image}. Check public/assets.`,
            error
          );
          textures.push(null);
        }
      }

      if (destroyed) {
        app.destroy(true, { children: true });
        return;
      }

      stoneSlides.forEach((stone, i) => {
        const panel = new Container();
        const shadow = new Graphics();
        const sprite = textures[i] ? new Sprite(textures[i]) : null;
        const fallback = new Graphics();
        const mask = new Graphics();

        shadow.roundRect(8, 10, 230, 350, 8).fill({
          color: 0x000000,
          alpha: 0.4,
        });

        fallback.roundRect(0, 0, 230, 350, 8).fill({
          color: [0x29332e, 0x44433a, 0x534438, 0x303632][i],
        });

        panel.addChild(shadow, fallback);

        if (sprite) {
          sprite.anchor.set(0.5);
          sprite.eventMode = "none";
          panel.addChild(sprite);
        }

        mask.roundRect(0, 0, 230, 350, 8).fill(0xffffff);
        panel.addChild(mask);

        if (sprite) {
          sprite.mask = mask;
        }

        panel.eventMode = "static";
        panel.cursor = "pointer";

        panel.on("pointertap", () => {
          window.dispatchEvent(
            new CustomEvent("granitura-stone-select", { detail: i })
          );
        });

        stage.addChild(panel);
        panels.push({ panel, sprite, mask, shadow, fallback, index: i });
      });

      function layout() {
        const w = host.clientWidth;
        const h = host.clientHeight;
        if (!w || !h) return;

        const mobile = w < 520;
        const cardW = mobile ? Math.min(105, w * 0.25) : Math.min(190, w * 0.255);
        const cardH = cardW * 1.48;
        const gap = mobile ? 9 : 16;
        const totalW = cardW * 4 + gap * 3;
        const startX = (w - totalW) / 2;
        const centerY = h * (mobile ? 0.49 : 0.52);

        panels.forEach(({ panel, sprite, mask, shadow, fallback, index }) => {
          const x = startX + index * (cardW + gap);
          const selected = index === activeIndex;
          const y = centerY - cardH / 2 + (selected ? -16 : 14);

          panel.position.set(x, y);
          panel.alpha = selected ? 1 : 0.72;
          panel.scale.set(selected ? 1.05 : 0.94);

          if (sprite) {
            const scale = Math.max(
              cardW / sprite.texture.width,
              cardH / sprite.texture.height
            );
            sprite.scale.set(scale);
            sprite.position.set(cardW / 2, cardH / 2);
          }

          // Rebuild masks and backgrounds to fit responsive card dimensions.
          mask.clear().roundRect(0, 0, cardW, cardH, 8).fill(0xffffff);
          shadow.clear().roundRect(6, 9, cardW, cardH, 8).fill({
            color: 0x000000,
            alpha: 0.4,
          });
          fallback.clear().roundRect(0, 0, cardW, cardH, 8).fill({
            color: [0x29332e, 0x44433a, 0x534438, 0x303632][index],
          });
        });
      }

      let elapsed = 0;
      tickerFn = (ticker) => {
        elapsed += ticker.deltaTime;
        panels.forEach(({ panel, index }) => {
          panel.y += Math.sin(elapsed * 0.025 + index) * 0.12;
        });
      };

      app.ticker.add(tickerFn);

      resizeObserver = new ResizeObserver(layout);
      resizeObserver.observe(host);
      layout();
    }

    init().catch((error) => {
      console.error("PixiJS hero could not initialise:", error);
    });

    return () => {
      destroyed = true;
      resizeObserver?.disconnect();
      if (app) {
        if (tickerFn) app.ticker.remove(tickerFn);
        app.destroy(true, { children: true });
      }
    };
  }, [activeIndex]);

  useEffect(() => {
    const handleSelection = (event) => {
      setActiveIndex(event.detail);
    };

    window.addEventListener("granitura-stone-select", handleSelection);
    return () =>
      window.removeEventListener("granitura-stone-select", handleSelection);
  }, []);

  const selectedVariety = varieties[activeIndex];

  return (
    <section className="export-hero" id="home">
      <div className="export-glow" aria-hidden="true" />

      <header className="export-nav">
        <a className="export-brand" href="/" aria-label="Granitura home">
          <span className="brand-mark">⌁</span>
          <span className="brand-name">GRANITURA</span>
          <span className="brand-caption">NATURAL STONE WORLDWIDE</span>
        </a>

        <nav className="export-links" aria-label="Main navigation">
          <a className="active" href="/">Home</a>
          <a href="/catlog-product">Catalog</a>
          <a href="#process">Our Process</a>
          <a href="#about">About</a>
          <a href="/contact">Contact</a>
        </nav>

        <a className="nav-quote" href="/export-quote">
          Get Export Quote <span>↗</span>
        </a>
      </header>

      <div className="export-main">
        <div className="export-copy">
          <div className="export-eyebrow">
            <span className="eyebrow-line" />
            INDIAN GRANITE · EXPORT SUPPLY
          </div>

          <h1>
            Premium Indian
            <br />
            Granite for
            <br />
            <em>Global Projects.</em>
          </h1>

          <p className="export-description">
            Granite supplied for Middle Eastern projects — from fresh blocks
            to precision cut-to-size pieces, selected for quality, consistency
            and architectural character.
          </p>

          <div className="export-actions">
            <a className="gold-button" href="/catlog-product">
              Explore 50+ Varieties <span>→</span>
            </a>
            <a className="text-button" href="/export-quote">
              Request Export Quote <span>↗</span>
            </a>
          </div>

          <div className="export-features">
            {features.map((feature) => (
              <div className="export-feature" key={feature.number}>
                <span className="feature-number">{feature.number}</span>
                <strong>{feature.title}</strong>
                <small>{feature.subtitle}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="export-showcase">
          <div className="showcase-topline">
            <span>THE GRANITE COLLECTION</span>
            <span>INDIA → MIDDLE EAST</span>
          </div>

          <div className="pixi-stage" ref={canvasHost} />

          <div className="showcase-location">
            <span className="location-dot" />
            <span>CURATED NATURAL STONE</span>
          </div>

          <div className="stone-info" aria-live="polite">
            <div className="stone-info-top">
              <span className="stone-index">
                0{activeIndex + 1} <i>/ 04</i>
              </span>
              <span className="stone-type">{activeStone.type}</span>
            </div>

            <h2>{selectedVariety}</h2>
            <p>{activeStone.description}</p>

            <div className="stone-meta">
              <span>FINISH OPTIONS</span>
              <strong>{activeStone.finish}</strong>
            </div>

            <a href="/export-quote" className="stone-enquire">
              Enquire about this stone <span>↗</span>
            </a>
          </div>

          <div className="variety-picker">
            <div className="picker-heading">
              <span>SELECT A VARIETY</span>
              <button type="button" onClick={() => setShowAll(!showAll)}>
                {showAll ? "Show less −" : "View all 50+ ↗"}
              </button>
            </div>

            <div className={`variety-list ${showAll ? "expanded" : ""}`}>
              {(showAll ? varieties : varieties.slice(0, 5)).map((name) => {
                const index = varieties.indexOf(name);
                return (
                  <button
                    type="button"
                    key={name}
                    className={selectedVariety === name ? "selected" : ""}
                    onClick={() => setActiveIndex(index % stoneSlides.length)}
                  >
                    <span className={`variety-swatch swatch-${index % 4}`} />
                    <span>{name}</span>
                    {selectedVariety === name && <span className="check">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <footer className="export-footer">
        <span>FROM INDIAN QUARRIES</span>
        <span className="footer-arrow">→</span>
        <span>TO MIDDLE EAST PROJECTS</span>
        <span className="footer-note">NATURAL STONE · PROJECT SUPPLY</span>
      </footer>
    </section>
  );
}
