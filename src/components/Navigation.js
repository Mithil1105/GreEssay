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
  padding: 0.5rem;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  transition: ${({ theme }) => theme.transition};

  &:hover {
    background-color: ${({ theme }) => theme.primary};
    color: #fff;
  }
`;

const Navigation = ({ toggleTheme, currentTheme }) => {
  const location = useLocation();

  return (
    <Nav>
      <NavLinks>
        <NavButton to="/gre-writing" active={location.pathname === '/gre-writing' ? 1 : 0}>
          GRE Essays
        </NavButton>
        <NavButton to="/typing" active={location.pathname === '/typing' ? 1 : 0}>
          Typing Practice
        </NavButton>
      </NavLinks>
      <ThemeToggle onClick={toggleTheme}>
        {currentTheme === 'light' ? '🌙' : '☀️'}
      </ThemeToggle>
    </Nav>
  );
};

export default Navigation; 