
import "./Hero.css";
import PixiStoneGallery from "../pixiStoneGallery/PixiStoneGallery";

export default function HeroSection() {
  return (
    <section id="hero">
      <div className="hero-left">
        <p className="hero-eyebrow">
          Natural Stone Exports · India to the Middle East
        </p>

        <h1 className="hero-title">
          Indian Stone.
          <br />
          <em>Global</em>
          <br />
          Standards.
        </h1>

        <p className="hero-subtitle">
          Exporting premium granite and natural stone from India
          to Middle Eastern markets. Reliable sourcing, carefully
          selected materials, and dependable supply for importers,
          distributors, builders, and large-scale projects.
        </p>

        <div className="hero-actions">
          <a href="#catalog" className="btn-primary">
            Explore Our Stones
          </a>

          <a href="/export-quote" className="btn-outline">
            Request Export Quote
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              width="18"
              height="18"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div className="hero-stats">
          <div>
            <div className="hero-stat-num">India</div>
            <div className="hero-stat-label">Stone Sourcing</div>
          </div>

          <div>
            <div className="hero-stat-num">B2B</div>
            <div className="hero-stat-label">Export Partnerships</div>
          </div>

          <div>
            <div className="hero-stat-num">Global</div>
            <div className="hero-stat-label">Supply Ambition</div>
          </div>
        </div>
      </div>

      <div className="hero-right">
        <PixiStoneGallery />

        <div className="scroll-hint">
          <span>Discover Our Stones</span>
          <div className="scroll-line" />
        </div>
      </div>
    </section>
  );
}
