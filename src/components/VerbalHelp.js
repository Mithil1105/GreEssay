import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: none; }
`;

const Container = styled.div`
  max-width: 1300px;
  margin: 2.5rem auto 0 auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 1400px) {
    max-width: 98vw;
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

const ListDropdownContainer = styled.div`
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ListSelect = styled.select`
  padding: 0.7rem 1.2rem;
  border-radius: 8px;
  border: 1.5px solid #c4b5fd;
  background: #ede9fe;
  color: #3a2476;
  font-size: 1.08rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(124,58,237,0.04);
  transition: background 0.2s, border 0.2s;
  &:hover {
    background: #d1c4e9;
    border-color: #a78bfa;
  }
`;

const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  position: relative;
`;

const DropdownButton = styled.button`
  background: #ede9fe;
  color: #3a2476;
  border: 1.5px solid #c4b5fd;
  border-radius: 8px;
  padding: 0.7rem 1.3rem;
  font-size: 1.08rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 0.5rem;
  box-shadow: 0 1px 4px rgba(124,58,237,0.04);
  transition: background 0.2s, border 0.2s;
  &:hover {
    background: #d1c4e9;
    border-color: #a78bfa;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 110%;
  left: 0;
  background: #fff;
  border: 1.5px solid #c4b5fd;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(60,60,120,0.10);
  padding: 1rem 1.2rem;
  z-index: 10;
  min-width: 220px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 1.08rem;
  color: #3a2476;
  font-weight: 500;
  margin-bottom: 0.7rem;
  cursor: pointer;
  user-select: none;
`;

const Checkbox = styled.input`
  margin-right: 0.7em;
  accent-color: #7c3aed;
  width: 1.1em;
  height: 1.1em;
`;

const MainFlex = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  @media (max-width: 1200px) {
    gap: 0.7rem;
  }
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
`;

const Sidebar = styled.div`
  min-width: 320px;
  max-width: 340px;
  background: #f3f0ff;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(60,60,120,0.06);
  padding: 1.5rem 1.1rem 1.5rem 1.1rem;
  height: 700px;
  overflow-y: auto;
  font-size: 1.18rem;
  @media (max-width: 1200px) {
    min-width: 200px;
    max-width: 220px;
    height: 480px;
    font-size: 1.08rem;
  }
  @media (max-width: 900px) {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    height: auto;
    display: flex;
    flex-wrap: wrap;
    padding: 0.7rem 0.2rem;
    margin-bottom: 1rem;
    font-size: 1rem;
  }
`;

const SidebarWord = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.1rem;
  margin-bottom: 0.2rem;
  border-radius: 7px;
  font-size: 1.18rem;
  font-weight: 600;
  color: #3a2476;
  background: ${({ $active, $review }) =>
        $review ? '#ffeaea' : $active ? '#ede9fe' : 'transparent'};
  border: ${({ $active, $review }) =>
        $review ? '1.5px solid #e57373' : $active ? '1.5px solid #a78bfa' : '1.5px solid transparent'};
  cursor: pointer;
  transition: background 0.18s, border 0.18s;
  position: relative;
  line-height: 1.6;
  &:hover {
    background: ${({ $review }) => ($review ? '#ffd6d6' : '#ede9fe')};
  }
`;

const SidebarIcon = styled.span`
  margin-left: 0.5em;
  font-size: 1.22em;
  ${({ $review }) =>
        $review &&
        css`
      color: #e53935;
    `}
  ${({ $completed, $review }) =>
        $completed && !$review &&
        css`
      color: #28a745;
    `}
`;

const Card = styled.div`
  background: ${({ review }) => (review ? '#ffeaea' : '#f7f5ff')};
  border-radius: 32px;
  box-shadow: 0 8px 36px rgba(60, 60, 120, 0.13), 0 2px 8px rgba(60,60,120,0.09);
  padding: 3.5rem 3.5rem 2.7rem 3.5rem;
  margin: 2.2rem 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: 0;
  min-height: 480px;
  max-width: 950px;
  width: 100%;
  animation: ${fadeIn} 0.5s cubic-bezier(.4,1.2,.6,1) 1;
  border: ${({ review }) => (review ? '2.5px solid #e57373' : 'none')};
  font-size: 1.22rem;
  line-height: 1.8;
  @media (max-width: 1200px) {
    max-width: 700px;
    padding: 2.2rem 1.2rem 1.7rem 1.2rem;
    min-height: 340px;
    font-size: 1.08rem;
  }
  @media (max-width: 900px) {
    width: 100%;
    margin: 0.5rem 0 0 0;
    font-size: 1rem;
  }
  @media (max-width: 600px) {
    padding: 1.3rem 0.7rem 1.3rem 0.7rem;
    min-height: 220px;
    font-size: 0.98rem;
  }
`;

const Word = styled.h2`
  font-size: 2.8rem;
  font-weight: 900;
  color: #3a2476;
  margin-bottom: 1.2rem;
  text-align: center;
  letter-spacing: 0.01em;
  font-family: 'Fira Sans', 'Segoe UI', Arial, sans-serif;
`;

const MeaningSection = styled.div`
  background: #ede9fe;
  border-left: 7px solid #7c3aed;
  border-radius: 10px;
  padding: 1.2rem 1.3rem 1.2rem 1.7rem;
  margin-bottom: 2.1rem;
  box-shadow: 0 1px 4px rgba(124,58,237,0.04);
`;

const MeaningLabel = styled.div`
  font-size: 1.13rem;
  font-weight: 700;
  color: #7c3aed;
  margin-bottom: 0.3rem;
  letter-spacing: 0.01em;
`;

const MeaningText = styled.div`
  font-size: 1.45rem;
  color: #18122b;
  font-weight: 500;
  line-height: 1.7;
  font-family: 'Fira Sans', 'Segoe UI', Arial, sans-serif;
`;

const Divider = styled.hr`
  border: none;
  border-top: 2.5px solid #e3dff7;
  margin: 1.7rem 0 1.3rem 0;
`;

const Example = styled.div`
  background: #f3f0ff;
  border-radius: 10px;
  padding: 1.2rem 1.3rem;
  margin-bottom: 1.2rem;
  box-shadow: 0 1px 4px rgba(60,60,120,0.04);
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
`;

const ExampleIcon = styled.span`
  font-size: 1.5rem;
  margin-right: 0.5rem;
  flex-shrink: 0;
  margin-top: 2px;
`;

const ExampleContent = styled.div`
  flex: 1;
`;

const ExampleTitle = styled.div`
  font-size: 1.13rem;
  font-weight: 700;
  color: #6d28d9;
  margin-bottom: 0.4rem;
  letter-spacing: 0.01em;
`;

const ExampleText = styled.div`
  font-size: 1.18rem;
  color: #23223a;
  line-height: 1.7;
  font-family: 'Fira Sans', 'Segoe UI', Arial, sans-serif;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.3rem;
  margin-top: 2.3rem;
`;

const Button = styled.button`
  padding: 1rem 2.2rem;
  border-radius: 8px;
  background-color: #7c3aed;
  color: #fff;
  font-size: 1.18rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 1px 4px rgba(124,58,237,0.09);
  font-family: 'Fira Sans', 'Segoe UI', Arial, sans-serif;
  &:hover {
    background-color: #5b21b6;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Progress = styled.div`
  text-align: center;
  margin-top: 1.4rem;
  font-size: 1.13rem;
  color: #3a2476;
  font-family: 'Fira Sans', 'Segoe UI', Arial, sans-serif;
`;

const exampleTypes = [
    { key: 'Modern Family Example', label: 'Modern Family', icon: '🏡' },
    { key: 'Friends Example', label: 'Friends', icon: '☕' },
    { key: 'Gilmore Girls Example', label: 'Gilmore Girls', icon: '🎓' },
    { key: 'Big Bang Theory Example', label: 'Big Bang Theory', icon: '🧪' },
];

const showIcons = {
    'Modern Family Example': '🏡',
    'Friends Example': '☕',
    'Gilmore Girls Example': '🎓',
    'Big Bang Theory Example': '🧪',
};

const VerbalHelp = () => {
    const [allLists, setAllLists] = useState({});
    const [selectedList, setSelectedList] = useState('List1');
    const [words, setWords] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedExamples, setSelectedExamples] = useState({
        'Modern Family Example': true,
        'Friends Example': true,
        'Gilmore Girls Example': true,
        'Big Bang Theory Example': true,
    });
    const [completedWords, setCompletedWords] = useState({});
    const [reviewWords, setReviewWords] = useState({});
    const [lastIndices, setLastIndices] = useState(() => {
        const saved = localStorage.getItem('verbalHelpLastIndices');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        const savedList = localStorage.getItem('verbalHelpLastList');
        const savedIndices = localStorage.getItem('verbalHelpLastIndices');
        const savedCompleted = localStorage.getItem('verbalHelpCompletedWords');
        const savedReview = localStorage.getItem('verbalHelpReviewWords');
        if (savedList) setSelectedList(savedList);
        if (savedIndices) setLastIndices(JSON.parse(savedIndices));
        if (savedCompleted) setCompletedWords(JSON.parse(savedCompleted));
        if (savedReview) setReviewWords(JSON.parse(savedReview));
    }, []);

    useEffect(() => {
        fetch('/Verbalhelp.json')
            .then(response => response.json())
            .then(data => setAllLists(data))
            .catch(error => console.error('Error loading words:', error));
    }, []);

    useEffect(() => {
        if (allLists[selectedList]) {
            setWords(allLists[selectedList]);
            setCurrentIndex(lastIndices[selectedList] || 0);
        }
    }, [selectedList, allLists]);

    useEffect(() => {
        localStorage.setItem('verbalHelpLastList', selectedList);
    }, [selectedList]);
    useEffect(() => {
        localStorage.setItem('verbalHelpLastIndex', currentIndex);
        setLastIndices(prev => {
            const updated = { ...prev, [selectedList]: currentIndex };
            localStorage.setItem('verbalHelpLastIndices', JSON.stringify(updated));
            return updated;
        });
    }, [currentIndex, selectedList]);
    useEffect(() => {
        localStorage.setItem('verbalHelpCompletedWords', JSON.stringify(completedWords));
    }, [completedWords]);
    useEffect(() => {
        localStorage.setItem('verbalHelpReviewWords', JSON.stringify(reviewWords));
    }, [reviewWords]);

    useEffect(() => {
        if (words.length && words[currentIndex]) {
            setCompletedWords(prev => {
                const key = `${selectedList}:${currentIndex}`;
                if (prev[key]) return prev;
                return { ...prev, [key]: true };
            });
        }
    }, [currentIndex, selectedList, words]);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + words.length) % words.length);
    };

    const handleCheckboxChange = (key) => {
        setSelectedExamples(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleListChange = (e) => {
        setSelectedList(e.target.value);
    };

    const handleSidebarClick = (idx) => {
        setCurrentIndex(idx);
    };

    const handleMarkForReview = () => {
        const key = `${selectedList}:${currentIndex}`;
        setReviewWords(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const currentWord = words[currentIndex];
    const reviewKey = `${selectedList}:${currentIndex}`;
    const isReview = !!reviewWords[reviewKey];

    if (!Object.keys(allLists).length) {
        return <Container>Loading...</Container>;
    }

    return (
        <>
            <Container>
                <Title>GRE Verbal Help</Title>
                <ListDropdownContainer>
                    <label htmlFor="list-select" style={{ fontWeight: 600, color: '#3a2476', fontSize: '1.08rem' }}>Select List:</label>
                    <ListSelect id="list-select" value={selectedList} onChange={handleListChange}>
                        {Object.keys(allLists).map((listKey, idx) => (
                            <option key={listKey} value={listKey}>List {idx + 1}</option>
                        ))}
                    </ListSelect>
                </ListDropdownContainer>
                <DropdownContainer>
                    <DropdownButton onClick={() => setDropdownOpen(open => !open)}>
                        Select Example Themes
                    </DropdownButton>
                    {dropdownOpen && (
                        <DropdownMenu>
                            {exampleTypes.map(({ key, label, icon }) => (
                                <CheckboxLabel key={key}>
                                    <Checkbox
                                        type="checkbox"
                                        checked={selectedExamples[key]}
                                        onChange={() => handleCheckboxChange(key)}
                                    />
                                    <span style={{ fontWeight: 600, marginRight: 6 }}>{icon}</span> {label}
                                </CheckboxLabel>
                            ))}
                        </DropdownMenu>
                    )}
                </DropdownContainer>
                <MainFlex>
                    <Sidebar>
                        {words.map((w, idx) => {
                            const key = `${selectedList}:${idx}`;
                            const review = !!reviewWords[key];
                            const completed = !!completedWords[key];
                            return (
                                <SidebarWord
                                    key={w.Word + idx}
                                    $active={idx === currentIndex}
                                    $completed={completed}
                                    $review={review}
                                    onClick={() => handleSidebarClick(idx)}
                                >
                                    {w.Word}
                                    {review ? (
                                        <SidebarIcon $review>🚩</SidebarIcon>
                                    ) : completed ? (
                                        <SidebarIcon $completed>✅</SidebarIcon>
                                    ) : null}
                                </SidebarWord>
                            );
                        })}
                    </Sidebar>
                    <Card review={isReview}>
                        {currentWord ? (
                            <>
                                <Word>{currentWord.Word}</Word>
                                <MeaningSection>
                                    <MeaningLabel>Meaning:</MeaningLabel>
                                    <MeaningText>{currentWord.Meaning}</MeaningText>
                                </MeaningSection>
                                <Divider />
                                {exampleTypes.map(({ key, label }) => (
                                    selectedExamples[key] && currentWord[key] ? (
                                        <Example key={key}>
                                            <ExampleIcon>{showIcons[key]}</ExampleIcon>
                                            <ExampleContent>
                                                <ExampleTitle>{label} Example:</ExampleTitle>
                                                <ExampleText>{currentWord[key]}</ExampleText>
                                            </ExampleContent>
                                        </Example>
                                    ) : null
                                ))}
                            </>
                        ) : (
                            <div>No words in this list.</div>
                        )}
                        <NavigationButtons>
                            <Button onClick={handlePrevious} disabled={currentIndex === 0}>
                                Previous
                            </Button>
                            <Button
                                style={{ background: isReview ? '#e57373' : '#fbbf24', color: isReview ? '#fff' : '#7c3aed', minWidth: 120 }}
                                onClick={handleMarkForReview}
                            >
                                {isReview ? 'Unmark Review' : 'Mark for Review'}
                            </Button>
                            <Button onClick={handleNext}>
                                Next
                            </Button>
                        </NavigationButtons>
                    </Card>
                </MainFlex>
                <Progress>
                    Card {currentIndex + 1} of {words.length}
                </Progress>
            </Container>
            <footer style={{ width: '100%', background: '#23272f', color: '#fff', textAlign: 'center', padding: '1.2rem 0 1rem 0', marginTop: '2.5rem', fontSize: '1.08rem', letterSpacing: '0.01em', boxShadow: '0 -2px 8px rgba(0,0,0,0.07)', position: 'relative' }}>
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
            </footer>
        </>
    );
};

export default VerbalHelp; 