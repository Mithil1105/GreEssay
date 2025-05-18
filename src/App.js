import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { lightTheme, darkTheme } from './styles/themes';
import { useTheme } from './hooks/useTheme';
import TypingTest from './components/TypingTest';
import GREWriting from './components/GREWriting';
import Navigation from './components/Navigation';

function App() {
  const { theme, toggleTheme } = useTheme();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyles />
      <Router>
        <Navigation toggleTheme={toggleTheme} currentTheme={theme} />
        <Routes>
          <Route path="/" element={<TypingTest />} />
          <Route path="/gre-writing" element={<GREWriting />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
