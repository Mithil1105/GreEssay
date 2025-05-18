import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';

const Container = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
  @media (max-width: 600px) {
    padding: 0 0.5rem;
    margin: 1rem 0;
  }
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
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
  @media (max-width: 600px) {
    font-size: 1rem;
    min-height: 80px;
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
  border: 2px solid #28a745;
  border-radius: 8px;
  padding: 2rem;
  margin: 2rem 0;
  text-align: center;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text};
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

const sampleTexts = [
  `The cat sat on the mat near the window, watching the birds outside. The sun was shining brightly, and the sky was a clear, happy blue. A little boy ran across the wide, green field with a red kite trailing behind him. He laughed with joy as the wind picked up, helping the kite soar higher and higher. Birds chirped in the tall trees nearby, adding music to the warm day. Flowers of yellow, pink, and purple bloomed in the garden, dancing in the breeze.\n\nIt was a perfect day to be outdoors. The boy's dog barked excitedly, chasing him across the grass. The soft grass tickled their feet and paws. Butterflies fluttered from one flower to the next. Clouds floated slowly in the sky like cotton candy. Everything around them felt calm, simple, and full of life.\n\nThey stopped to rest under a big tree, where the shade cooled them down. The boy took out a small sandwich and gave his dog a treat. Birds kept singing, and the kite swayed gently in the breeze above them. Days like these are special because they remind us of the little things that make us smile—sunshine, fresh air, and time with a good friend.`,
  `On a breezy Saturday afternoon, Clara wandered through the bustling local farmers market, a canvas bag slung over her shoulder. The vibrant scents of fresh herbs, citrus fruits, and blooming flowers filled the air. Each vendor stall displayed a rainbow of colors—red strawberries, golden peaches, green leafy kale, and multicolored peppers. The sounds of soft chatter, laughter, and acoustic guitar mixed together, forming a pleasant hum that felt like the heartbeat of the town.\n\nClara paused to admire a musician playing violin beneath a striped canopy. Children danced nearby, their faces sticky from melting popsicles. She picked up a bunch of lavender and held it to her nose, inhaling its calming fragrance. Further down, she sampled local honey and warm sourdough slices.\n\nThe market was more than a place to shop; it was a place of stories. An old couple sold handmade soaps wrapped in twine, and a young artist painted tiny landscapes on seashells. Everywhere, there was life: messy, honest, and beautiful. Clara paid for her items, smiled at a vendor, and made her way home with a heart lighter than her bag.`,
  `Amidst the persistent hum of the urban sprawl, Evelyn craved a pocket of calm. She found it in the local library, a timeless refuge untouched by the frenzy outside. The heavy oak doors creaked as she entered, stepping into a world of silence and scent—dusty parchment, old leather bindings, and subtle hints of coffee from the study nook.\n\nTowering shelves held books like monuments of forgotten worlds. She passed rows of ancient texts: faded atlases, medieval treatises, and philosophical volumes with brittle pages. She chose a volume on Byzantine iconoclasm and another on quantum paradoxes. Settling into a wooden chair, she opened the first and felt time dissolve.\n\nThunder rumbled faintly outside, but inside, the world was still. The library lights buzzed overhead, indifferent to the layers of thought unfolding in her mind. She highlighted sentences, scribbled notes in the margins, and underlined questions that only led to more questions.\n\nHere, Evelyn wasn't escaping reality—she was exploring its depth. In a space where silence screamed and stillness moved, she discovered the exhilarating beauty of intellectual pursuit.`,
  `In examining the collision between epistemological skepticism and deterministic frameworks within quantum mechanics, one confronts a duality that transcends classical interpretation. The observer paradox, exemplified in Schrödinger's thought experiment, posits not merely a conundrum of outcomes but a restructuring of perception itself.\n\nIs the cat both alive and dead, or are our measurement limitations the true variable? Quantum entanglement defies locality, while Heisenberg's uncertainty principle disintegrates our grip on predictability. Such theories challenge not only the boundaries of science but the scaffolding of cognition.\n\nLanguage, in its current syntactical form, buckles under the weight of these concepts. Terms like "wavefunction collapse" and "probabilistic reality" demand semiotic reinterpretation. As discourse enters a meta-theoretical space, words become fractals—each sentence a recursion of paradox and possibility.\n\nTyping such reflections is not simply an exercise in finger dexterity but in cognitive elasticity. One must navigate a jungle of abstractions, weaving together linguistic constructs, mathematical metaphors, and philosophical provocations. It is here that clarity must emerge from chaos—a true test not of grammar, but of thought itself.`
];

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const TypingTest = () => {
  const [duration, setDuration] = useState(30); // in seconds, default to 30 seconds
  const [timeLeft, setTimeLeft] = useState(30); // in seconds, default to 30 seconds
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
  const clustrRef = useRef(null);
  const [flash, setFlash] = useState(false);

  // Get the text to type
  const promptText = useCustom ? customText : sampleTexts[selectedSampleIdx];

  // Live stats
  const [stats, setStats] = useState({ wpm: 0, accuracy: 100, words: 0, mistakes: 0 });

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

  useEffect(() => {
    // Dynamically inject ClustrMaps script
    if (clustrRef.current) {
      const prev = document.getElementById('clustrmaps');
      if (prev) prev.remove();
      const script = document.createElement('script');
      script.id = 'clustrmaps';
      script.type = 'text/javascript';
      script.src = '//clustrmaps.com/map_v2.js?d=AYG_JMwPCNULF1JiGcb1M92oLMUck1L-32YGpkdm1FM';
      clustrRef.current.appendChild(script);
    }
  }, []);

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
    <>
      <Container>
        <Title>Typing Speed Test</Title>
        <InfoNote>
          <b>Note:</b><br />
          - Select the time duration and choose a sample text or enter your own custom text.<br />
          - You can toggle <b>Hard Mode</b> to hide character-by-character feedback.<br />
          - Press <b>Start Test</b> to begin.<br />
          - Your typing statistics (WPM, accuracy, words, mistakes) will be shown live as you type.<br />
          - The test can be stopped at any time, and your results will be displayed at the end.<br />
          - <b>Hard Mode:</b> Hides character highlighting and feedback as you type.
        </InfoNote>
        <ControlsRow>
          <Select value={duration} onChange={e => { setDuration(Number(e.target.value)); setTimeLeft(Number(e.target.value)); }} disabled={isRunning}>
            <option value={30}>30 seconds</option>
            <option value={60}>1 minute</option>
            <option value={120}>2 minutes</option>
            <option value={300}>5 minutes</option>
            <option value={600}>10 minutes</option>
            <option value={1200}>20 minutes</option>
            <option value={1800}>30 minutes</option>
            <option value={2700}>45 minutes</option>
            <option value={3600}>60 minutes</option>
          </Select>
          <Select value={selectedSampleIdx} onChange={handleSampleChange} disabled={isRunning || useCustom}>
            <option value={0}>Level 1 – Easy (Beginner Typing)</option>
            <option value={1}>Level 2 – Medium</option>
            <option value={2}>Level 3 – Hard</option>
            <option value={3}>Level 4 – Extreme</option>
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
        <TimeDisplay style={flash ? { background: timeLeft % 2 === 0 ? '#fff' : '#dc3545', color: timeLeft % 2 === 0 ? '#dc3545' : '#fff', transition: 'background 0.3s, color 0.3s' } : {}}>
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
      <Footer>
        <div style={{ marginBottom: '0.5rem' }}>
          <b>ScoreWise</b> &copy; {new Date().getFullYear()}<br />
          Built and developed by Mithil Mistry
        </div>
        <div ref={clustrRef} style={{ margin: '0.5rem auto', width: 80, height: 40, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
        <noscript>
          <a href="http://www.clustrmaps.com/map/Mithilmistry.tech" title="Visit tracker for Mithilmistry.tech">
            <img src="//www.clustrmaps.com/map_v2.png?d=AYG_JMwPCNULF1JiGcb1M92oLMUck1L-32YGpkdm1FM" alt="ClustrMaps" style={{ width: 80, height: 40, objectFit: 'contain' }} />
          </a>
        </noscript>
      </Footer>
    </>
  );
};

export default TypingTest; 