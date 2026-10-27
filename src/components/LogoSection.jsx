// src/components/LogoSection.jsx
import africaincolors from "../assets/logos/africaincolors.png";
import gadgetstore from "../assets/logos/gadgetstore.jpeg";
import glads from "../assets/logos/glads.jpeg";
import hc from "../assets/logos/hc.PNG";
import lakeresort from "../assets/logos/lakeresort.png";
import newextreme from "../assets/logos/newextreme.PNG";
import newspecies from "../assets/logos/newspecies.PNG";
import regis from "../assets/logos/regis.jpeg";
import sage from "../assets/logos/sage.jpeg";

export default function LogoSection() {
  const logos = [
    { name: "Africa in Colors", img: africaincolors },
    { name: "Gadget Store", img: gadgetstore },
    { name: "Glads Apartments", img: glads },
    { name: "HC", img: hc },
    { name: "Bugesera Lake Resort", img: lakeresort },
    { name: "New Extreme", img: newextreme },
    { name: "New Species", img: newspecies },
    { name: "Regis Motors", img: regis },
    { name: "Sage Beauty Studio", img: sage },
  ];

  return (
    <section className="logo-section">
      <div className="logo-container">
        <h2 className="logo-section-title">FEATURED BRANDS & PARTNERS</h2>
        <div className="logos-grid">
          {logos.map((logo, index) => (
            <div className="logo-card" key={index}>
              <img src={logo.img} alt={logo.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}