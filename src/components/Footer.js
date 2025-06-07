import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
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

const FooterText = styled.p`
  margin: 0;
  line-height: 1.5;

  a {
    color: #fff; /* Keep white color for links in dark footer */
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const EmailIconContainer = styled.div`
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  @media (max-width: 600px) {
    position: relative;
    right: auto;
    top: auto;
    bottom: auto;
    transform: none;
    margin-top: 10px;
    order: 2;
    width: 100%;
    display: flex;
    justify-content: center;
  }
`;

const EmailLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #FFDD00;
  color: #23272f;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-weight: 600;
  font-size: 18px;
  text-decoration: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: #FFE333;
  }

  svg {
    width: 22px;
    height: 22px;
  }
`;

const ClustrMapsContainer = styled.div`
  margin: 0.5rem auto;
  width: 80px;
  height: 40px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 600px) {
    margin-top: 10px;
    order: 3;
  }
`;

const FooterContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 60px;
  @media (max-width: 600px) {
    flex-direction: column;
    min-height: auto;
    text-align: center;
    align-items: center;
  }
`;

const FooterTextContainer = styled.div`
  text-align: center;
  width: 100%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  @media (max-width: 600px) {
    position: relative;
    left: auto;
    transform: none;
    order: 1;
    margin-bottom: 10px;
  }
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContentWrapper>
        <FooterTextContainer>
          <FooterText>
            ScoreWise &copy; {currentYear}<br />
            Built and developed by <a href="https://github.com/Mithil1105" target="_blank" rel="noopener noreferrer">Mithil Mistry</a> & Hasti Vakani
          </FooterText>
        </FooterTextContainer>
        <EmailIconContainer>
          <EmailLink href="mailto:Mithil20056mistry@gmail.com" title="Contact Us: Mithil20056mistry@gmail.com">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="22,6 12,13 2,6" /></svg>
          </EmailLink>
        </EmailIconContainer>
      </FooterContentWrapper>
      <ClustrMapsContainer>
        <div id="clustrmaps" style={{ margin: '0.5rem auto', width: 80, height: 40, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <script type="text/javascript" src="//clustrmaps.com/map_v2.js?d=AYG_JMwPCNULF1JiGcb1M92oLMUck1L-32YGpkdm1FM"></script>
        </div>
      </ClustrMapsContainer>
      <noscript>
        <a href="http://www.clustrmaps.com/map/Mithilmistry.tech" title="Visit tracker for Mithilmistry.tech">
          <img src="//www.clustrmaps.com/map_v2.png?d=AYG_JMwPCNULF1JiGcb1M92oLMUck1L-32YGpkdm1FM" alt="ClustrMaps" style={{ width: 80, height: 40, objectFit: 'contain' }} />
        </a>
      </noscript>
    </FooterContainer>
  );
};

export default Footer; 