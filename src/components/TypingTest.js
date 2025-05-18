import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';

const Container = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const ControlsRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const Button = styled.button`
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  background-color: ${({ theme, green }) => green ? '#28a745' : theme.primary};
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  transition: background 0.2s;
  &:hover {
    background-color: ${({ theme, green }) => green ? '#218838' : theme.secondary};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ToggleButton = styled(Button)`
  background-color: ${({ active }) => active ? '#28a745' : '#f8f9fa'};
  color: ${({ active }) => active ? '#fff' : '#333'};
  border: 1px solid #28a745;
  &:hover {
    background-color: ${({ active }) => active ? '#218838' : '#e2e6ea'};
    color: #333;
  }
`;

const TimeDisplay = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
`;

const PromptBox = styled.div`
  background: ${({ theme }) => theme.background};
  border-radius: 8px;
  padding: 1.2rem;
  min-height: 80px;
  max-height: 220px;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1.2rem;
  border: 1px solid ${({ theme }) => theme.border};
  word-break: break-word;
  font-family: 'Fira Mono', 'Consolas', monospace;
  overflow-y: auto;
`;

const CharSpan = styled.span`
  ${({ correct, incorrect, current, hardMode }) =>
    !hardMode &&
    css`
      background: ${correct ? '#d4edda' : incorrect ? '#f8d7da' : 'none'};
      color: ${incorrect ? '#dc3545' : correct ? '#28a745' : 'inherit'};
      border-bottom: ${current ? '2px solid #007bff' : 'none'};
      font-weight: ${current ? 700 : 400};
      text-decoration: ${current ? 'underline' : 'none'};
      transition: background 0.1s;
    `}
`;

const TypingArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  max-height: 220px;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.2rem;
  resize: vertical;
  overflow-y: auto;
  transition: ${({ theme }) => theme.transition};
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
  font-family: 'Fira Mono', 'Consolas', monospace;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;
  font-size: 1.1rem;
  font-weight: 500;
`;

const Stat = styled.div`
  background: ${({ theme }) => theme.background};
  border-radius: 6px;
  padding: 0.7rem 1.2rem;
  min-width: 110px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.border};
