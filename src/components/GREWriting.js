import React, { useState, useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

// Add this near the top of the file, after the imports
const defaultTheme = {
  border: '#dee2e6',
  surface: '#ffffff',
  text: '#333333',
  primary: '#007bff',
  secondary: '#6c757d',
  background: '#f8f9fa',
  body: '#ffffff',
  shadow: '0 2px 4px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease'
};

const Container = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
  background-color: ${({ theme = defaultTheme }) => theme.body};
  @media (max-width: 600px) {
    padding: 0 0.5rem;
    margin: 1rem 0;
  }
`;
const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${({ theme = defaultTheme }) => theme.text};
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
  background-color: ${({ theme = defaultTheme }) => theme.body};
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
`;
const Select = styled.select`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid ${({ theme = defaultTheme }) => theme.border};
  background-color: ${({ theme = defaultTheme }) => theme.surface};
  color: ${({ theme = defaultTheme }) => theme.text};
  font-size: 1rem;
  cursor: pointer;
  transition: ${({ theme = defaultTheme }) => theme.transition};
  &:focus { outline: none; border-color: ${({ theme = defaultTheme }) => theme.primary}; }
`;
const Button = styled.button`
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  background-color: ${({ theme = defaultTheme, $green, $red }) => $red ? '#dc3545' : $green ? '#28a745' : theme.primary};
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  transition: background 0.2s;
  &:hover { background-color: ${({ theme = defaultTheme, $green, $red }) => $red ? '#b52a37' : $green ? '#218838' : theme.secondary}; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;
const TimeDisplay = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
  ${({ style }) => style && css`
    ${Object.entries(style).map(([key, value]) => css`${key}: ${value};`)}
  `}
`;
const IssueCard = styled.div`
  padding: 2rem 2rem 1.5rem 2rem;
  border-radius: 8px;
  background-color: ${({ theme = defaultTheme }) => theme.surface};
  box-shadow: ${({ theme = defaultTheme }) => theme.shadow};
  margin-bottom: 2rem;
  border: 1px solid ${({ theme = defaultTheme }) => theme.border};
  font-size: 1.08rem;
`;
const IssuePrompt = styled.div`
  font-size: 1.18rem;
  font-weight: 600;
  margin-bottom: 1.1rem;
  color: ${({ theme = defaultTheme }) => theme.text};
`;
const IssueInstructions = styled.div`
  font-size: 1.04rem;
  color: ${({ theme = defaultTheme }) => theme.text};
  background: ${({ theme = defaultTheme }) => theme.background};
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
  border: 1px solid ${({ theme = defaultTheme }) => theme.border};
  background-color: ${({ theme = defaultTheme }) => theme.surface};
  color: ${({ theme = defaultTheme }) => theme.text};
  font-size: 1.1rem;
  line-height: 1.6;
  resize: vertical;
  overflow-y: auto;
  transition: ${({ theme = defaultTheme }) => theme.transition};
  &:focus { outline: none; border-color: ${({ theme = defaultTheme }) => theme.primary}; }
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
  background: ${({ theme = defaultTheme }) => theme.background};
  border-radius: 6px;
  padding: 0.7rem 1.2rem;
  min-width: 110px;
  text-align: center;
  border: 1px solid ${({ theme = defaultTheme }) => theme.border};
  @media (max-width: 600px) {
    min-width: 80px;
    padding: 0.5rem 0.7rem;
  }
`;
const ResultBox = styled.div`
  background: ${({ theme = defaultTheme }) => theme.surface};
  border: 2px solid #28a745;
  border-radius: 8px;
  padding: 2rem;
  margin: 2rem 0;
  text-align: center;
  font-size: 1.2rem;
  color: ${({ theme = defaultTheme }) => theme.text};
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
  background: ${({ theme = defaultTheme }) => theme.surface};
  color: ${({ theme = defaultTheme }) => theme.text};
  border: 1px solid ${({ theme = defaultTheme }) => theme.border};
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
  background: ${({ theme = defaultTheme }) => theme.surface};
  border: 1px solid ${({ theme = defaultTheme }) => theme.border};
  border-radius: 6px;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`;
const DropdownSearch = styled.input`
  width: 100%;
  padding: 0.5rem 1rem;
  border: none;
  border-bottom: 1px solid ${({ theme = defaultTheme }) => theme.border};
  background: ${({ theme = defaultTheme }) => theme.surface};
  color: ${({ theme = defaultTheme }) => theme.text};
  font-size: 1rem;
  &:focus { outline: none; }
`;
const DropdownItem = styled.div`
  padding: 0.7rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid ${({ theme = defaultTheme }) => theme.border};
  background: ${({ selected, theme = defaultTheme }) => selected ? theme.primary : 'inherit'};
  color: ${({ selected, theme = defaultTheme }) => selected ? '#fff' : theme.text};
  &:hover { background: ${({ theme = defaultTheme }) => theme.background}; }
  font-size: 0.98rem;
`;
const InfoNote = styled.div`
  background: ${({ theme = defaultTheme }) => theme.background};
  color: ${({ theme = defaultTheme }) => theme.text};
  border-left: 4px solid #17a2b8;
  padding: 0.7rem 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  font-style: italic;
  opacity: 0.85;
`;
const Footer = styled.footer`
  width: 100%;
  background: #23272f;
  color: #fff;
  text-align: center;
  padding: 1.2rem 0 1rem 0;
  margin-top: 2.5rem;
  font-size: 1.08rem;
  letter-spacing: 0.01em;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.07);
  @media (max-width: 600px) {
    font-size: 0.95rem;
    padding: 0.7rem 0 0.5rem 0;
    margin-top: 1.2rem;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const PreviousResultsContainer = styled.div`
  margin-top: 2rem;
  border-top: 2px solid ${({ theme = defaultTheme }) => theme.border};
  padding-top: 1rem;
  background: ${({ theme = defaultTheme }) => theme.surface};
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
  background: ${({ theme = defaultTheme }) => theme.background};
  border: 1px solid ${({ theme = defaultTheme }) => theme.border};
  transition: ${({ theme = defaultTheme }) => theme.transition};

  &:hover {
    box-shadow: ${({ theme = defaultTheme }) => theme.shadow};
  }
`;

const ResultInfo = styled.div`
  flex: 1;
`;

const ResultDate = styled.div`
  font-size: 0.9rem;
  color: ${({ theme = defaultTheme }) => theme.secondary};
  margin-bottom: 0.5rem;
`;

const ResultTopic = styled.div`
  font-weight: 500;
  color: ${({ theme = defaultTheme }) => theme.text};
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
  animation: ${fadeIn} 0.2s ease-out;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: ${({ theme = defaultTheme }) => theme.surface};
  padding: 2rem;
  border-radius: 12px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  color: ${({ theme = defaultTheme }) => theme.text};

  h2, h3, h4 {
    color: ${({ theme = defaultTheme }) => theme.text};
    margin-bottom: 1rem;
  }

  p {
    color: ${({ theme = defaultTheme }) => theme.text};
    line-height: 1.6;
  }
`;

const EssayText = styled.div`
  white-space: pre-wrap;
  background: ${({ theme = defaultTheme }) => theme.background};
  color: ${({ theme = defaultTheme }) => theme.text};
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid ${({ theme = defaultTheme }) => theme.border};
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
    color: ${({ theme = defaultTheme }) => theme.text};
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    background: ${({ theme = defaultTheme }) => theme.background};
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
  color: ${({ theme = defaultTheme }) => theme.text};
  opacity: 0.7;
  transition: opacity 0.2s;
  &:hover { opacity: 1; }
`;

const ModalSection = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme = defaultTheme }) => theme.border};
  &:last-child { border-bottom: none; }
`;

const InfoBox = styled.div`
  background: ${({ theme = defaultTheme }) => theme.background};
  border-left: 4px solid ${({ theme = defaultTheme }) => theme.primary};
  padding: 1rem;
  margin: 1rem 0;
  font-size: 0.9rem;
  color: ${({ theme = defaultTheme }) => theme.text};
`;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
function evaluateEssay(text, prompt, highFreqWords = [], nlWords = []) {
  console.log('Evaluating essay with:');
  console.log('HF words available:', highFreqWords);
  console.log('NL words available:', nlWords);

  // --- Basic text analysis ---
  const wordList = text.trim().split(/\s+/).filter(Boolean);
  console.log('Essay words:', wordList);
  const wordCount = wordList.length;
  const uniqueWords = new Set(wordList.map(w => w.toLowerCase())).size;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.length ? (wordCount / sentences.length).toFixed(1) : 0;
  const paragraphsArr = text.split(/\n{2,}/).filter(p => p.trim().length > 0);
  const paragraphCount = paragraphsArr.length;

  // --- High Frequency Word Count ---
  const highFreqWordSet = new Set(highFreqWords.map(word => word.toLowerCase()));
  let highFreqCount = 0;
  const essayWordSet = new Set(wordList.map(word => word.toLowerCase()));
  console.log('Essay word set:', Array.from(essayWordSet));
  console.log('HF word set:', Array.from(highFreqWordSet));

  essayWordSet.forEach(word => {
    if (highFreqWordSet.has(word)) {
      highFreqCount++;
      console.log('Found HF word:', word);
    }
  });

  // --- NL Words Analysis ---
  const nlWordSet = new Set(nlWords.map(word => word.toLowerCase()));
  const usedNLWords = [];
  console.log('NL word set:', Array.from(nlWordSet));

  essayWordSet.forEach(word => {
    if (nlWordSet.has(word)) {
      usedNLWords.push(word);
      console.log('Found NL word:', word);
    }
  });

  // --- Vocabulary Analysis ---
  const longWords = wordList.filter(w => w.length > 7).length;
  const uniqueLongWords = new Set(wordList.filter(w => w.length > 7).map(w => w.toLowerCase())).size;
  const vocabDiversity = (uniqueWords / wordCount * 100).toFixed(1);

  // --- Structure detection ---
  const introParagraph = paragraphCount > 0 ? paragraphsArr[0] : '';
  const conclusionParagraph = paragraphCount > 1 ? paragraphsArr[paragraphCount - 1] : '';

  const hasPotentialIntro = introParagraph.split(/\s+/).length > 30;
  const hasPotentialConclusion = conclusionParagraph.split(/\s+/).length > 30 && paragraphCount > 2;

  // --- Position/Thesis detection ---
  const thesisPatterns = [
    /i\s+(agree|disagree|believe|think|contend|maintain|assert|hold)\s+that/i,
    /(my|this|the)\s+(view|opinion|stance|position|argument)\s+is/i,
    /it\s+is\s+(clear|evident|important|necessary|vital|essential)\s+that/i,
    /this\s+essay\s+(argues|contends|will\s+show|will\s+demonstrate|will\s+discuss)/i,
    /i\s+will\s+(argue|show|demonstrate|explain)/i,
    /the\s+(issue|statement|claim|argument)\s+should\s+be/i,
    /my\s+position\s+is/i
  ];
  const introText = paragraphsArr.slice(0, Math.min(2, paragraphCount)).join(' ');
  const hasThesis = thesisPatterns.some(pat => pat.test(introText)) || (introText.match(/should|must|important|necessary|vital|essential|crucial|paramount/i) && introText.split(/\s+/).length > 40);

  // --- Topic relevance (semantic overlap) ---
  const promptTerms = (prompt.toLowerCase().match(/\b\w+\b/g) || []).filter(w => w.length > 3 && isNaN(w));
  const essayTerms = new Set(wordList.map(w => w.toLowerCase()));
  const overlap = promptTerms.filter(t => essayTerms.has(t)).length;
  const overlapRatio = promptTerms.length ? overlap / promptTerms.length : 0;
  const topicScore = overlapRatio > 0.5 ? 1.5 : overlapRatio > 0.3 ? 1 : overlapRatio > 0.1 ? 0.5 : 0; // Adjusted thresholds and max score
  const directPromptReference = introText.toLowerCase().includes(prompt.toLowerCase().slice(0, Math.min(prompt.length, 80)));
  const paraphraseBonus = (overlapRatio > 0.3 && hasPotentialIntro) || directPromptReference ? 0.5 : 0;

  // --- Argument quality ---
  const examplePatterns = [/for example/i, /for instance/i, /such as/i, /consider(?:ing)?\s+the\s+case/i, /take\s+the\s+(?:case|example)/i, /(?:as\s+is|this\s+is)\s+evident\s+in/i, /illustrates/i];
  const reasoningPatterns = [/because/i, /since/i, /therefore/i, /as a result/i, /thus/i, /so that/i, /consequently/i, /hence/i, /due to/i, /this\s+shows/i, /this\s+suggests/i, /which\s+indicates/i, /this\s+demonstrates/i];
  const counterPatterns = [/however/i, /on the other hand/i, /nevertheless/i, /nonetheless/i, /alternatively/i, /by contrast/i, /in contrast/i, /while\s+it\s+is\s+true\s+that/i, /some\s+may\s+argue/i, /critics\s+contend/i];
  const hasExample = examplePatterns.some(pat => pat.test(text));
  const hasReasoning = reasoningPatterns.some(pat => pat.test(text));
  const hasCounter = counterPatterns.some(pat => pat.test(text));

  const bodyParagraphs = paragraphCount - (hasPotentialIntro ? 1 : 0) - (hasPotentialConclusion ? 1 : 0);
  const meaningfulBodyParagraphs = paragraphsArr.slice(hasPotentialIntro ? 1 : 0, paragraphCount - (hasPotentialConclusion ? 1 : 0)).filter(p => p.split(/\s+/).length > 50).length;

  const argumentScore = (meaningfulBodyParagraphs >= 2 ? 1 : meaningfulBodyParagraphs >= 1 ? 0.5 : 0) + // Increased body paragraph weight
    (hasExample ? 0.5 : 0) +
    (hasReasoning ? 0.5 : 0) +
    (hasCounter ? 0.5 : 0);

  // --- Word count (softer) ---
  let wordCountScore = 0;
  if (wordCount >= 550) wordCountScore = 1; // Slightly increased target for full points
  else if (wordCount >= 450) wordCountScore = 0.9;
  else if (wordCount >= 350) wordCountScore = 0.75;
  else if (wordCount >= 250) wordCountScore = 0.5;
  else if (wordCount >= 150) wordCountScore = 0.25;

  // --- Structure score ---
  let structureScore = 0;
  if (hasPotentialIntro) structureScore += 0.5; // Increased intro weight
  if (hasPotentialConclusion) structureScore += 0.5; // Increased conclusion weight
  if (paragraphCount >= 4 && meaningfulBodyParagraphs >= 2) structureScore += 0.5; // Bonus for clear multi-paragraph structure

  // --- Raw score (Content + Structure, out of ~7.5) ---
  // Topic (1.5 + 0.5) + Argument (2.5) + Word count (1) + Structure (1.5) = 7
  // Bonus: Thesis (0.5)

  let rawScore = topicScore + paraphraseBonus + argumentScore + wordCountScore + structureScore;

  if (hasThesis) rawScore += 0.5;

  // --- NLP/Style analysis (out of 6) ---
  // Components: Vocabulary, Sentence Variety, Coherence/Transitions

  // Vocabulary Score (out of 2)
  const vocabScore = Math.min(2, (uniqueWords / wordCount * 10) + (wordList.filter(w => w.length > 7).length / wordCount * 10)); // Unique words + longer words

  // Sentence Variety Score (out of 2) - Simplified heuristic
  // Look at variance in sentence length and presence of longer sentences
  const sentenceLengths = sentences.map(s => s.split(/\s+/).filter(Boolean).length);
  const avgLen = sentenceLengths.reduce((sum, len) => sum + len, 0) / sentenceLengths.length;
  const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgLen, 2), 0) / sentenceLengths.length;
  const stdDev = Math.sqrt(variance);
  const hasLongSentences = sentenceLengths.some(len => len > 30);

  let sentenceVarietyScore = 0;
  if (stdDev > 8) sentenceVarietyScore += 1;
  if (avgLen > 18) sentenceVarietyScore += 0.5; // Reward slightly longer average
  if (hasLongSentences) sentenceVarietyScore += 0.5;
  sentenceVarietyScore = Math.min(2, sentenceVarietyScore);

  // Coherence/Transitions Score (out of 2)
  const transitions = ['firstly', 'secondly', 'in contrast', 'on the other hand', 'for example', 'moreover', 'however', 'furthermore', 'therefore', 'in addition', 'consequently', 'thus', 'in conclusion', 'for this reason', 'in summary', 'to conclude'];
  const strongTransitions = transitions.filter(t => text.toLowerCase().includes(t)).length;
  const coherenceScore = Math.min(2, strongTransitions * 0.2 + (paragraphCount > 1 ? (strongTransitions / paragraphCount) * 0.5 : 0)); // Reward transitions and transitions per paragraph

  const totalNlpScore = Math.min(6, vocabScore + sentenceVarietyScore + coherenceScore);

  // --- Final score (weighted and scaled to 6) ---
  // Raw score is now out of a potential ~7.5
  // Final Score = (Raw Score / 7.5 * 6) * 0.9 + (NLP Score / 6 * 6) * 0.1
  // Simplified: Final Score = (Raw Score * 0.9) + (NLP Score * 0.1) - then scale to 6

  const weightedRaw = rawScore * 0.9;
  const weightedNlp = totalNlpScore * 0.1;
  const combinedScore = weightedRaw + weightedNlp; // This is out of ~ (7.5*0.9 + 6*0.1) = 6.75 + 0.6 = 7.35

  // Scale the combined score to be out of 6
  const finalScore = Math.round((combinedScore / 7.35) * 6 * 10) / 10; // Scale based on max potential combined score

  const clampedScore = Math.max(1, Math.min(6, finalScore));

  return {
    finalScore: clampedScore,
    rawScore, // Keep raw score for debugging
    nlpScore: totalNlpScore, // NLP score out of 6
    breakdown: {
      topicRelevance: topicScore + paraphraseBonus,
      argumentQuality: argumentScore,
      wordCount: wordCountScore,
      structure: structureScore,
      nlpStyle: totalNlpScore // Include NLP in breakdown out of 6
    },
    topicAnalysis: {
      directAddress: overlapRatio > 0.3,
      hasPosition: hasThesis,
      promptTermUsage: overlap
    },
    argumentAnalysis: {
      hasExamples: hasExample,
      hasReasoning: hasReasoning,
      hasCounterArguments: hasCounter,
      conclusionPresent: hasPotentialConclusion
    },
    metrics: {
      wordCount,
      uniqueWords,
      avgSentenceLength,
      paragraphs: paragraphCount,
      highFreqCount,
      usedNLWords,
      longWords,
      uniqueLongWords,
      vocabDiversity
    },
    calculation: {
      weightedRaw: weightedRaw.toFixed(2),
      weightedNlp: weightedNlp.toFixed(2),
      combinedScore: combinedScore.toFixed(2),
      scalingFactor: (6 / 7.35).toFixed(2) // Show scaling factor used
    }
  };
}
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
    <>
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
              <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
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
          style={{ padding: '0.5rem 1rem', borderRadius: 4, border: '1px solid #ccc', fontSize: '1rem' }}
        >
          <option value={30}>30 minutes</option>
          <option value={60}>60 minutes</option>
        </select>

        <InfoNote>
          To start a new paragraph in your essay, please use double enters (press Enter twice).
        </InfoNote>

        <TimeDisplay style={flash ? { background: timeLeft % 2 === 0 ? '#fff' : '#dc3545', color: timeLeft % 2 === 0 ? '#dc3545' : '#fff', transition: 'background 0.3s, color 0.3s' } : {}}>
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
          <Stat>Words<br /><b>{stats.words}</b></Stat>
          <Stat>Accuracy<br /><b>{accuracyStats.totalKeystrokes > 0
            ? Math.max(0, Math.round(
              ((accuracyStats.totalKeystrokes - accuracyStats.backspaceCount) / accuracyStats.totalKeystrokes) * 100
            ))
            : 100}%</b></Stat>
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
                <hr style={{ margin: '1em 0' }} />
                <h3>Essay Evaluation</h3>
                <p><b>Final Score:</b> <span style={{ fontSize: '1.3em' }}>{essayEval.finalScore} / 6</span></p>

                <h4>Content Analysis:</h4>
                <ul style={{ textAlign: 'left', margin: '0.5em 0' }}>
                  <li>Topic Relevance: {essayEval.breakdown.topicRelevance}/2</li>
                  <li>Argument Quality: {essayEval.breakdown.argumentQuality}/2</li>
                  <li>Word Count: {essayEval.metrics.wordCount} words ({essayEval.breakdown.wordCount}/1)</li>
                  <li>Structure: {essayEval.breakdown.structure}/1</li>
                  <li>NLP Style: {essayEval.nlpScore.toFixed(1)}/6</li>
                </ul>

                <h4>Vocabulary Insights:</h4>
                <ul style={{ textAlign: 'left', margin: '0.5em 0' }}>
                  <li>High-Frequency Words Used: {essayEval.metrics.highFreqCount}</li>
                  <li>NL Words Used: {essayEval.metrics.usedNLWords.length}</li>
                  <li>Vocabulary Diversity: {essayEval.metrics.vocabDiversity}%</li>
                  <li>Long Words ({'>'}7 letters): {essayEval.metrics.longWords}</li>
                  <li>Unique Long Words: {essayEval.metrics.uniqueLongWords}</li>
                  <li>Average Sentence Length: {essayEval.metrics.avgSentenceLength} words</li>
                </ul>

                <h4>Topic Analysis:</h4>
                <ul style={{ textAlign: 'left', margin: '0.5em 0' }}>
                  <li>Directly Addresses Prompt: {essayEval.topicAnalysis.directAddress ? '✅' : '❌'}</li>
                  <li>Clear Position Stated: {essayEval.topicAnalysis.hasPosition ? '✅' : '❌'}</li>
                  <li>Prompt Terms Used: {essayEval.topicAnalysis.promptTermUsage}</li>
                </ul>

                <h4>Argument Analysis:</h4>
                <ul style={{ textAlign: 'left', margin: '0.5em 0' }}>
                  <li>Examples Provided: {essayEval.argumentAnalysis.hasExamples ? '✅' : '❌'}</li>
                  <li>Reasoning Included: {essayEval.argumentAnalysis.hasReasoning ? '✅' : '❌'}</li>
                  <li>Counter-Arguments: {essayEval.argumentAnalysis.hasCounterArguments ? '✅' : '❌'}</li>
                  <li>Conclusion Present: {essayEval.argumentAnalysis.conclusionPresent ? '✅' : '❌'}</li>
                </ul>

                <h4>Improvement Suggestions:</h4>
                <ul style={{ textAlign: 'left', margin: '0.5em 0' }}>
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

                <small style={{ opacity: 0.7 }}>
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
                  <p style={{ fontStyle: 'italic', opacity: 0.7 }}>No previous results</p>
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
      <Footer style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: 60 }}>
          <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', width: '100%', pointerEvents: 'none' }}>
            <b>ScoreWise</b> &copy; {new Date().getFullYear()}<br />
            Built and developed by Mithil Mistry & Hasti Vakani
          </span>
          <div style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)' }}>
            <a href="mailto:Mithil20056mistry@gmail.com" title="Contact Us: Mithil20056mistry@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#FFDD00', color: '#23272f', borderRadius: '50%', width: 40, height: 40, fontWeight: 600, fontSize: '18px', textDecoration: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', transition: 'background 0.2s, color 0.2s' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="22,6 12,13 2,6" /></svg>
            </a>
          </div>
        </div>
        <div style={{ margin: '0.5rem auto', width: 80, height: 40, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <script id="clustrmaps" type="text/javascript" src="//clustrmaps.com/map_v2.js?d=AYG_JMwPCNULF1JiGcb1M92oLMUck1L-32YGpkdm1FM"></script>
        </div>
        <noscript>
          <a href="http://www.clustrmaps.com/map/Mithilmistry.tech" title="Visit tracker for Mithilmistry.tech">
            <img src="//www.clustrmaps.com/map_v2.png?d=AYG_JMwPCNULF1JiGcb1M92oLMUck1L-32YGpkdm1FM" alt="ClustrMaps" style={{ width: 80, height: 40, objectFit: 'contain' }} />
          </a>
        </noscript>
      </Footer>
    </>
  );
};
export default GREWriting; 