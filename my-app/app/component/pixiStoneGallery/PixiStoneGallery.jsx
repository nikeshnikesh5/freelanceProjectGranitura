
"use client";

import { useEffect, useRef, useState } from "react";
import { Application, Assets, Container, Sprite, Graphics } from "pixi.js";
import "./PixiStoneGallery.css";

const stones = [
  {
    name: "Italian Marble",
    category: "MARBLE COLLECTION",
    src: "/assets/ItalianMarbles.jpg",
    description: "Refined surfaces for premium interiors.",
  },
  {
    name: "granite",
    category: "GRANITE COLLECTION",
    src: "/assets/Granites.jpg",
    description: "Durable natural stone for architectural projects.",
  },
  {
    name: "Bangalore Stone",
    category: "INDIAN NATURAL STONE",
    src: "/assets/BangloreStone.jpg",
    description: "Distinctive character for outdoor spaces.",
  },
  {
    name: "Kota Stone",
    category: "NATURAL STONE COLLECTION",
    src: "/assets/KotaBlackStone.jpg",
    description: "Versatile stone for residential and commercial use.",
  },
];

export default function PixiStoneGallery() {
  const hostRef = useRef(null);
  const [selected, setSelected] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let app;
    let observer;
    let disposed = false;
    const panels = [];

    async function init() {
      const pixi = new Application();
      app = pixi;

      await pixi.init({
        backgroundAlpha: 0,
        antialias: true,
        autoDensity: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        resizeTo: host,
      });

      if (disposed) {
        pixi.destroy(true);
        return;
      }

      host.appendChild(pixi.canvas);
      pixi.canvas.setAttribute("aria-hidden", "true");

      const textures = await Promise.all(
        stones.map((stone) => Assets.load(stone.src))
      );

      if (disposed) {
        pixi.destroy(true);
        return;
      }

      stones.forEach((stone, index) => {
        const panel = new Container();
        const sprite = new Sprite(textures[index]);
        const mask = new Graphics();

        sprite.anchor.set(0.5);
        panel.addChild(sprite);
        panel.addChild(mask);
        sprite.mask = mask;

        const state = {
          panel,
          sprite,
          mask,
          width: 0,
          height: 0,
          hover: 0,
          targetHover: 0,
          targetX: 0,
          targetY: 0,
          intro: 0,
          selected: index === 0,
        };

        panel.eventMode = "static";
        panel.cursor = "pointer";

        panel.on("pointerover", () => {
          state.targetHover = 1;
        });

        panel.on("pointerout", () => {
          state.targetHover = 0;
          state.targetX = 0;
          state.targetY = 0;
        });

        panel.on("pointermove", (event) => {
          const bounds = panel.getBounds();

          if (!bounds.width || !bounds.height) return;

          state.targetX =
            ((event.global.x - bounds.x) / bounds.width - 0.5) * 10;

          state.targetY =
            ((event.global.y - bounds.y) / bounds.height - 0.5) * 10;
        });

        panel.on("pointertap", () => {
          setSelected(index);
          panels.forEach((item, i) => {
            item.selected = i === index;
          });
        });

        pixi.stage.addChild(panel);
        panels.push(state);
      });

      function layout() {
        const width = host.clientWidth;
        const height = host.clientHeight;

        if (!width || !height) return;

        const gap = width < 500 ? 10 : 14;
        const cellWidth = (width - gap) / 2;
        const cellHeight = (height - gap) / 2;

        panels.forEach((state, index) => {
          const col = index % 2;
          const row = Math.floor(index / 2);

          state.width = cellWidth;
          state.height = cellHeight;

          state.panel.position.set(
            col * (cellWidth + gap) + cellWidth / 2,
            row * (cellHeight + gap) + cellHeight / 2
          );

          state.mask.clear();
          state.mask
            .roundRect(
              -cellWidth / 2,
              -cellHeight / 2,
              cellWidth,
              cellHeight,
              14
            )
            .fill(0xffffff);

          const texture = state.sprite.texture;
          const scale = Math.max(
            cellWidth / texture.width,
            cellHeight / texture.height
          );

          state.sprite.scale.set(scale);
          state.sprite.position.set(0, 0);
        });
      }

      layout();

      observer = new ResizeObserver(layout);
      observer.observe(host);

      pixi.ticker.add((ticker) => {
        const dt = Math.min(ticker.deltaTime, 3);
        const ease = 1 - Math.pow(0.84, dt);

        panels.forEach((state) => {
          state.hover +=
            (state.targetHover - state.hover) * ease;

          state.intro = Math.min(1, state.intro + 0.035 * dt);

          const baseScale = Math.max(
            state.width / state.sprite.texture.width,
            state.height / state.sprite.texture.height
          );

          const zoom = 1 + state.hover * 0.08;

          state.sprite.scale.set(baseScale * zoom);
          state.sprite.x +=
            (state.targetX * state.hover - state.sprite.x) * ease;
          state.sprite.y +=
            (state.targetY * state.hover - state.sprite.y) * ease;

          state.panel.alpha = Math.min(1, state.intro * 1.6);
        });
      });

      setReady(true);
    }

    init().catch((error) => {
      if (!disposed) {
        console.error("PixiJS gallery failed to load:", error);
      }
    });

    return () => {
      disposed = true;
      observer?.disconnect();
      panels.length = 0;

      if (app) {
        app.destroy(true, {
          children: true,
          texture: false,
          textureSource: false,
        });
      }
    };
  }, []);

  const activeStone = stones[selected];

  return (
    <div className={`pixi-gallery ${ready ? "is-ready" : ""}`}>
      <div className="pixi-gallery-canvas" ref={hostRef} />

      <div className="pixi-gallery-topline">
        <span className="gallery-status">
          <span className="status-dot" />
          NATURAL STONE COLLECTION
        </span>
        <span className="gallery-count">0{selected + 1} / 04</span>
      </div>

      <div className="pixi-gallery-labels">
        {stones.map((stone, index) => (
          <button
            key={stone.name}
            type="button"
            className={`pixi-stone-label ${
              selected === index ? "active" : ""
            }`}
            onClick={() => setSelected(index)}
            aria-pressed={selected === index}
          >
            <span className="stone-label-number">0{index + 1}</span>
            <span>{stone.name}</span>
            <span className="stone-label-arrow">↗</span>
          </button>
        ))}
      </div>

      <div className="pixi-gallery-detail" aria-live="polite">
        <div>
          <span className="detail-category">
            {activeStone.category}
          </span>
          <h2>{activeStone.name}</h2>
          <p>{activeStone.description}</p>
        </div>

        <a href="/export-quote" aria-label={`Request a quote for ${activeStone.name}`}>
          <span>Enquire</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}
