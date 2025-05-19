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
    );
};

export default QuantCalculator; 