
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
    name: "Absolute Black",
    type: "PREMIUM INDIAN GRANITE",
    image: "/assets/AbsoluteBlack.jpg",
    finish: "Polished / Honed",
    description:
      "A dramatic dark surface for premium architectural projects.",
  },
  {
    name: "Black Galaxy",
    type: "SIGNATURE GRANITE COLLECTION",
    image: "/assets/blackgalaxy.jpg",
    finish: "Polished / Leather",
    description:
      "A distinctive black surface with natural mineral sparkle.",
  },
  {
    name: "Steel Grey",
    type: "ARCHITECTURAL GRANITE",
    image: "/assets/steelgrey.jpg",
    finish: "Honed / Flamed",
    description:
      "A versatile grey aesthetic for commercial and residential projects.",
  },
];

const features = [
  { number: "01", title: "50+ varieties", subtitle: "Granite selection" },
  { number: "02", title: "Cut to size", subtitle: "Project dimensions" },
  { number: "03", title: "Fresh blocks", subtitle: "Quarry sourcing" },
  { number: "04", title: "Export supply", subtitle: "Middle East focus" },
];

const CARD_WIDTH = 230;
const CARD_HEIGHT = 350;

export default function ExportHero() {
  const canvasHost = useRef(null);
  const activeIndexRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  // Every variety uses the closest available showcase slide.
  const activeSlideIndex = activeIndex % stoneSlides.length;
  const activeStone = stoneSlides[activeSlideIndex];
  const selectedVariety = varieties[activeIndex];

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const host = canvasHost.current;
    if (!host) return;

    let app = null;
    let destroyed = false;
    let resizeObserver = null;
    let tickerFn = null;
    let stage = null;
    let panels = [];

    const destroyApp = () => {
      if (!app) return;

      try {
        if (tickerFn) {
          app.ticker.remove(tickerFn);
          tickerFn = null;
        }

        app.destroy(
          true,
          { children: true },
        );
      } catch (error) {
        console.warn("PixiJS cleanup warning:", error);
      }

      app = null;
    };

    async function init() {
      try {
        app = new Application();

        await app.init({
          backgroundAlpha: 0,
          antialias: true,
          autoDensity: true,
          resolution: Math.min(window.devicePixelRatio || 1, 2),
          resizeTo: host,
        });

        if (destroyed) {
          destroyApp();
          return;
        }

        host.appendChild(app.canvas);

        app.canvas.style.position = "absolute";
        app.canvas.style.inset = "0";
        app.canvas.style.width = "100%";
        app.canvas.style.height = "100%";
        app.canvas.style.pointerEvents = "none";
        app.canvas.style.opacity = "0.9";

        stage = new Container();
        app.stage.addChild(stage);

        const loadedTextures = await Promise.all(
          stoneSlides.map(async (stone) => {
            try {
              return await Assets.load(stone.image);
            } catch (error) {
              console.warn(
                `Unable to load ${stone.image}. Check public/assets.`,
                error
              );
              return null;
            }
          })
        );

        if (destroyed) {
          destroyApp();
          return;
        }

        stoneSlides.forEach((stone, index) => {
          const panel = new Container();

          const shadow = new Graphics();
          const fallback = new Graphics();
          const sprite = loadedTextures[index]
            ? new Sprite(loadedTextures[index])
            : null;
          const mask = new Graphics();

          shadow
            .roundRect(6, 9, CARD_WIDTH, CARD_HEIGHT, 8)
            .fill({ color: 0x000000, alpha: 0.4 });

          fallback
            .roundRect(0, 0, CARD_WIDTH, CARD_HEIGHT, 8)
            .fill({
              color: [0x202722, 0x34342e, 0x41443f][index],
            });

          panel.addChild(shadow, fallback);

          if (sprite) {
            sprite.anchor.set(0.5);

            const textureWidth = sprite.texture.width || 1;
            const textureHeight = sprite.texture.height || 1;

            const coverScale = Math.max(
              CARD_WIDTH / textureWidth,
              CARD_HEIGHT / textureHeight
            );

            sprite.scale.set(coverScale);
            sprite.position.set(
              CARD_WIDTH / 2,
              CARD_HEIGHT / 2
            );

            panel.addChild(sprite);
          }

          mask
            .roundRect(0, 0, CARD_WIDTH, CARD_HEIGHT, 8)
            .fill(0xffffff);

          // Keep the mask from appearing as a white rectangle.
          mask.renderable = false;
          panel.addChild(mask);

          if (sprite) {
            sprite.mask = mask;
          }

          // The canvas is decorative; use the HTML picker for interaction.
          panel.eventMode = "none";

          stage.addChild(panel);

          panels.push({
            panel,
            sprite,
            mask,
            shadow,
            fallback,
            index,
          });
        });

        function layout() {
          if (!host || destroyed) return;

          const width = host.clientWidth;
          const height = host.clientHeight;

          if (!width || !height) return;

          const mobile = width < 520;
          const cardWidth = mobile
            ? Math.min(105, width * 0.25)
            : Math.min(190, width * 0.255);

          const cardHeight = cardWidth * (CARD_HEIGHT / CARD_WIDTH);
          const gap = mobile ? 9 : 16;
          const totalWidth =
            cardWidth * panels.length + gap * (panels.length - 1);

          const startX = (width - totalWidth) / 2;
          const centerY = height * (mobile ? 0.49 : 0.52);
          const selectedIndex =
            activeIndexRef.current % stoneSlides.length;

          panels.forEach(
            ({ panel, index }) => {
              const selected = index === selectedIndex;
              const scale =
                (cardWidth / CARD_WIDTH) * (selected ? 1.05 : 0.94);

              const visualWidth = CARD_WIDTH * scale;
              const visualHeight = CARD_HEIGHT * scale;

              const centerX =
                startX +
                index * (cardWidth + gap) +
                cardWidth / 2;

              const centerCardY =
                centerY + (selected ? -16 : 14);

              panel.scale.set(scale);
              panel.position.set(
                centerX - visualWidth / 2,
                centerCardY - visualHeight / 2
              );

              panel.alpha = selected ? 1 : 0.72;
            }
          );
        }

        let elapsed = 0;

        tickerFn = (ticker) => {
          elapsed += ticker.deltaTime * 0.012;

          panels.forEach(({ panel, index }) => {
            const selected =
              index ===
              activeIndexRef.current % stoneSlides.length;

            // Subtle floating movement without accumulating position drift.
            const width = host.clientWidth;
            const mobile = width < 520;
            const cardWidth = mobile
              ? Math.min(105, width * 0.25)
              : Math.min(190, width * 0.255);
            const cardHeight =
              cardWidth * (CARD_HEIGHT / CARD_WIDTH);
            const gap = mobile ? 9 : 16;
            const totalWidth =
              cardWidth * panels.length +
              gap * (panels.length - 1);
            const startX = (width - totalWidth) / 2;
            const centerX =
              startX +
              index * (cardWidth + gap) +
              cardWidth / 2;
            const centerY =
              host.clientHeight * (mobile ? 0.49 : 0.52) +
              (selected ? -16 : 14) +
              Math.sin(elapsed + index) * 2;

            const scale =
              (cardWidth / CARD_WIDTH) * (selected ? 1.05 : 0.94);

            panel.position.set(
              centerX - (CARD_WIDTH * scale) / 2,
              centerY - (CARD_HEIGHT * scale) / 2
            );
          });
        };

        app.ticker.add(tickerFn);

        resizeObserver = new ResizeObserver(layout);
        resizeObserver.observe(host);

        layout();
      } catch (error) {
        console.error("PixiJS hero initialization failed:", error);
        destroyApp();
      }
    }

    init();

    return () => {
      destroyed = true;
      resizeObserver?.disconnect();
      destroyApp();
    };
  }, []);

  const handleVarietySelect = (index) => {
    setActiveIndex(index);
  };

  return (
    <section className="export-hero" id="home">
      <div className="export-glow" aria-hidden="true" />

      <header className="export-nav">
        <a className="export-brand" href="/" aria-label="Granitura home">
          <span className="brand-mark">⌁</span>
          <span className="brand-name">GRANITURA</span>
          <span className="brand-caption">
            NATURAL STONE WORLDWIDE
          </span>
        </a>

        <nav className="export-links" aria-label="Main navigation">
          <a className="active" href="/">Home</a>
          <a href="/catlog-product">Catalog</a>
          <a href="/#process">Our Process</a>
          <a href="/#about">About</a>
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
            Granite supplied for Middle Eastern projects — from fresh
            blocks to precision cut-to-size pieces, selected for quality,
            consistency and architectural character.
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
                {String(activeSlideIndex + 1).padStart(2, "0")}
                {" "}
                <i>/ {String(stoneSlides.length).padStart(2, "0")}</i>
              </span>
              <span className="stone-type">{activeStone.type}</span>
            </div>

            <h2>{selectedVariety}</h2>
            <p>{activeStone.description}</p>

            <div className="stone-meta">
              <span>FINISH OPTIONS</span>
              <strong>{activeStone.finish}</strong>
            </div>

            <a
              href={`/export-quote?stone=${encodeURIComponent(selectedVariety)}`}
              className="stone-enquire"
            >
              Enquire about this stone <span>↗</span>
            </a>
          </div>

          <div className="variety-picker">
            <div className="picker-heading">
              <span>SELECT A VARIETY</span>
              <button
                type="button"
                onClick={() => setShowAll((previous) => !previous)}
                aria-expanded={showAll}
              >
                {showAll ? "Show less −" : "View all 50+ ↗"}
              </button>
            </div>

            <div className={`variety-list ${showAll ? "expanded" : ""}`}>
              {(showAll ? varieties : varieties.slice(0, 5)).map(
                (name) => {
                  const index = varieties.indexOf(name);

                  return (
                    <button
                      type="button"
                      key={name}
                      className={activeIndex === index ? "selected" : ""}
                      aria-pressed={activeIndex === index}
                      onClick={() => handleVarietySelect(index)}
                    >
                      <span
                        className={`variety-swatch swatch-${index % 4}`}
                      />
                      <span>{name}</span>
                      {activeIndex === index && (
                        <span className="check">✓</span>
                      )}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="export-footer">
        <span>FROM INDIAN QUARRIES</span>
        <span className="footer-arrow">→</span>
        <span>TO MIDDLE EAST PROJECTS</span>
        <span className="footer-note">
          NATURAL STONE · PROJECT SUPPLY
        </span>
      </footer>
    </section>
  );
}
