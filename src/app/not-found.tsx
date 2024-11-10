"use client"
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="not-found-container">
      <h2 className="not-found-title">Not Found</h2>
      <p className="not-found-text">Could not find requested resource</p>
      <Link href="/" className="not-found-link">Return Home</Link>

      <style jsx>{`
        .not-found-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 1rem;
          text-align: center;
          background-color: var(--background-color, #ffffff);
        }

        .not-found-title {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: var(--primary-color, #333);
        }

        .not-found-text {
          font-size: 1rem;
          margin-bottom: 1.5rem;
          color: var(--secondary-color, #666);
        }

        .not-found-link {
          padding: 0.75rem 1.5rem;
          border-radius: 0.375rem;
          background-color: var(--accent-color, #0070f3);
          color: white;
          text-decoration: none;
          transition: opacity 0.2s ease;
        }

        .not-found-link:hover {
          opacity: 0.8;
        }

        @media (min-width: 768px) {
          /* Desktop styles will be minimal */
          .not-found-container {
            padding: 2rem;
          }
        }
      `}</style>
    </div>
  )
}