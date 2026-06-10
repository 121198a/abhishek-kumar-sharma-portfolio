import "./styles/globals.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Work from "./components/Work";
import Skills from "./components/Skills";
import Education from "./components/Education";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Work />
        <Skills />
        <Education />
        <About />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

export default App;