import { Html, Head, Main, NextScript } from 'next/document';
import styled from '@emotion/styled';

const HTML = styled(Html)`
  height: 100%;
`;

const Body = styled.body`
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Footer = styled.footer`
  background: var(--chakra-colors-gray-200);
  text-align: center;
  padding: 1rem;
  margin-top: auto;
`;

export default function Document() {
  return (
    <HTML>
      <Head />
      <Body>
        <Main />
        <NextScript />
        <Footer>© 2022 AimanAnizan | All Right Reserved</Footer>
      </Body>
    </HTML>
  );
}
