import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>Welcome to Tone Pilot!</h1>
      <p>Your go-to app for songwriting, guitar education, and music theory exploration.</p>
      <div className="navigation">
          <Link href="/library">Interactive Chord/Scale Library</Link>
          <Link href="/composition">Song Composition Workspace</Link>
          <Link href="/tutorial">Tutorial and Tips</Link>
      </div>
    </>
  )
}
