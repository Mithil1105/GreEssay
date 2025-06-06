import React, { useState } from 'react';
import styled from 'styled-components';

const CalculatorContainer = styled.div`
  max-width: 350px;
  margin: 30px auto;
  background-color: ${props => props.theme.surface};
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const DisplayContainer = styled.div`
  background-color: ${props => props.theme.background};
  padding: 20px;
  text-align: right;
`;

const DisplayInput = styled.input`
  width: 100%;
  border: none;
  background: transparent;
  text-align: right;
  font-size: 2.5rem;
  color: ${props => props.theme.text};
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 20px;
`;

const Button = styled.button`
  background-color: ${props => {
        if (props.type === 'operator') return props.theme.primary;
        if (props.type === 'function') return props.theme.secondary;
        return props.theme.background;
    }};
  color: ${props => {
        if (props.type === 'operator' || props.type === 'function') return 'white';
        return props.theme.text;
    }};
  border: none;
  border-radius: 10px;
  font-size: 1.2rem;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const QuantCalculator = () => {
    const [display, setDisplay] = useState('');
    const [memory, setMemory] = useState(0);

    const handleNumberClick = (number) => {
        setDisplay(display + number);
    };

    const handleOperatorClick = (operator) => {
        setDisplay(display + operator);
    };

    const calculateResult = () => {
        try {
            // eslint-disable-next-line no-eval
            const result = eval(display);
            setDisplay(result.toString());
        } catch (error) {
            setDisplay('Error');
        }
    };

    const clearDisplay = () => {
        setDisplay('');
    };

    const memoryClear = () => {
        setMemory(0);
    };

    const memoryRecall = () => {
        setDisplay(memory.toString());
    };

    const memoryStore = () => {
        setMemory(parseFloat(display));
    };

    const handleSquareRoot = () => {
        try {
            const result = Math.sqrt(parseFloat(display));
            setDisplay(result.toString());
        } catch (error) {
            setDisplay('Error');
        }
    };

    return (
        <>
            <CalculatorContainer>
                <DisplayContainer>
                    <DisplayInput
                        type="text"
                        value={display}
                        readOnly
                        placeholder="0"
                    />
                </DisplayContainer>
                <ButtonGrid>
                    <Button onClick={memoryClear} type="function">MR</Button>
                    <Button onClick={memoryRecall} type="function">MC</Button>
                    <Button onClick={memoryStore} type="function">M+</Button>
                    <Button onClick={() => handleNumberClick('(')} type="function">(</Button>

                    <Button onClick={() => handleNumberClick('7')}>7</Button>
                    <Button onClick={() => handleNumberClick('8')}>8</Button>
                    <Button onClick={() => handleNumberClick('9')}>9</Button>
                    <Button onClick={() => handleOperatorClick('/')} type="operator">÷</Button>

                    <Button onClick={() => handleNumberClick('4')}>4</Button>
                    <Button onClick={() => handleNumberClick('5')}>5</Button>
                    <Button onClick={() => handleNumberClick('6')}>6</Button>
                    <Button onClick={() => handleOperatorClick('*')} type="operator">×</Button>

                    <Button onClick={() => handleNumberClick('1')}>1</Button>
                    <Button onClick={() => handleNumberClick('2')}>2</Button>
                    <Button onClick={() => handleNumberClick('3')}>3</Button>
                    <Button onClick={() => handleOperatorClick('-')} type="operator">-</Button>

                    <Button onClick={() => handleNumberClick('0')}>0</Button>
                    <Button onClick={() => handleNumberClick('.')}>.</Button>
                    <Button onClick={handleSquareRoot} type="function">√</Button>
                    <Button onClick={() => handleOperatorClick('+')} type="operator">+</Button>

                    <Button onClick={clearDisplay} type="function">C</Button>
                    <Button onClick={() => handleNumberClick(')')} type="function">)</Button>
                    <Button onClick={calculateResult} type="operator">=</Button>
                </ButtonGrid>
            </CalculatorContainer>
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

export default QuantCalculator; 