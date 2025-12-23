import { useMemo } from 'react';
import { Section, Sections } from '../../types';

export const useSections = (sections: Sections) =>
  useMemo(() => {
    if (!sections) {
      return [];
    }

    return sections.filter((section): section is Section => !!section);
  }, [sections]);
