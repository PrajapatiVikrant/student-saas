import { CTA } from "./landingComponent/CTA";
import { Features } from "./landingComponent/Features";
import { Footer } from "./landingComponent/Footer";
import { Hero } from "./landingComponent/Hero";
import { Navigation } from "./landingComponent/Navigation";
import { Portals } from "./landingComponent/Portals";


export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <Features />
      <Portals />
      <CTA />
      <Footer />
    </div>
  );
}
