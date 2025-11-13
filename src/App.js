import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import {
  lightTheme,
  darkTheme,
  pinkTheme,
  violetTheme,
  blueTheme,
  greenTheme,
  redTheme
} from './styles/themes';
import { useTheme } from './hooks/useTheme';
import TypingTest from './components/TypingTest';
import GREWriting from './components/GREWriting';
import IELTSWritingPage from './components/IELTSWritingPage';
import Navigation from './components/Navigation';
import QuantHelp from './QuantHelp';
import QuantCalculator from './QuantCalculator';
import VerbalHelp from './components/VerbalHelp';
import Footer from './components/Footer';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{
          padding: '2rem',
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'center',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '8px'
        }}>
          <h1>Something went wrong.</h1>
          <p>We're sorry, but an unexpected error occurred.</p>
          {this.state.error && (
            <details style={{
              whiteSpace: 'pre-wrap',
              textAlign: 'left',
              padding: '1rem',
              backgroundColor: '#fff',
              borderRadius: '4px',
              marginTop: '1rem'
            }}>
              <summary>Error Details (Click to Expand)</summary>
              <p>{this.state.error.toString()}</p>
              <pre>{this.state.errorInfo.componentStack}</pre>
            </details>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const { theme, cycleTheme, themeOptions, setTheme } = useTheme();

  const themeMap = {
    'light': lightTheme,
    'dark': darkTheme,
    'pink': pinkTheme,
    'violet': violetTheme,
    'blue': blueTheme,
    'green': greenTheme,
    'red': redTheme
  };

  const currentTheme = themeMap[theme] || lightTheme;

  return (
    <ErrorBoundary>
      <ThemeProvider theme={currentTheme}>
        <GlobalStyles />
        <Router>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: currentTheme.body }}>
            <Navigation
              toggleTheme={cycleTheme}
              currentTheme={theme}
              themeOptions={themeOptions}
              setTheme={setTheme}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Routes>
                <Route path="/" element={<GREWriting />} />
                <Route path="/gre-writing" element={<GREWriting />} />
                <Route path="/ielts-writing" element={<IELTSWritingPage />} />
                <Route path="/typing-practice" element={<TypingTest />} />
                <Route path="/quant-help" element={<QuantHelp />} />
                <Route path="/quant-calculator" element={<QuantCalculator />} />
                <Route path="/verbal-help" element={<VerbalHelp />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
