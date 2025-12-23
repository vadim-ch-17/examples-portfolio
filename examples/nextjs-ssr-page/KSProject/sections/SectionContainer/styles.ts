import styled, { css } from 'styled-components';

import media from '../../../style/media';
import { SectionSpacing } from '../types';

const Container = styled.section<SectionSpacing>`
  ${({ top, bottom }) => css`
    padding-top: ${top.mobile};
    padding-bottom: ${bottom.mobile};

    @media ${media.DesktopSm} {
      padding-top: ${top.desktop};
      padding-bottom: ${bottom.desktop};
    }
  `}
`;

export { Container };
