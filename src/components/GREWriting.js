import React, { useState, useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { defaultTheme } from '../themes'; // Import defaultTheme if needed for specific cases, otherwise remove

const Container = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
  background-color: ${({ theme }) => theme.body};
  @media (max-width: 600px) {
    padding: 0 0.5rem;
    margin: 1rem 0;
  }
`;
const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.text};
  @media (max-width: 600px) {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }
`;
const ControlsRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  align-items: flex-end;
  background-color: ${({ theme }) => theme.body};
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
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
  background-color: ${({ theme, $green, $red }) => $red ? theme.error : $green ? theme.success : theme.primary};
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  transition: background 0.2s;
  &:hover { background-color: ${({ theme, $green, $red }) => $red ? theme.error + 'E6' : $green ? theme.success + 'E6' : theme.secondary}; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;
const TimeDisplay = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
  ${({ style, theme }) => style && css`
    ${Object.entries(style).map(([key, value]) => css`${key}: ${value};`)}
    background: ${style.background ? style.background : theme.background};
    color: ${style.color ? style.color : theme.text};
  `}
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
  min-height: 200px;
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
  @media (max-width: 600px) {
    font-size: 1rem;
    min-height: 120px;
    padding: 0.7rem;
  }
`;
const StatsRow = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;
  font-size: 1.1rem;
  font-weight: 500;
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.5rem;
    font-size: 1rem;
    margin-top: 1rem;
  }
`;
const Stat = styled.div`
  background: ${({ theme }) => theme.background};
  border-radius: 6px;
  padding: 0.7rem 1.2rem;
  min-width: 110px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.border};
  @media (max-width: 600px) {
    min-width: 80px;
    padding: 0.5rem 0.7rem;
  }
`;
const ResultBox = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 2px solid ${({ theme }) => theme.success};
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
  @media (max-width: 600px) {
    min-width: 100%;
    width: 100%;
  }
`;
const DropdownButton = styled(Button)`
  width: 100%;
  text-align: left;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  margin-bottom: 0;
  @media (max-width: 600px) {
    font-size: 1rem;
    padding: 0.7rem 1rem;
  }
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
  border-left: 4px solid ${({ theme }) => theme.infoBorder || '#17a2b8'};
  padding: 0.7rem 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  font-style: italic;
  opacity: 0.85;
`;

const PreviousResultsContainer = styled.div`
  margin-top: 2rem;
  border-top: 2px solid ${({ theme }) => theme.border};
  padding-top: 1rem;
  background: ${({ theme }) => theme.surface};
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ResultItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  transition: ${({ theme }) => theme.transition};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadow};
  }
`;

const ResultInfo = styled.div`
  flex: 1;
`;

const ResultDate = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.secondary};
  margin-bottom: 0.5rem;
`;

const ResultTopic = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${keyframes`from { opacity: 0; } to { opacity: 1; }`} 0.2s ease-out;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.surface};
  padding: 2rem;
  border-radius: 12px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  color: ${({ theme }) => theme.text};

  h2, h3, h4 {
    color: ${({ theme }) => theme.text};
    margin-bottom: 1rem;
  }

  p {
    color: ${({ theme }) => theme.text};
    line-height: 1.6;
  }
`;

const EssayText = styled.div`
  white-space: pre-wrap;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  line-height: 1.6;
  font-size: 1rem;
  margin-top: 0.5rem;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 1rem 0;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    color: ${({ theme }) => theme.text};
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    background: ${({ theme }) => theme.background};
    border-radius: 4px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  opacity: 0.7;
  transition: opacity 0.2s;
  &:hover { opacity: 1; }
`;

const ModalSection = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  &:last-child { border-bottom: none; }
`;

