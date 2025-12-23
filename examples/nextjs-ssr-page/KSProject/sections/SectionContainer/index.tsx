import React from 'react';

import * as Styled from './styles';
import { SectionContainerProps } from './types';

const SectionContainer: React.FC<SectionContainerProps & { children: React.ReactNode }> = ({
  spacing,
  children,
}) => <Styled.Container {...spacing}>{children}</Styled.Container>;

export default React.memo(SectionContainer);
