import Link from "next/link";

export default function Home() {
  return (
    <div className="app-container">
      <h1>Welcome to Song Smith!</h1>
      <p>Your go-to app for songwriting, guitar learning, and music theory exploration.</p>
      <div className="navigation">
          <Link href="/library">Interactive Chord/Scale Library</Link>
          <Link href="/composition">Song Composition Workspace</Link>
          <Link href="/tutorial">Tutorial and Tips</Link>
      </div>
    </div>
  )
}
