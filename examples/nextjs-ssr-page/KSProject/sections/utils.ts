import spacings from '../../style/spacings';
import { ComponentMeta } from '../../utils/importSectionComponents/types';
import { SectionSpacing, SectionSpacingApi, SectionsProps } from './types';
import sectionsComponentsMap from './sectionsComponentsMap';
import { objectKeys } from '../../utils/lodash';

export const getSpacing = <T extends SectionSpacingApi>(
  section: T,
  defaultSpacing: SectionSpacing
) => {
  const top = spacings[section.top as keyof typeof spacings] ?? defaultSpacing.top;
  const bottom = spacings[section.bottom as keyof typeof spacings] ?? defaultSpacing.bottom;

  return {
    top,
    bottom,
  };
};

export const getComponentAdditionalProps = (
  sectionType: string,
  props: Omit<SectionsProps, 'sections'>
): object => {
  switch (sectionType) {
    case 'otherServicesSection':
      const { services } = props;

      return { allServices: services };
    case 'storageSection': {
      const { storages } = props;

      return { allStorageTypes: storages };
    }
    case 'spacePreviewSection': {
      const { space } = props;

      return { allStorageTypes: space };
    }
    case 'socialLinksSection': {
      const { socialLinks } = props;

      return { socialLinks };
    }
    case 'contactFormSection': {
      const { contactInfo, contactForm } = props;

      return { contactInfo, contactForm };
    }
    case 'requestACallbackSection': {
      const { contactForm } = props;

      return { contactForm };
    }
    default:
      return {};
  }
};

export const importSectionComponents = (): Record<string, ComponentMeta> =>
  objectKeys(sectionsComponentsMap).reduce<Record<string, ComponentMeta>>(
    (result, key) => ({
      ...result,
      [key]: {
        component: sectionsComponentsMap[key],
        defaultSpacing: {
          top: { desktop: '3.75rem', mobile: '3.125rem' },
          bottom: { desktop: '0', mobile: '0' },
        },
      },
    }),
    {}
  );
