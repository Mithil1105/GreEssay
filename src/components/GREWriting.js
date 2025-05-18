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
  align-items: flex-end;
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
  &:focus { outline: none; border-color: ${({ theme }) => theme.primary}; }
`;
const Button = styled.button`
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  background-color: ${({ theme, green, red }) => red ? '#dc3545' : green ? '#28a745' : theme.primary};
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  transition: background 0.2s;
  &:hover { background-color: ${({ theme, green, red }) => red ? '#b52a37' : green ? '#218838' : theme.secondary}; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;
const TimeDisplay = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
`;
const IssueCard = styled.div`
  padding: 2rem 2rem 1.5rem 2rem;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  margin-bottom: 2rem;
  border: 1px solid ${({ theme }) => theme.border};
  font-size: 1.08rem;
`;
const IssuePrompt = styled.div`
  font-size: 1.18rem;
  font-weight: 600;
  margin-bottom: 1.1rem;
  color: ${({ theme }) => theme.text};
`;
const IssueInstructions = styled.div`
  font-size: 1.04rem;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.background};
  border-radius: 6px;
  padding: 0.8rem 1rem;
  margin-top: 0.5rem;
`;
const WritingArea = styled.textarea`
  width: 100%;
  min-height: 300px;
  max-height: 400px;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 1.1rem;
  line-height: 1.6;
  resize: vertical;
  overflow-y: auto;
  transition: ${({ theme }) => theme.transition};
  &:focus { outline: none; border-color: ${({ theme }) => theme.primary}; }
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
const ThemeCheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem 1.2rem;
  margin-bottom: 0.5rem;
`;
const ThemeCheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 1rem;
  cursor: pointer;
`;
const Checkbox = styled.input`
  margin-right: 0.5rem;
`;
const DropdownContainer = styled.div`
  position: relative;
  min-width: 320px;
`;
const DropdownButton = styled(Button)`
  width: 100%;
  text-align: left;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  margin-bottom: 0;
`;
const DropdownList = styled.div`
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  max-height: 320px;
  overflow-y: auto;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`;
