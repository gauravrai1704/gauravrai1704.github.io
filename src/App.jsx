import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Research from './components/Research.jsx';
import Projects from './components/Projects.jsx';
import Academics from './components/Academics.jsx';
import Experience from './components/Experience.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Research />
        <Projects />
        <Academics />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
