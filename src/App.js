import React from 'react';
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
import Navigation from './components/Navigation';
import QuantHelp from './QuantHelp';
import QuantCalculator from './QuantCalculator';

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
    <ThemeProvider theme={currentTheme}>
      <GlobalStyles />
      <Router>
        <div style={{ minHeight: '100vh', backgroundColor: currentTheme.body }}>
          <Navigation
            toggleTheme={cycleTheme}
            currentTheme={theme}
            themeOptions={themeOptions}
            setTheme={setTheme}
          />
          <Routes>
            <Route path="/" element={<GREWriting />} />
            <Route path="/gre-writing" element={<GREWriting />} />
            <Route path="/typing-practice" element={<TypingTest />} />
            <Route path="/quant-help" element={<QuantHelp />} />
            <Route path="/quant-calculator" element={<QuantCalculator />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