`;

const ResultBox = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 2px solid #28a745;
  border-radius: 8px;
  padding: 2rem;
  margin: 2rem 0;
  text-align: center;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text};
`;

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once.",
  "Programming is the process of creating a set of instructions that tell a computer how to perform a task. Programming can be done using a variety of computer programming languages.",
  "The Internet is a global network of billions of computers and other electronic devices. With the Internet, it's possible to access almost any information, communicate with anyone else in the world, and do much more.",
  "Typing speed is a useful skill for students and professionals alike. Practicing regularly can help improve both speed and accuracy.",
];

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const TypingTest = () => {
  const [duration, setDuration] = useState(30 * 60); // in seconds
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [useCustom, setUseCustom] = useState(false);
  const [customText, setCustomText] = useState('');
  const [selectedSampleIdx, setSelectedSampleIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [hardMode, setHardMode] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [finalStats, setFinalStats] = useState(null);
  const timerRef = useRef();
  const startTimeRef = useRef();

  // Get the text to type
  const promptText = useCustom ? customText : sampleTexts[selectedSampleIdx];

  // Live stats
  const [stats, setStats] = useState({ wpm: 0, accuracy: 100, words: 0, mistakes: 0 });

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (isRunning && timeLeft === 0) {
      stopTest();
    }
    return () => clearTimeout(timerRef.current);
  }, [isRunning, timeLeft]);

  // Real-time stats calculation
  useEffect(() => {
    if (!isRunning) return;
    const elapsed = duration - timeLeft;
    const minutes = elapsed / 60;
    const words = typed.trim().split(/\s+/).filter(Boolean).length;
    const wpm = minutes > 0 ? Math.round(words / minutes) : 0;
    let mistakes = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] !== (promptText[i] || '')) mistakes++;
    }
    const accuracy = typed.length > 0 ? Math.max(0, Math.round(((typed.length - mistakes) / typed.length) * 100)) : 100;
    setStats({ wpm, accuracy, words, mistakes });
  }, [typed, isRunning, timeLeft, promptText, duration]);

  const startTest = () => {
    if (useCustom && !customText.trim()) {
      alert('Please enter your custom text.');
      return;
    }
    setTyped('');
    setStats({ wpm: 0, accuracy: 100, words: 0, mistakes: 0 });
    setTimeLeft(duration);
    setIsRunning(true);
    setShowResult(false);
    setFinalStats(null);
  };

  const stopTest = () => {
    setIsRunning(false);
    setShowResult(true);
    setFinalStats(stats);
  };

  const handleDurationChange = e => {
    const mins = parseInt(e.target.value, 10);
    setDuration(mins * 60);
    setTimeLeft(mins * 60);
  };

  const handleSampleChange = e => {
    setSelectedSampleIdx(Number(e.target.value));
  };

  // Character-by-character rendering
  const renderPrompt = () => {
    return promptText.split('').map((char, idx) => {
      let correct = typed[idx] === char;
      let incorrect = typed[idx] && typed[idx] !== char;
      let current = idx === typed.length && isRunning;
      return (
        <CharSpan
          key={idx}
          correct={correct}
          incorrect={incorrect}
          current={current}
          hardMode={hardMode}
        >
          {char}
        </CharSpan>
      );
    });
  };

  return (
    <Container>
      <Title>Typing Speed Test</Title>
      <ControlsRow>
        <Select value={duration / 60} onChange={handleDurationChange} disabled={isRunning}>
          <option value={30}>30 minutes</option>
          <option value={60}>60 minutes</option>
        </Select>
        <Select value={selectedSampleIdx} onChange={handleSampleChange} disabled={isRunning || useCustom}>
          {sampleTexts.map((t, i) => (
            <option value={i} key={i}>Sample {i + 1}</option>
          ))}
        </Select>
        <ToggleButton
          type="button"
          active={useCustom}
          onClick={() => setUseCustom(u => !u)}
          disabled={isRunning}
        >
          {useCustom ? 'Use Sample Text' : 'Use Custom Text'}
        </ToggleButton>
        <ToggleButton
          type="button"
          active={hardMode}
          onClick={() => setHardMode(h => !h)}
          disabled={isRunning}
        >
          {hardMode ? 'Hard Mode On' : 'Hard Mode Off'}
        </ToggleButton>
      </ControlsRow>
      {useCustom && !isRunning && (
        <TypingArea
          value={customText}
          onChange={e => setCustomText(e.target.value)}
          placeholder="Enter your custom text here..."
        />
      )}
      <TimeDisplay>
        Time Remaining: {formatTime(timeLeft)}
      </TimeDisplay>
      <PromptBox style={{ opacity: isRunning ? 1 : 0.7, minHeight: 80 }}>
        {promptText.length === 0 ? (
          <span style={{ color: '#888' }}>Enter or select text above</span>
        ) : (
          hardMode && isRunning
            ? promptText
            : renderPrompt()
        )}
      </PromptBox>
      <TypingArea
        value={typed}
        onChange={e => isRunning && setTyped(e.target.value)}
        placeholder={isRunning ? 'Start typing here...' : `Click 'Start Test' to begin`}
        disabled={!isRunning}
        style={hardMode && isRunning ? { color: 'transparent', textShadow: '0 0 8px #888' } : {}}
        spellCheck={false}
        autoFocus={isRunning}
      />
      <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
        {!isRunning ? (
          <Button green onClick={startTest}>Start Test</Button>
        ) : (
          <Button green onClick={stopTest}>Stop Test</Button>
        )}
      </div>
      <StatsRow>
        <Stat>WPM<br /><b>{stats.wpm}</b></Stat>
        <Stat>Accuracy<br /><b>{stats.accuracy}%</b></Stat>
        <Stat>Words<br /><b>{stats.words}</b></Stat>
        <Stat>Mistakes<br /><b>{stats.mistakes}</b></Stat>
        <Stat>
          <span style={{ fontWeight: 400 }}>Mode</span><br />
          <span>{hardMode ? 'Hard' : 'Normal'}</span>
        </Stat>
      </StatsRow>
      {showResult && finalStats && (
        <ResultBox>
          <h2>Test Complete!</h2>
          <p><b>WPM:</b> {finalStats.wpm}</p>
          <p><b>Accuracy:</b> {finalStats.accuracy}%</p>
          <p><b>Words Typed:</b> {finalStats.words}</p>
          <p><b>Mistakes:</b> {finalStats.mistakes}</p>
        </ResultBox>
      )}
    </Container>
  );
};

export default TypingTest; 