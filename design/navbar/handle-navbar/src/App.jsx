import { BikeIcon, MountainIcon, ToothIcon } from './icons';
import { BikeNav } from './components/BikeNav/BikeNav';
import { DentalNav } from './components/DentalNav/DentalNav';
import { HikingNav } from './components/HikingNav/HikingNav';
import { ShowcaseSection } from './components/ShowcaseSection/ShowcaseSection';
import styles from './App.module.css';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className={styles.header}>
        <h1>Shaped navigation bars</h1>
        <p>Three industry-themed navs: semantic, keyboard friendly and mobile responsive.</p>
      </header>

      <main id="main" className={styles.main}>
        <ShowcaseSection id="dentistry" title="Dentistry" icon={ToothIcon} accent="#2e5fb5" theme="dental">
          <DentalNav />
        </ShowcaseSection>

        <ShowcaseSection id="bike" title="Bike Brand" icon={BikeIcon} accent="#5f8a1f" theme="bike">
          <BikeNav />
        </ShowcaseSection>

        <ShowcaseSection id="hiking" title="Hiking & Outdoor" icon={MountainIcon} accent="#c4561d" theme="hiking">
          <HikingNav />
        </ShowcaseSection>
      </main>
    </>
  );
}
