import Image from 'next/image'
import Link from 'next/link'
import styles from './LandingHero.module.css'

export default function LandingHero() {
  return (
    <section className={styles.hero} aria-labelledby="landing-heading">
      <div className={styles.content}>
        <h1 id="landing-heading" className={styles.title}>Experience Luxury, Redefined</h1>
        <p className={styles.subtitle}>Curated pieces crafted with passion. Timeless design meets modern elegance.</p>
        <div className={styles.ctas}>
          <Link className={styles.primary} href="/items">Shop Collection</Link>
          <Link className={styles.secondary} href="/about">Learn More</Link>
        </div>
      </div>

      <div className={styles.media}>
  <Image src="/landing.jpg" alt="Portrait of a woman wearing a luxury outfit" fill priority className={styles.image} />
      </div>
    </section>
  )
}
