import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { defaultTheme } from '../themes';

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
  @media (max-width: 600px) {
    margin-top: 1rem;
    padding: 0 0.5rem;
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
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.8rem;
  }
`;

const ListSelect = styled.select`
  padding: 0.7rem 1.2rem;
  border-radius: 8px;
  border: 1.5px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  font-size: 1.08rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  transition: background 0.2s, border 0.2s;
  &:hover {
    background: ${({ theme }) => theme.secondary};
    border-color: ${({ theme }) => theme.primary};
  }
  @media (max-width: 600px) {
    width: 100%;
    font-size: 1rem;
    padding: 0.7rem 1rem;
  }
`;

const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  position: relative;
  @media (max-width: 600px) {
    width: 100%;
    align-items: stretch;
  }
`;

const DropdownButton = styled.button`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  border: 1.5px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 0.7rem 1.3rem;
  font-size: 1.08rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 0.5rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  transition: background 0.2s, border 0.2s;
  &:hover {
    background: ${({ theme }) => theme.secondary};
    border-color: ${({ theme }) => theme.primary};
  }
  @media (max-width: 600px) {
    width: 100%;
    font-size: 1rem;
    padding: 0.7rem 1rem;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 110%;
  left: 0;
  background: ${({ theme }) => theme.surface};
  border: 1.5px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.10);
  padding: 1rem 1.2rem;
  z-index: 10;
  min-width: 220px;
  @media (max-width: 600px) {
    min-width: unset;
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 1.08rem;
  color: ${({ theme }) => theme.text};
  font-weight: 500;
  margin-bottom: 0.7rem;
  cursor: pointer;
  user-select: none;
`;

const Checkbox = styled.input`
  margin-right: 0.7em;
  accent-color: ${({ theme }) => theme.primary};
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
  background: ${({ theme }) => theme.background};
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
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
    justify-content: center;
    align-items: center;
    order: 2;
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
  color: ${({ theme }) => theme.text};
  background: ${({ $active, $review, theme }) =>
        $review ? theme.error + '1A' : $active ? theme.background : 'transparent'};
  border: 1.5px solid ${({ $active, $review, theme }) =>
        $review ? theme.error : $active ? theme.primary : 'transparent'};
  cursor: pointer;
  transition: background 0.18s, border 0.18s;
  position: relative;
  line-height: 1.6;
  &:hover {
    background: ${({ $review, theme }) => ($review ? theme.error + '33' : theme.background)};
  }
  @media (max-width: 900px) {
    padding: 0.5rem 0.7rem;
    margin: 0.2rem;
    font-size: 0.95rem;
  }
`;

const SidebarIcon = styled.span`
  margin-left: 0.5em;
  font-size: 1.22em;
  ${({ $review, theme }) =>
        $review &&
        css`
      color: ${theme.error};
    `}
  ${({ $completed, $review, theme }) =>
        $completed && !$review &&
        css`
      color: ${theme.success};
    `}
`;

const Card = styled.div`
  background: ${({ $review, theme }) => ($review ? theme.error + '1A' : theme.surface)};
  border-radius: 32px;
  box-shadow: ${({ theme }) => theme.shadow};
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
  border: ${({ $review, theme }) => ($review ? `2.5px solid ${theme.error}` : 'none')};
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
    padding: 1.5rem 1rem 1rem 1rem;
    min-height: unset;
    order: 1;
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
  color: ${({ theme }) => theme.text};
  margin-bottom: 1.2rem;
  text-align: center;
  letter-spacing: 0.01em;
  font-family: 'Fira Sans', 'Segoe UI', Arial, sans-serif;
`;

const MeaningSection = styled.div`
  background: ${({ theme }) => theme.background};
  border-left: 7px solid ${({ theme }) => theme.primary};
  border-radius: 10px;
  padding: 1.2rem 1.3rem 1.2rem 1.7rem;
  margin-bottom: 2.1rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
`;

const MeaningLabel = styled.div`
  font-size: 1.13rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 0.3rem;
  letter-spacing: 0.01em;
`;

const MeaningText = styled.div`
  font-size: 1.45rem;
  color: ${({ theme }) => theme.text};
  font-weight: 500;
  line-height: 1.7;
  font-family: 'Fira Sans', 'Segoe UI', Arial, sans-serif;
`;

const Divider = styled.hr`
  border: none;
  border-top: 2.5px solid ${({ theme }) => theme.border};
  margin: 1.7rem 0 1.3rem 0;
`;

const Example = styled.div`
  background: ${({ theme }) => theme.background};
  border-radius: 10px;
  padding: 1.2rem 1.3rem;
  margin-bottom: 1.2rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
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
  color: ${({ theme }) => theme.primary};
  margin-bottom: 0.4rem;
  letter-spacing: 0.01em;
`;

const ExampleText = styled.div`
  font-size: 1.18rem;
  color: ${({ theme }) => theme.text};
  line-height: 1.7;
  font-family: 'Fira Sans', 'Segoe UI', Arial, sans-serif;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.3rem;
  margin-top: 2.3rem;
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.8rem;
    margin-top: 1.5rem;
  }
`;

const Button = styled.button`
  padding: 1rem 2.2rem;
  border-radius: 8px;
  background-color: ${({ theme, $review }) => $review ? theme.error : theme.primary};
  color: ${({ theme }) => theme.text === '#333333' ? '#fff' : theme.text};
  font-size: 1.18rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.09);
  font-family: 'Fira Sans', 'Segoe UI', Arial, sans-serif;
  &:hover {
    background-color: ${({ theme, $review }) => $review ? theme.error : theme.secondary};
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
  color: ${({ theme }) => theme.text};
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
                    <label htmlFor="list-select" style={{ fontWeight: 600, color: '${({ theme }) => theme.text}', fontSize: '1.08rem' }}>Select List:</label>
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
                                    style={{
                                        fontWeight: idx === currentIndex ? 700 : 500,
                                    }}
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
                    <Card $review={isReview}>
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
                                style={{
                                    background: isReview ? defaultTheme.error : defaultTheme.primary,
                                    color: isReview ? '#fff' : defaultTheme.text === '#333333' ? '#fff' : defaultTheme.text,
                                    minWidth: 120
                                }}
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
        </>
    );
};

export default VerbalHelp; 