const DropdownSearch = styled.input`
  width: 100%;
  padding: 0.5rem 1rem;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  &:focus { outline: none; }
`;
const DropdownItem = styled.div`
  padding: 0.7rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ selected, theme }) => selected ? theme.primary : 'inherit'};
  color: ${({ selected, theme }) => selected ? '#fff' : theme.text};
  &:hover { background: ${({ theme }) => theme.background}; }
  font-size: 0.98rem;
`;
const InfoNote = styled.div`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  border-left: 4px solid #17a2b8;
  padding: 0.7rem 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  font-style: italic;
  opacity: 0.85;
`;
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
const GREWriting = () => {
  const [issuesByTheme, setIssuesByTheme] = useState({});
  const [allIssues, setAllIssues] = useState([]); // flat list for dropdown
  const [selectedIssueIdx, setSelectedIssueIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [response, setResponse] = useState('');
  const [duration, setDuration] = useState(30 * 60); // 30 min default
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [finalStats, setFinalStats] = useState(null);
  const [stats, setStats] = useState({ wpm: 0, words: 0 });
  const timerRef = useRef();
  useEffect(() => {
    fetch('greIssues.json')
      .then(res => res.json())
      .then(data => {
        setIssuesByTheme(data);
        // flatten for dropdown
        const flat = [];
        Object.entries(data).forEach(([theme, arr]) => {
          arr.forEach(issue => flat.push({ ...issue, theme }));
        });
        setAllIssues(flat);
      })
      .catch(err => {
        setIssuesByTheme({});
        setAllIssues([]);
      });
  }, []);
  // Unique themes
  const allThemes = Object.keys(issuesByTheme);
  // Filtered issues for dropdown (only from selected themes)
  const filteredIssues = allIssues.filter(
    issue =>
      (selectedThemes.length === 0 || selectedThemes.includes(issue.theme)) &&
      (issue.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.prompt.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  // Current selected issue
  const selectedIssue = filteredIssues[selectedIssueIdx] || filteredIssues[0];
  // Timer and stats logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (isRunning && timeLeft === 0) {
      stopTest();
    }
    return () => clearTimeout(timerRef.current);
  }, [isRunning, timeLeft]);
  useEffect(() => {
    if (!isRunning) return;
    const elapsed = duration - timeLeft;
    const minutes = elapsed / 60;
    const words = response.trim().split(/\s+/).filter(Boolean).length;
    const wpm = minutes > 0 ? Math.round(words / minutes) : 0;
    setStats({ wpm, words });
  }, [response, isRunning, timeLeft, duration]);
  // Dropdown handlers
  const handleDropdownSelect = idx => {
    setSelectedIssueIdx(idx);
    setDropdownOpen(false);
  };
  // Theme handlers
  const handleThemeCheck = theme => {
    setSelectedThemes(prev =>
      prev.includes(theme)
        ? prev.filter(t => t !== theme)
        : [...prev, theme]
    );
    setSelectedIssueIdx(0); // reset issue selection
  };
  const handleClearThemes = () => {
    setSelectedThemes([]);
    setSelectedIssueIdx(0);
  };
  const handleRandomise = () => {
    const pool = filteredIssues;
    if (pool.length > 0) {
      const idx = Math.floor(Math.random() * pool.length);
      setSelectedIssueIdx(idx);
      setDropdownOpen(false);
    }
  };
  const startTest = () => {
    setResponse('');
    setStats({ wpm: 0, words: 0 });
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
  return (
    <Container>
      <Title>GRE Issue Writing Practice</Title>
      <InfoNote>
        <b>Note:</b> The topic will be displayed after pressing the Start Test button, as per GRE rules.
      </InfoNote>
      <ThemeCheckboxGroup>
        {allThemes.map(theme => (
          <ThemeCheckboxLabel key={theme}>
            <Checkbox
              type="checkbox"
              checked={selectedThemes.includes(theme)}
              onChange={() => handleThemeCheck(theme)}
              disabled={isRunning}
            />
            {theme}
          </ThemeCheckboxLabel>
        ))}
      </ThemeCheckboxGroup>
      <div style={{ marginBottom: '1rem' }}>
        <Button type="button" red onClick={handleClearThemes} disabled={isRunning}>Clear Themes</Button>
        <Button type="button" onClick={handleRandomise} disabled={isRunning}>Randomise</Button>
      </div>
      <ControlsRow>
        {/* Issue selection dropdown */}
        <DropdownContainer>
          <DropdownButton onClick={() => setDropdownOpen(o => !o)} disabled={isRunning}>
            {selectedIssue ? `${selectedIssue.theme}: ${selectedIssue.prompt.slice(0, 40)}...` : 'Select Issue'}
          </DropdownButton>
          {dropdownOpen && (
            <DropdownList>
              <DropdownSearch
                type="text"
                placeholder="Search issues..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
              />
              {filteredIssues.map((issue, idx) => (
                <DropdownItem
                  key={issue.id}
                  selected={idx === selectedIssueIdx}
                  onClick={() => handleDropdownSelect(idx)}
                >
                  <b>{issue.theme}</b>: {issue.prompt.slice(0, 60)}...
                </DropdownItem>
              ))}
            </DropdownList>
          )}
        </DropdownContainer>
        <select value={duration / 60} onChange={handleDurationChange} disabled={isRunning} style={{ padding: '0.5rem 1rem', borderRadius: 4, border: '1px solid #ccc', fontSize: '1rem' }}>
          <option value={30}>30 minutes</option>
          <option value={60}>60 minutes</option>
        </select>
      </ControlsRow>
      <TimeDisplay>
        Time Remaining: {formatTime(timeLeft)}
      </TimeDisplay>
      {/* Only show IssueCard while test is running */}
      {isRunning && selectedIssue && (
        <IssueCard>
          <h2>{selectedIssue.theme}</h2>
          <IssuePrompt>{selectedIssue.prompt}</IssuePrompt>
          <IssueInstructions><b>Instructions:</b> {selectedIssue.instructions}</IssueInstructions>
        </IssueCard>
      )}
      <WritingArea
        value={response}
        onChange={e => isRunning && setResponse(e.target.value)}
        placeholder={isRunning ? 'Start writing your response here...' : 'Click Start Test to begin'}
        disabled={!isRunning}
        spellCheck={false}
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
        <Stat>Words<br /><b>{stats.words}</b></Stat>
        <Stat>Time<br /><b>{formatTime(timeLeft)}</b></Stat>
      </StatsRow>
      {showResult && finalStats && (
        <ResultBox>
          <h2>Test Complete!</h2>
          <p><b>WPM:</b> {finalStats.wpm}</p>
          <p><b>Words Typed:</b> {finalStats.words}</p>
        </ResultBox>
      )}
    </Container>
  );
};
export default GREWriting; 