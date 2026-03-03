import type { ReactNode } from 'react'
import { Component } from 'react'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    // Intentionally empty
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page" style={{ paddingTop: 96 }}>
          <div className="page__container">
            <div className="card">
              <h2 className="cardTitle" style={{ marginTop: 0 }}>Something went wrong</h2>
              <p className="cardText">Please refresh the page and try again.</p>
              <div className="ctaActions">
                <button className="btn btn--primary" type="button" onClick={() => window.location.reload()}>
                  Reload
                </button>
                <a className="btn" href="/home">Back Home</a>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
