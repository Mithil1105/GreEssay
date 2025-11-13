import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { defaultTheme } from '../themes';

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
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
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
  cursor: pointer;
  &:hover {
    background-color: ${({ theme, $green, $red }) => $red ? theme.error + 'E6' : $green ? theme.success + 'E6' : theme.secondary};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TimeDisplay = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
  color: ${({ theme }) => theme.text};
`;

const QuestionCard = styled.div`
  padding: 2rem 2rem 1.5rem 2rem;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  margin-bottom: 2rem;
  border: 1px solid ${({ theme }) => theme.border};
  font-size: 1.08rem;
`;

const QuestionPrompt = styled.div`
  font-size: 1.18rem;
  font-weight: 600;
  margin-bottom: 1.1rem;
  color: ${({ theme }) => theme.text};
`;

const QuestionImage = styled.img`
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  margin: 1rem 0;
  border: 1px solid ${({ theme }) => theme.border};
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
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
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

const SetupSection = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: ${({ theme }) => theme.background};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const SetupLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const SetupTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 0.7rem;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  line-height: 1.6;
  resize: vertical;
  margin-bottom: 1rem;
  transition: ${({ theme }) => theme.transition};
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const FileInput = styled.input`
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text};
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

export default function IELTSWritingPage() {
  const [questionText, setQuestionText] = useState(() => {
    const saved = localStorage.getItem('ieltsQuestion');
    return saved || '';
  });
  const [questionImage, setQuestionImage] = useState(() => {
    const saved = localStorage.getItem('ieltsQuestionImage');
    return saved || null;
  });
  const [answer, setAnswer] = useState(() => {
    const saved = localStorage.getItem('ieltsAnswer');
    return saved || '';
  });
  const [task, setTask] = useState(() => {
    const saved = localStorage.getItem('ieltsTask');
    return saved || 'task1';
  });
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem('ieltsTimeLeft');
    return saved ? parseInt(saved, 10) : 20 * 60;
  });
  const [timerRunning, setTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWPM] = useState(0);
  const [maxWpm, setMaxWpm] = useState(0);
  const [words, setWords] = useState(0);
  const [accuracyStats, setAccuracyStats] = useState({
    totalKeystrokes: 0,
    backspaceCount: 0
  });
  const [showResult, setShowResult] = useState(false);
  const [finalStats, setFinalStats] = useState(null);
  const [previousResults, setPreviousResults] = useState(() => {
    const saved = localStorage.getItem('ieltsPreviousResults');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentResult, setCurrentResult] = useState(() => {
    const saved = localStorage.getItem('ieltsCurrentResult');
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedResult, setSelectedResult] = useState(null);
  const timerRef = useRef(null);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('ieltsQuestion', questionText);
  }, [questionText]);

  useEffect(() => {
    if (questionImage) {
      localStorage.setItem('ieltsQuestionImage', questionImage);
    }
  }, [questionImage]);

  useEffect(() => {
    localStorage.setItem('ieltsAnswer', answer);
  }, [answer]);

  useEffect(() => {
    localStorage.setItem('ieltsTask', task);
  }, [task]);

  useEffect(() => {
    localStorage.setItem('ieltsTimeLeft', timeLeft.toString());
  }, [timeLeft]);

  useEffect(() => {
    localStorage.setItem('ieltsPreviousResults', JSON.stringify(previousResults));
  }, [previousResults]);

  useEffect(() => {
    localStorage.setItem('ieltsCurrentResult', JSON.stringify(currentResult));
  }, [currentResult]);

  // WPM calculator - updates live as user types
  useEffect(() => {
    if (!timerRunning) {
      const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
      setWords(wordCount);
      return;
    }
    
    if (!startTime) return;
    
    const elapsed = Date.now() - startTime;
    const minutes = elapsed / 60000;
    const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
    const currentWpm = minutes > 0 ? Math.floor(wordCount / minutes) : 0;
    
    setWPM(currentWpm);
    setMaxWpm(prev => Math.max(prev, currentWpm));
    setWords(wordCount);
  }, [answer, timerRunning, startTime]);

  const handleAnswerChange = (e) => {
    if (!timerRunning) return;
    const newAnswer = e.target.value;
    const isBackspace = newAnswer.length < answer.length;
    const currentKeystrokes = newAnswer.length;
    
    setAccuracyStats(prev => ({
      totalKeystrokes: currentKeystrokes,
      backspaceCount: isBackspace ? prev.backspaceCount + 1 : prev.backspaceCount
    }));
    setAnswer(newAnswer);
  };

  const calculateAccuracy = () => {
    const { totalKeystrokes, backspaceCount } = accuracyStats;
    if (totalKeystrokes === 0) return 100;
    return Math.max(0, Math.round(
      ((totalKeystrokes - backspaceCount) / totalKeystrokes) * 100
    ));
  };

  const startTest = () => {
    if (!questionText.trim() && !questionImage) {
      alert('Please enter a question or upload an image before starting the test.');
      return;
    }
    setAnswer('');
    setAccuracyStats({ totalKeystrokes: 0, backspaceCount: 0 });
    setWPM(0);
    setMaxWpm(0);
    setWords(0);
    setShowResult(false);
    setFinalStats(null);
    setTimerRunning(true);
    setStartTime(Date.now());
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimerRunning(false);
          // Auto-stop test when time runs out
          setTimeout(() => {
            stopTest(false);
          }, 100);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTest = (manual = true) => {
    if (manual && !window.confirm('Are you sure you want to stop the test?')) return;
    clearInterval(timerRef.current);
    setTimerRunning(false);
    setShowResult(true);

    // Calculate final accuracy
    const finalAccuracy = calculateAccuracy();
    const finalStatsWithAccuracy = {
      wpm,
      maxWpm,
      words,
      accuracy: finalAccuracy,
      backspaceCount: accuracyStats.backspaceCount,
      totalKeystrokes: accuracyStats.totalKeystrokes,
      timeLeft
    };
    setFinalStats(finalStatsWithAccuracy);

    // Create result object
    const result = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      task: task === 'task1' ? 'Task 1' : 'Task 2',
      question: questionText,
      questionImage: questionImage,
      answer: answer,
      stats: finalStatsWithAccuracy
    };

    // Save current result
    setCurrentResult(result);

    // Add to previous results
    setPreviousResults(prev => [result, ...prev]);
    setStartTime(null);

    // Clear image and question after saving result
    setQuestionImage(null);
    setQuestionText('');
    localStorage.removeItem('ieltsQuestionImage');
    localStorage.removeItem('ieltsQuestion');
  };

  const handleTaskChange = (e) => {
    const newTask = e.target.value;
    setTask(newTask);
    setTimeLeft(newTask === 'task1' ? 20 * 60 : 40 * 60);
    setTimerRunning(false);
    clearInterval(timerRef.current);
    setStartTime(null);
    setWPM(0);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`IELTS Writing - ${task === 'task1' ? 'Task 1' : 'Task 2'}`, 10, 10);
    
    let yPos = 20;
    if (questionText) {
      doc.text('Question:', 10, yPos);
      yPos += 7;
      const questionLines = doc.splitTextToSize(questionText, 180);
      doc.text(questionLines, 10, yPos);
      yPos += questionLines.length * 7 + 5;
    }
    
    doc.text('Answer:', 10, yPos);
    yPos += 7;
    const answerLines = doc.splitTextToSize(answer, 180);
    doc.text(answerLines, 10, yPos);
    
    doc.save('ielts-writing.pdf');
  };

  const handleDownload = async (result) => {
    // If result is the stats object from current test, convert it to full result object
    if (result.wpm && result.words && !result.id) {
      result = currentResult;
    }

    if (!result) {
      alert('No result to download.');
      return;
    }

    const taskName = result.task || (task === 'task1' ? 'Task 1' : 'Task 2');
    const question = result.question || questionText;
    const essayText = result.answer || answer;
    const { wpm, words, timeLeft: resultTimeLeft, accuracy } = result.stats || {};
    const initialTime = result.task === 'Task 1' ? 20 * 60 : 40 * 60;
    const timeTaken = initialTime - (resultTimeLeft || 0);

    // Validate essay content
    if (!essayText || essayText.trim().length === 0) {
      alert('Cannot download empty essay.');
      return;
    }

    // Create Word document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: `IELTS Writing - ${taskName}`, bold: true, size: 28 }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Question:', bold: true }),
            ],
          }),
          new Paragraph({ text: question || 'N/A' }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({ text: '---', bold: true }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Answer:', bold: true }),
            ],
          }),
          ...essayText.split(/\n\s*\n/).map(para => new Paragraph({ text: para.trim() })),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({ text: '---', bold: true }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Statistics:', bold: true }),
            ],
          }),
          new Paragraph({ text: `Typing Speed = ${wpm || 'N/A'} WPM` }),
          new Paragraph({ text: `Max WPM = ${result.stats?.maxWpm || 'N/A'}` }),
          new Paragraph({ text: `Words Typed: ${words || 'N/A'}` }),
          new Paragraph({ text: `Accuracy: ${accuracy || 'N/A'}%` }),
          new Paragraph({ text: `Time Taken: ${formatTime(timeTaken)}` }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `IELTS_Writing_${taskName.replace(' ', '_')}.docx`);
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all previous results?')) {
      setPreviousResults([]);
      localStorage.removeItem('ieltsPreviousResults');
    }
  };

  const deleteResult = (id) => {
    setPreviousResults(prev => prev.filter(result => result.id !== id));
  };

  const openResultModal = (result) => {
    setSelectedResult(result);
  };

  const closeResultModal = () => {
    setSelectedResult(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setQuestionImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setQuestionImage(null);
    localStorage.removeItem('ieltsQuestionImage');
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <Container>
      <Title>IELTS Writing Practice</Title>

      {!timerRunning && (
        <SetupSection>
          <SetupLabel>Question (optional - enter before starting test):</SetupLabel>
          <SetupTextarea
            placeholder="Enter IELTS question..."
            value={questionText}
            onChange={e => setQuestionText(e.target.value)}
          />

          <SetupLabel>Upload Image (optional):</SetupLabel>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
            <FileInput 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
            />
            {questionImage && (
              <Button $red onClick={removeImage} style={{ margin: 0 }}>
                Remove Image
              </Button>
            )}
          </div>
          {questionImage && (
            <QuestionImage src={questionImage} alt="Question Preview" style={{ marginBottom: '1rem' }} />
          )}
        </SetupSection>
      )}

      <Select
        value={task === 'task1' ? 20 : 40}
        onChange={e => {
          const duration = parseInt(e.target.value, 10);
          handleTaskChange({ target: { value: duration === 20 ? 'task1' : 'task2' } });
        }}
        disabled={timerRunning}
        style={{ 
          padding: '0.5rem 1rem', 
          borderRadius: 4, 
          border: `1px solid ${defaultTheme.border}`, 
          fontSize: '1rem', 
          backgroundColor: defaultTheme.surface, 
          color: defaultTheme.text,
          marginBottom: '1rem'
        }}
      >
        <option value={20}>Task 1 (20 minutes)</option>
        <option value={40}>Task 2 (40 minutes)</option>
      </Select>

      <InfoNote>
        To start a new paragraph in your essay, please use double enters (press Enter twice).
      </InfoNote>

      <TimeDisplay>
        Time Remaining: {formatTime(timeLeft)}
      </TimeDisplay>

      {timerRunning && (questionText || questionImage) && (
        <QuestionCard>
          <QuestionPrompt>
            {questionText || 'Question Image'}
          </QuestionPrompt>
          {questionImage && (
            <QuestionImage src={questionImage} alt="Question" />
          )}
        </QuestionCard>
      )}

      <WritingArea
        value={answer}
        onChange={handleAnswerChange}
        placeholder={timerRunning ? 'Start writing your answer here...' : 'Click Start Test to begin'}
        disabled={!timerRunning}
        spellCheck={false}
      />

      <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
        {!timerRunning ? (
          <Button
            $green
            onClick={startTest}
            disabled={!questionText.trim() && !questionImage}
          >
            Start Test
          </Button>
        ) : (
          <Button $green onClick={stopTest}>
            Stop Test
          </Button>
        )}
      </div>

      <StatsRow>
        <Stat>WPM<br /><b>{wpm}</b></Stat>
        <Stat>Max WPM<br /><b>{maxWpm || 0}</b></Stat>
        <Stat>Accuracy<br /><b>{accuracyStats.totalKeystrokes > 0
          ? calculateAccuracy()
          : 100}%</b></Stat>
        <Stat>Words<br /><b>{words}</b></Stat>
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

          <div style={{ marginTop: '1.5rem' }}>
            <Button onClick={() => handleDownload(currentResult)} $green>Download Essay (.docx)</Button>
          </div>

          <PreviousResultsContainer>
            <ResultsHeader>
              <h3>Previous IELTS Writing Results</h3>
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
                      <ResultTopic>{result.task}: {result.question ? result.question.slice(0, 80) : 'Image Question'}...</ResultTopic>
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
                  <h2>IELTS Writing Result</h2>
                  <ResultDate>{selectedResult.date}</ResultDate>
                </ModalSection>

                <ModalSection>
                  <h3>Task: {selectedResult.task}</h3>
                  <h4>Question</h4>
                  <p>{selectedResult.question || 'Image Question'}</p>
                  {selectedResult.questionImage && (
                    <QuestionImage src={selectedResult.questionImage} alt="Question" style={{ marginTop: '1rem' }} />
                  )}
                </ModalSection>

                <ModalSection>
                  <h3>Statistics</h3>
                  <StatGrid>
                    <div>
                      <h4>Performance</h4>
                      <ul>
                        <li>
                          <span>Words:</span>
                          <span>{selectedResult.stats?.words || 'N/A'}</span>
                        </li>
                        <li>
                          <span>WPM:</span>
                          <span>{selectedResult.stats?.wpm || 'N/A'}</span>
                        </li>
                        <li>
                          <span>Max WPM:</span>
                          <span>{selectedResult.stats?.maxWpm || 'N/A'}</span>
                        </li>
                        <li>
                          <span>Accuracy:</span>
                          <span>{selectedResult.stats?.accuracy || 'N/A'}%</span>
                        </li>
                        <li>
                          <span>Backspace Count:</span>
                          <span>{selectedResult.stats?.backspaceCount || 'N/A'}</span>
                        </li>
                        <li>
                          <span>Total Keystrokes:</span>
                          <span>{selectedResult.stats?.totalKeystrokes || 'N/A'}</span>
                        </li>
                      </ul>
                    </div>
                  </StatGrid>
                </ModalSection>

                <ModalSection>
                  <h3>Answer</h3>
                  <EssayText>
                    {selectedResult.answer}
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

      {!timerRunning && !showResult && answer.trim() && (
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Button onClick={exportPDF}>
            Export as PDF
          </Button>
        </div>
      )}
    </Container>
  );
}
