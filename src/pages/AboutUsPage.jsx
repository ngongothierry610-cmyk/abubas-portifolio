const reasons = [
  {
    title: "Cinematic Excellence",
    text: "We bring film-grade cameras, lighting, and narrative structure to every project, giving your brand a polished, premium aesthetic.",
  },
  {
    title: "Scroll-Stopping Social Strategy",
    text: "Beautiful video is useless if no one sees it. We design platform-specific content tailored for Instagram, TikTok, YouTube, and LinkedIn to build active, engaged communities.",
  },
  {
    title: "Full-Funnel Content Marketing",
    text: "From brand awareness campaigns to conversion-focused video ads, we craft creative content designed to drive measurable ROI and accelerate business growth.",
  },
];

const services = [
  ["Videography & Production", "High-definition promotional videos, event coverage, product showcases, and dynamic commercial shoots."],
  ["Filmmaking & Storytelling", "Brand documentaries, narrative-driven ads, and corporate short films that build deep emotional connections."],
  ["Social Media Management", "End-to-end management, content calendars, audience engagement, and community building."],
  ["Performance Marketing", "Targeted video ad strategies, audience retargeting, and growth campaigns engineered to convert viewers into clients."],
];

export default function AboutUsPage() {
  return (
    <div className="about-page">
      <header className="about-hero">
        <h1>
          We Don’t Just Tell Stories.{" "}
          <span>We Make Brands Impossible to Ignore.</span>
        </h1>
        <p className="about-tagline">
          Cinematic Filmmaking Meets Strategic Social Growth.
        </p>
      </header>

      <section className="about-block">
        <h2>Who We Are</h2>
        <p>
          At our core, we are visual storytellers, digital strategists, and
          creative perfectionists.
        </p>
        <p>
          We bridge the gap between high-end cinematic production and strategic
          social media growth. Whether it’s a full-scale commercial film, a
          brand documentary, or high-impact short-form content engineered for
          virality, we turn visual content into your strongest business asset.
        </p>
      </section>

      <section className="about-block">
        <h2>What We Believe</h2>
        <p>
          In a digital landscape overflowing with noise, standard content gets
          scrolled past. Attention isn’t given—it’s earned.
        </p>
        <p>
          We believe every brand has a distinct voice and a powerful story. Our
          mission is to capture that essence through pristine videography,
          craft it through expert filmmaking, and amplify it through
          data-driven social media management and marketing.
        </p>
      </section>

      <section className="about-block">
        <h2>Why Brands Work With Us</h2>
        <div className="about-grid">
          {reasons.map((r) => (
            <div key={r.title} className="about-card">
              <h3>{r.title}</h3>
              <p>{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-block">
        <h2>How We Help You Win</h2>
        <div className="about-services">
          <div className="about-service-row about-service-head">
            <span>Service</span>
            <span>What We Deliver</span>
          </div>
          {services.map(([name, text]) => (
            <div key={name} className="about-service-row">
              <strong>{name}</strong>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="about-cta">
        <h2>Ready to Elevate Your Brand’s Visual Presence?</h2>
        <p>
          Great stories create unforgettable brands. Let’s collaborate to craft
          high-impact content that captures attention, drives engagement, and
          scales your business.
        </p>
        <a
          className="view-all-btn"
          href="mailto:ngongothierry610@gmail.com?subject=Quote%20Request"
        >
          Get a Quote
        </a>
      </section>
    </div>
  );
}