const InfoBox = styled.div`
  background: ${({ theme }) => theme.background};
  border-left: 4px solid ${({ theme }) => theme.primary};
  padding: 1rem;
  margin: 1rem 0;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
`;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Add evaluateEssay function before the GREWriting component
const evaluateEssay = (essay, prompt, highFreqWords, nlWords) => {
  // Basic metrics
  const wordCount = essay.trim().split(/\s+/).length;
  const paragraphs = essay.split(/\n\s*\n/).length;
  const sentences = essay.split(/[.!?]+/).filter(Boolean).length;
  const avgSentenceLength = wordCount / sentences;

  // Vocabulary analysis
  const words = essay.toLowerCase().match(/\b\w+\b/g) || [];
  const uniqueWords = new Set(words);
  const vocabDiversity = Math.round((uniqueWords.size / words.length) * 100);

  const longWords = words.filter(w => w.length > 7);
  const uniqueLongWords = new Set(longWords);

  const highFreqCount = words.filter(w => highFreqWords.includes(w)).length;
  const usedNLWords = words.filter(w => nlWords.includes(w));

  // Topic analysis
  const promptTerms = prompt.toLowerCase().match(/\b\w+\b/g) || [];
  const promptTermUsage = promptTerms.filter(term => essay.toLowerCase().includes(term)).length;

  const topicAnalysis = {
    directAddress: essay.toLowerCase().includes(prompt.toLowerCase()),
    hasPosition: /(i believe|in my opinion|i think|i agree|i disagree)/i.test(essay),
    promptTermUsage
  };

  // Argument analysis
  const argumentAnalysis = {
    hasExamples: /(for example|for instance|such as|like|e\.g\.)/i.test(essay),
    hasReasoning: /(because|therefore|thus|hence|as a result)/i.test(essay),
    hasCounterArguments: /(however|although|despite|nevertheless|on the other hand)/i.test(essay),
    conclusionPresent: /(in conclusion|to conclude|in summary|to summarize)/i.test(essay)
  };

  // Calculate scores
  const topicRelevance = topicAnalysis.directAddress ? 2 : 0;
  const argumentQuality = (argumentAnalysis.hasExamples ? 1 : 0) + (argumentAnalysis.hasReasoning ? 1 : 0);
  const structure = paragraphs >= 3 ? 1 : 0;
  const wordCountScore = wordCount >= 300 ? 1 : 0;

  // Simple NLP score based on vocabulary and structure
  const nlpScore = (vocabDiversity / 20) + (uniqueLongWords.size / 10) + (avgSentenceLength / 5);

  const finalScore = Math.min(6, Math.round(
    topicRelevance + argumentQuality + structure + wordCountScore + (nlpScore / 2)
  ));

  return {
    finalScore,
    breakdown: {
      topicRelevance,
      argumentQuality,
      structure,
      wordCount: wordCountScore
    },
    metrics: {
      wordCount,
      paragraphs,
      sentences,
      avgSentenceLength,
      vocabDiversity,
      highFreqCount,
      usedNLWords: usedNLWords.length,
      longWords: longWords.length,
      uniqueLongWords: uniqueLongWords.size
    },
    topicAnalysis,
    argumentAnalysis,
    nlpScore
  };
};

