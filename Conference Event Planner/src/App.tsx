import { useState } from 'react'
import './App.css'
import { ProductSection } from './Component/EventSelection'

function App() {
  const [showPlanner, setShowPlanner] = useState(false)

  if (showPlanner) {
    return <ProductSection onBack={() => setShowPlanner(false)} />
  }

  return (
    <main>
      <section className="landing-hero" id="landing">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-intro">
            <h1>
              Conference
              <br />
              Expense
              <br />
              Planner
            </h1>
            <p>Plan your next major event with us!</p>
            <button
              type="button"
              className="get-started"
              onClick={() => setShowPlanner(true)}
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

    </main>
  )
}

export default App
