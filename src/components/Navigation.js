import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const NavButton = styled(Link)`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: ${({ theme, active }) => active ? theme.primary : 'transparent'};
  color: ${({ theme, active }) => active ? '#fff' : theme.text};
  transition: ${({ theme }) => theme.transition};

  &:hover {
    background-color: ${({ theme, active }) => active ? theme.primary : theme.background};
  }
`;

const ThemeToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: ${({ theme }) => theme.transition};

  &:hover {
    background-color: ${({ theme }) => theme.primary};
    color: #fff;
  }

  @media (max-width: 600px) {
    padding: 4px 8px;
    font-size: 12px;
  }
`;

const CoffeeButton = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background-color: #FFDD00;
  color: #000000;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  &:hover {
    background-color: #FFE333;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }

  svg {
    margin-right: 6px;
  }

  @media (max-width: 600px) {
    padding: 4px 8px;
    font-size: 12px;
  }
`;

const Navigation = ({ toggleTheme, currentTheme }) => {
  const location = useLocation();

  return (
    <Nav>
      <NavLinks>
        <NavButton to="/gre-writing" active={location.pathname === '/gre-writing' || location.pathname === '/' ? 1 : 0}>
          Essay Practice
        </NavButton>
        <NavButton to="/typing-practice" active={location.pathname === '/typing-practice' ? 1 : 0}>
          Typing Practice
        </NavButton>
      </NavLinks>
      <RightSection>
        <ThemeToggle onClick={toggleTheme}>
          {currentTheme === 'light' ? '🌙' : '☀️'}
          {currentTheme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </ThemeToggle>
        <CoffeeButton
          href="https://buymeacoffee.com/mithilmistry"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
            <line x1="6" y1="1" x2="6" y2="4"></line>
            <line x1="10" y1="1" x2="10" y2="4"></line>
            <line x1="14" y1="1" x2="14" y2="4"></line>
          </svg>
          Buy me a coffee
        </CoffeeButton>
      </RightSection>
    </Nav>
  );
};

export default Navigation; 