const GREWriting = () => {
  const [issuesByTheme, setIssuesByTheme] = useState({});
  const [allIssues, setAllIssues] = useState([]);
  const [selectedIssueIdx, setSelectedIssueIdx] = useState(() => {
    const saved = localStorage.getItem('selectedIssueIdx');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedThemes, setSelectedThemes] = useState(() => {
    const saved = localStorage.getItem('selectedThemes');
    return saved ? JSON.parse(saved) : [];
  });
  const [response, setResponse] = useState(() => {
    const saved = localStorage.getItem('essayResponse');
    return saved || '';
  });
  const [duration, setDuration] = useState(() => {
    const saved = localStorage.getItem('duration');
    return saved ? parseInt(saved, 10) : 30 * 60;
  });
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem('timeLeft');
    return saved ? parseInt(saved, 10) : 30 * 60;
  });
  const [isRunning, setIsRunning] = useState(() => {
    const saved = localStorage.getItem('isRunning');
    return saved === 'true';
  });
  const [showResult, setShowResult] = useState(false);
  const [finalStats, setFinalStats] = useState(null);
  const [stats, setStats] = useState({ wpm: 0, words: 0, maxWpm: 0 });
  const [accuracyStats, setAccuracyStats] = useState({
    totalKeystrokes: 0,
    backspaceCount: 0
  });
  const [essayEval, setEssayEval] = useState(null);
  const [isCustomTopic, setIsCustomTopic] = useState(() => {
    const saved = localStorage.getItem('isCustomTopic');
    return saved === 'true';
  });
  const [customTopic, setCustomTopic] = useState(() => {
    const saved = localStorage.getItem('customTopic');
    return saved || '';
  });
  const [customInstructions, setCustomInstructions] = useState(() => {
    const saved = localStorage.getItem('customInstructions');
    return saved || '';
  });
  const [highFreqWords, setHighFreqWords] = useState([]);
  const [nlWords, setNLWords] = useState([]);
  const [flash, setFlash] = useState(false);
  const timerRef = useRef();
  const clustrRef = useRef(null);

  // Add new state for previous results
  const [previousResults, setPreviousResults] = useState(() => {
    const saved = localStorage.getItem('previousResults');
    return saved ? JSON.parse(saved) : [];
  });

  // Add new state for current result
  const [currentResult, setCurrentResult] = useState(() => {
    const saved = localStorage.getItem('currentResult');
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    localStorage.setItem('selectedIssueIdx', selectedIssueIdx.toString());
  }, [selectedIssueIdx]);

  useEffect(() => {
    localStorage.setItem('selectedThemes', JSON.stringify(selectedThemes));
  }, [selectedThemes]);

  useEffect(() => {
    localStorage.setItem('essayResponse', response);
  }, [response]);

  useEffect(() => {
    localStorage.setItem('duration', duration.toString());
  }, [duration]);

  useEffect(() => {
    localStorage.setItem('timeLeft', timeLeft.toString());
  }, [timeLeft]);

  useEffect(() => {
    localStorage.setItem('isRunning', isRunning.toString());
  }, [isRunning]);

  useEffect(() => {
    localStorage.setItem('isCustomTopic', isCustomTopic.toString());
  }, [isCustomTopic]);

  useEffect(() => {
    localStorage.setItem('customTopic', customTopic);
  }, [customTopic]);

  useEffect(() => {
    localStorage.setItem('customInstructions', customInstructions);
  }, [customInstructions]);

  const clearLocalStorage = () => {
    localStorage.removeItem('essayResponse');
    localStorage.removeItem('timeLeft');
    localStorage.removeItem('isRunning');
  };

  useEffect(() => {
    // Debugging function to log fetch errors
    const logFetchError = (source, error) => {
      console.error(`Fetch Error (${source}):`, error);

      // More detailed error logging
      if (error instanceof TypeError) {
        console.error('Network Error Details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
      } else if (error instanceof Error) {
        console.error('Error Details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
      }
    };

    // Fetch issues with enhanced error handling
    const fetchIssues = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/greIssues.json`);

        // Check for network errors
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
        }

        const data = await response.json();

        // Validate data structure
        if (!data || typeof data !== 'object') {
          console.error('Invalid data structure:', data);
          setIssuesByTheme({});
          setAllIssues([]);
          return;
        }

        // Ensure data is processed even if some themes are empty
        const processedData = Object.fromEntries(
          Object.entries(data).filter(([theme, issues]) => Array.isArray(issues) && issues.length > 0)
        );

        console.log('Processed Issues by Theme:', processedData);
        setIssuesByTheme(processedData);

        // Flatten issues with theme information
        const flattenedIssues = Object.entries(processedData).flatMap(([theme, themeIssues]) =>
          themeIssues.map(issue => ({ ...issue, theme }))
        );

        console.log('Flattened Issues:', flattenedIssues);
        setAllIssues(flattenedIssues);
      } catch (error) {
        logFetchError('greIssues.json', error);

        // Provide a fallback or default state
        setIssuesByTheme({});
        setAllIssues([]);

        // Optional: Show user-friendly error message
        alert('Failed to load essay topics. Please check your connection and try again.');
      }
    };

    // Fetch wordlist with enhanced error handling
    const fetchWordlist = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/wordlist.json`);

        // Check for network errors
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
        }

        const data = await response.json();

        // Validate data structure
        if (!data || typeof data !== 'object') {
          console.error('Invalid wordlist structure:', data);
          setHighFreqWords([]);
          setNLWords([]);
          return;
        }

        console.log('Wordlist data:', data);
        setHighFreqWords(data.HF || []);
        setNLWords(data.NL || []);
      } catch (error) {
        logFetchError('wordlist.json', error);

        // Provide a fallback or default state
        setHighFreqWords([]);
        setNLWords([]);

        // Optional: Show user-friendly error message
        alert('Failed to load word lists. Some features may be limited.');
      }
    };

    // Fetch both resources
    fetchIssues();
    fetchWordlist();
  }, []);
  // Modify theme selection to ensure proper filtering
  const allThemes = Object.keys(issuesByTheme || {});
  const filteredIssues = (allIssues || []).filter(
    issue =>
      (selectedThemes.length === 0 || selectedThemes.includes(issue.theme)) &&
      (searchQuery === '' ||
        (issue.theme || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (issue.prompt || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Add console logs for debugging
  console.log('All Themes:', allThemes);
  console.log('Selected Themes:', selectedThemes);
  console.log('Filtered Issues:', filteredIssues);
  console.log('Search Query:', searchQuery);

  // Fallback for selected issue
  const selectedIssue = filteredIssues.length > 0
    ? filteredIssues[Math.min(selectedIssueIdx, filteredIssues.length - 1)]
    : {
      theme: 'No Topics Available',
      prompt: 'Please check your internet connection or reload the page.',
      instructions: 'Unable to load essay topics.'
    };
  // Timer and stats logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      // Flash logic: if timer > 60s and timeLeft <= 60, start flashing
      if (duration > 60 && timeLeft <= 60) {
        setFlash(f => !f);
      } else {
        setFlash(false);
      }
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

    setStats(prevStats => ({
      wpm,
      words,
      maxWpm: Math.max(prevStats.maxWpm || 0, wpm)
    }));
  }, [response, isRunning, timeLeft, duration]);

  // Accuracy tracking
  const handleResponseChange = (e) => {
    if (!isRunning) return;

    const newResponse = e.target.value;
    const currentKeystrokes = newResponse.length;
    const isBackspace = newResponse.length < response.length;

    const updatedAccuracyStats = {
      totalKeystrokes: currentKeystrokes,
      backspaceCount: isBackspace
        ? accuracyStats.backspaceCount + 1
        : accuracyStats.backspaceCount
    };

    // Calculate live accuracy
    const liveAccuracy = currentKeystrokes > 0
      ? Math.max(0, Math.round(
        ((currentKeystrokes - updatedAccuracyStats.backspaceCount) / currentKeystrokes) * 100
      ))
      : 100;

    setAccuracyStats(updatedAccuracyStats);
    setResponse(newResponse);
  };
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
    clearLocalStorage();
    setResponse('');
    setStats({ wpm: 0, words: 0, maxWpm: 0 });
    setTimeLeft(duration);
    setIsRunning(true);
    setShowResult(false);
    setFinalStats(null);
  };
  const calculateAccuracy = () => {
    const { totalKeystrokes, backspaceCount } = accuracyStats;
    if (totalKeystrokes === 0) return 100;

    // Calculate accuracy percentage
    const accuracy = Math.max(0, Math.round(
      ((totalKeystrokes - backspaceCount) / totalKeystrokes) * 100
    ));

    return accuracy;
  };
  const stopTest = (manual = false) => {
    if (manual) {
      if (!window.confirm('Are you sure you want to submit your essay?')) return;
    }
    clearLocalStorage();
    setIsRunning(false);
    setShowResult(true);

    // Calculate final accuracy
    const finalAccuracy = calculateAccuracy();
    const finalStatsWithAccuracy = {
      ...stats,
      accuracy: finalAccuracy,
      backspaceCount: accuracyStats.backspaceCount,
      totalKeystrokes: accuracyStats.totalKeystrokes
    };
    setFinalStats(finalStatsWithAccuracy);

    const prompt = isCustomTopic ? customTopic : selectedIssue.prompt;
    const evaluation = evaluateEssay(response, prompt, highFreqWords, nlWords);
    setEssayEval(evaluation);

    // Create result object
    const result = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      prompt,
      response,
      stats: finalStatsWithAccuracy,
      evaluation,
      isCustomTopic,
      instructions: isCustomTopic ? customInstructions : selectedIssue?.instructions
    };

    // Save current result
    setCurrentResult(result);

    // Add to previous results
    setPreviousResults(prev => [result, ...prev]);
  };
  const handleDurationChange = e => {
    const mins = parseInt(e.target.value, 10);
    setDuration(mins * 60);
    setTimeLeft(mins * 60);
  };
  const handleDownload = async (result) => {
    // If result is the stats object from current test, convert it to full result object
    if (result.wpm && result.words) {
      result = currentResult;
    }

    const topic = result.isCustomTopic ? result.customTopic : result.prompt;
    const instructions = result.isCustomTopic ? result.customInstructions : result.instructions;
    const essayText = result.response;
    const { wpm, words, timeLeft } = result.stats || {}; // Get final stats
    const timeTaken = duration - (timeLeft || 0); // Calculate time taken

    // Validate essay content
    if (!topic || !essayText || essayText.trim().length === 0) {
      alert('Cannot download empty essay or missing topic.');
      return;
    }

    const fileContent = `Topic:\n${topic}\n\nInstructions:\n${instructions || 'N/A'}\n\n---\n\nEssay:\n${essayText}`;

    // Example using docx and file-saver:
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: 'Topic:', bold: true }),
            ],
          }),
          new Paragraph({ text: topic }),
          new Paragraph({
            children: [
              new TextRun({ text: '\nInstructions:', bold: true }),
            ],
          }),
          new Paragraph({ text: instructions || 'N/A' }),
          new Paragraph({
            children: [
              new TextRun({ text: '\n---\n\nEssay:', bold: true }),
            ],
          }),
          ...essayText.split(/\n\s*\n/).map(para => new Paragraph({ text: para.trim() })),
          new Paragraph({ text: '\n---\n' }), // Separator
          new Paragraph({
            children: [
              new TextRun({ text: 'Stats:', bold: true }),
            ],
          }),
          new Paragraph({ text: `Typing Speed = ${wpm || 'N/A'} WPM` }),
          new Paragraph({ text: `Words Typed: ${words || 'N/A'}` }),
          new Paragraph({ text: `Time Taken: ${formatTime(timeTaken)}` }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'GRE_Essay_Practice.docx');
  };

  // Add new useEffect for saving results
  useEffect(() => {
    localStorage.setItem('previousResults', JSON.stringify(previousResults));
  }, [previousResults]);

  useEffect(() => {
    localStorage.setItem('currentResult', JSON.stringify(currentResult));
  }, [currentResult]);

  // Add function to clear history
  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all previous results?')) {
      setPreviousResults([]);
      localStorage.removeItem('previousResults');
    }
  };

  // Add function to delete specific result
  const deleteResult = (id) => {
    setPreviousResults(prev => prev.filter(result => result.id !== id));
  };

  const openResultModal = (result) => {
    setSelectedResult(result);
  };

  const closeResultModal = () => {
    setSelectedResult(null);
  };

  return (
    <Container>
      <Title>ScoreWise Essay Practice</Title>
      <InfoNote>
        <b>Note:</b><br />
        - The topic will be displayed after pressing the <b>Start Test</b> button, as per GRE rules.<br />
        - You can choose between predefined ScoreWise topics or write on a custom topic.<br />
        - For custom topics, you can specify your own prompt and instructions.
      </InfoNote>

      <div style={{ marginBottom: '1.5rem' }}>
        <Button
          onClick={() => setIsCustomTopic(!isCustomTopic)}
          style={{ marginRight: '1rem' }}
        >
          {isCustomTopic ? 'Use ScoreWise Topics' : 'Use Custom Topic'}
        </Button>
      </div>

      {isCustomTopic ? (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Your Topic/Prompt:
            </label>
            <WritingArea
              value={customTopic}
              onChange={e => setCustomTopic(e.target.value)}
              placeholder="Enter your custom topic or prompt here..."
              style={{ minHeight: '100px', marginBottom: '1rem' }}
              disabled={isRunning}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Instructions (optional):
            </label>
            <WritingArea
              value={customInstructions}
              onChange={e => setCustomInstructions(e.target.value)}
              placeholder="Enter any specific instructions for your topic..."
              style={{ minHeight: '80px' }}
              disabled={isRunning}
            />
          </div>
        </div>
      ) : (
        <>
          <ThemeCheckboxGroup>
            {allThemes.sort().map(theme => (
              <ThemeCheckboxLabel key={theme}>
                <Checkbox
                  type="checkbox"
                  checked={selectedThemes.includes(theme)}
                  onChange={() => {
                    setSelectedThemes(prev =>
                      prev.includes(theme)
                        ? prev.filter(t => t !== theme)
                        : [...prev, theme]
                    );
                    setSelectedIssueIdx(0); // Reset issue selection
                  }}
                  disabled={isRunning}
                />
                {theme} ({issuesByTheme[theme].length} issues)
              </ThemeCheckboxLabel>
            ))}
          </ThemeCheckboxGroup>
          {selectedThemes.length > 0 && (
            <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: ({ theme }) => theme.text }}>
              Selected Themes: {selectedThemes.join(', ')}
            </div>
          )}
          <div style={{ marginBottom: '1rem' }}>
            <Button type="button" $red onClick={handleClearThemes} disabled={isRunning}>Clear Themes</Button>
            <Button type="button" onClick={handleRandomise} disabled={isRunning}>Randomise</Button>
          </div>
          <ControlsRow>
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
          </ControlsRow>
        </>
      )}

      <select
        value={duration / 60}
        onChange={handleDurationChange}
        disabled={isRunning}
        style={{ padding: '0.5rem 1rem', borderRadius: 4, border: `1px solid ${defaultTheme.border}`, fontSize: '1rem', backgroundColor: defaultTheme.surface, color: defaultTheme.text }}
      >
        <option value={30}>30 minutes</option>
        <option value={60}>60 minutes</option>
      </select>

      <InfoNote>
        To start a new paragraph in your essay, please use double enters (press Enter twice).
      </InfoNote>

      <TimeDisplay style={flash ? {
        background: timeLeft % 2 === 0 ? defaultTheme.surface : defaultTheme.error,
        color: timeLeft % 2 === 0 ? defaultTheme.error : defaultTheme.surface,
        transition: 'background 0.3s, color 0.3s'
      } : {}}>
        Time Remaining: {formatTime(timeLeft)}
      </TimeDisplay>

      {isRunning && (
        <IssueCard>
          <h2>{isCustomTopic ? 'Custom Topic' : selectedIssue.theme}</h2>
          <IssuePrompt>
            {isCustomTopic ? customTopic : selectedIssue.prompt}
          </IssuePrompt>
          <IssueInstructions>
            <b>Instructions:</b> {isCustomTopic ? customInstructions || 'Write a well-reasoned response to the given topic.' : selectedIssue.instructions}
          </IssueInstructions>
        </IssueCard>
      )}

      <WritingArea
        value={response}
        onChange={handleResponseChange}
        placeholder={isRunning ? 'Start writing your response here...' : 'Click Start Test to begin'}
        disabled={!isRunning}
        spellCheck={false}
      />

      <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
        {!isRunning ? (
          <Button
            $green
            onClick={startTest}
            disabled={isCustomTopic && !customTopic.trim()}
          >
            Start Test
          </Button>
        ) : (
          <Button $green onClick={() => stopTest(true)}>Stop Test</Button>
        )}
      </div>

      <StatsRow>
        <Stat>WPM<br /><b>{stats.wpm}</b></Stat>
        <Stat>Max WPM<br /><b>{stats.maxWpm || 0}</b></Stat>
        <Stat>Accuracy<br /><b>{accuracyStats.totalKeystrokes > 0
          ? Math.max(0, Math.round(
            ((accuracyStats.totalKeystrokes - accuracyStats.backspaceCount) / accuracyStats.totalKeystrokes) * 100
          ))
          : 100}%</b></Stat>
        <Stat>Words<br /><b>{stats.words}</b></Stat>
        <Stat>Time<br /><b>{formatTime(timeLeft)}</b></Stat>
      </StatsRow>

      {showResult && finalStats && (
        <ResultBox>
          <h2>Test Complete!</h2>
          <p><b>WPM:</b> {finalStats.wpm}</p>
          <p><b>Max WPM:</b> {finalStats.maxWpm || 0}</p>
          <p><b>Words Typed:</b> {finalStats.words}</p>
          <p><b>Accuracy:</b> {finalStats.accuracy}%</p>
          <p><b>Backspace Count:</b> {finalStats.backspaceCount}</p>
          <p><b>Total Keystrokes:</b> {finalStats.totalKeystrokes}</p>
          {essayEval && (
            <>
              <hr style={{ margin: '1em 0', borderColor: ({ theme }) => theme.border }} />
              <h3>Essay Evaluation</h3>
              <p><b>Final Score:</b> <span style={{ fontSize: '1.3em', color: ({ theme }) => theme.primary }}>{essayEval.finalScore} / 6</span></p>

              <h4>Content Analysis:</h4>
              <ul style={{ textAlign: 'left', margin: '0.5em 0', color: ({ theme }) => theme.text }}>
                <li>Topic Relevance: {essayEval.breakdown.topicRelevance}/2</li>
                <li>Argument Quality: {essayEval.breakdown.argumentQuality}/2</li>
                <li>Word Count: {essayEval.metrics.wordCount} words ({essayEval.breakdown.wordCount}/1)</li>
                <li>Structure: {essayEval.breakdown.structure}/1</li>
                <li>NLP Style: {essayEval.nlpScore.toFixed(1)}/6</li>
              </ul>

              <h4>Vocabulary Insights:</h4>
              <ul style={{ textAlign: 'left', margin: '0.5em 0', color: ({ theme }) => theme.text }}>
                <li>High-Frequency Words Used: {essayEval.metrics.highFreqCount}</li>
                <li>NL Words Used: {essayEval.metrics.usedNLWords.length}</li>
                <li>Vocabulary Diversity: {essayEval.metrics.vocabDiversity}%</li>
                <li>Long Words ({'>'}7 letters): {essayEval.metrics.longWords}</li>
                <li>Unique Long Words: {essayEval.metrics.uniqueLongWords}</li>
                <li>Average Sentence Length: {essayEval.metrics.avgSentenceLength} words</li>
              </ul>

              <h4>Topic Analysis:</h4>
              <ul style={{ textAlign: 'left', margin: '0.5em 0', color: ({ theme }) => theme.text }}>
                <li>Directly Addresses Prompt: {essayEval.topicAnalysis.directAddress ? '✅' : '❌'}</li>
                <li>Clear Position Stated: {essayEval.topicAnalysis.hasPosition ? '✅' : '❌'}</li>
                <li>Prompt Terms Used: {essayEval.topicAnalysis.promptTermUsage}</li>
              </ul>

              <h4>Argument Analysis:</h4>
              <ul style={{ textAlign: 'left', margin: '0.5em 0', color: ({ theme }) => theme.text }}>
                <li>Examples Provided: {essayEval.argumentAnalysis.hasExamples ? '✅' : '❌'}</li>
                <li>Reasoning Included: {essayEval.argumentAnalysis.hasReasoning ? '✅' : '❌'}</li>
                <li>Counter-Arguments: {essayEval.argumentAnalysis.hasCounterArguments ? '✅' : '❌'}</li>
                <li>Conclusion Present: {essayEval.argumentAnalysis.conclusionPresent ? '✅' : '❌'}</li>
              </ul>

              <h4>Improvement Suggestions:</h4>
              <ul style={{ textAlign: 'left', margin: '0.5em 0', color: ({ theme }) => theme.text }}>
                {!essayEval.topicAnalysis.directAddress &&
                  <li>⚠️ Make sure to directly address the prompt in your introduction</li>}
                {!essayEval.topicAnalysis.hasPosition &&
                  <li>⚠️ Clearly state your position on the issue</li>}
                {!essayEval.argumentAnalysis.hasExamples &&
                  <li>⚠️ Include specific examples to support your arguments</li>}
                {!essayEval.argumentAnalysis.hasCounterArguments &&
                  <li>⚠️ Consider addressing counter-arguments to strengthen your position</li>}
                {essayEval.metrics.wordCount < 300 &&
                  <li>⚠️ Aim for at least 300 words to fully develop your argument</li>}
              </ul>

              <small style={{ opacity: 0.7, color: ({ theme }) => theme.text }}>
                <b>Note:</b> This is an automated evaluation using a simple model checking basic linguistic features and structure. It is not a substitute for human evaluation and should not be used to predict your actual GRE score. Focus on the breakdown and suggestions for improvement.
              </small>

              <div style={{ marginTop: '1.5rem' }}>
                <Button onClick={() => handleDownload(currentResult)} $green>Download Essay (.docx)</Button>
              </div>
            </>
          )}

          <PreviousResultsContainer>
            <ResultsHeader>
              <h3>Previous Essay Results</h3>
              <Button $red onClick={clearHistory}>Clear History</Button>
            </ResultsHeader>

            <InfoBox>
              <b>Note:</b> Your essay results are stored in your browser's local storage.
              They will persist until you clear your browser data or manually clear the history.
              Results are specific to this browser and device.
            </InfoBox>

            <ResultsList>
              {previousResults.length === 0 ? (
                <p style={{ fontStyle: 'italic', opacity: 0.7, color: ({ theme }) => theme.text }}>No previous results</p>
              ) : (
                previousResults.map((result) => (
                  <ResultItem key={result.id}>
                    <ResultInfo>
                      <ResultDate>{result.date}</ResultDate>
                      <ResultTopic>{result.prompt.slice(0, 100)}...</ResultTopic>
                    </ResultInfo>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button onClick={() => openResultModal(result)}>View Result</Button>
                      <Button $red onClick={() => deleteResult(result.id)}>Delete</Button>
                    </div>
                  </ResultItem>
                ))
              )}
            </ResultsList>
          </PreviousResultsContainer>

          {selectedResult && (
            <Modal onClick={closeResultModal}>
              <ModalContent onClick={e => e.stopPropagation()}>
                <CloseButton onClick={closeResultModal}>&times;</CloseButton>

                <ModalSection>
                  <h2>Essay Result</h2>
                  <ResultDate>{selectedResult.date}</ResultDate>
                </ModalSection>

                <ModalSection>
                  <h3>Topic</h3>
                  <p>{selectedResult.prompt}</p>
                  {selectedResult.instructions && (
                    <>
                      <h4>Instructions</h4>
                      <p>{selectedResult.instructions}</p>
                    </>
                  )}
                </ModalSection>

                <ModalSection>
                  <h3>Score: {selectedResult.evaluation.finalScore} / 6</h3>
                  <StatGrid>
                    <div>
                      <h4>Content Analysis</h4>
                      <ul>
                        <li>
                          <span>Topic Relevance:</span>
                          <span>{selectedResult.evaluation.breakdown.topicRelevance}/2</span>
                        </li>
                        <li>
                          <span>Argument Quality:</span>
                          <span>{selectedResult.evaluation.breakdown.argumentQuality}/2</span>
                        </li>
                        <li>
                          <span>Structure:</span>
                          <span>{selectedResult.evaluation.breakdown.structure}/1</span>
                        </li>
                        <li>
                          <span>NLP Style:</span>
                          <span>{selectedResult.evaluation.nlpScore.toFixed(1)}/6</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4>Statistics</h4>
                      <ul>
                        <li>
                          <span>Words:</span>
                          <span>{selectedResult.stats.words}</span>
                        </li>
                        <li>
                          <span>WPM:</span>
                          <span>{selectedResult.stats.wpm}</span>
                        </li>
                        <li>
                          <span>Max WPM:</span>
                          <span>{selectedResult.stats.maxWpm || 'N/A'}</span>
                        </li>
                        <li>
                          <span>Accuracy:</span>
                          <span>{selectedResult.stats.accuracy || 'N/A'}%</span>
                        </li>
                        <li>
                          <span>Backspace Count:</span>
                          <span>{selectedResult.stats.backspaceCount || 'N/A'}</span>
                        </li>
                        <li>
                          <span>Vocabulary Diversity:</span>
                          <span>{selectedResult.evaluation.metrics.vocabDiversity}%</span>
                        </li>
                        <li>
                          <span>Paragraphs:</span>
                          <span>{selectedResult.evaluation.metrics.paragraphs}</span>
                        </li>
                      </ul>
                    </div>
                  </StatGrid>
                </ModalSection>

                <ModalSection>
                  <h3>Essay</h3>
                  <EssayText>
                    {selectedResult.response}
                  </EssayText>
                </ModalSection>

                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                  <Button $green onClick={() => handleDownload(selectedResult)}>
                    Download Essay (.docx)
                  </Button>
                </div>
              </ModalContent>
            </Modal>
          )}
        </ResultBox>
      )}
    </Container>
  );
};

export default GREWriting; 