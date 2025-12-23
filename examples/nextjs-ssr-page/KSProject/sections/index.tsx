import React from 'react';
import { NoUndefinedField } from '../../../@types/misc';
import { Section } from '../pages/CmsPage/types';
import SectionContainer from './SectionContainer';
import { SectionsProps } from './types';
import { getComponentAdditionalProps, getSpacing, importSectionComponents } from './utils';
import LazyHydrate from '../utils/LazyHydrate';

const sectionComponents = importSectionComponents();

const Sections: React.FC<SectionsProps> = ({ sections, ...props }) => (
  <>
    {sections &&
      sections
        .filter((section): section is NoUndefinedField<Section> => !!section?._type)
        .map((section, index) => {
          const componentMeta = sectionComponents[section._type];
          const Component = componentMeta?.component as unknown as React.FC<typeof section>;

          if (!Component) {
            return null;
          }

          const key = section._key;
          if (!key) {
            throw new Error(
              `"_key" field is missing in section type "${section._type}". Did you forget to query it?`
            );
          }

          const spacing = getSpacing(section, componentMeta.defaultSpacing);
          const additionalProps = getComponentAdditionalProps(section._type, props);

          const content = (
            <SectionContainer {...{ spacing }} key={key}>
              <Component {...{ ...section, ...additionalProps }} />
            </SectionContainer>
          );

          return index > 0 ? (
            <LazyHydrate
              key={section._key}
              id={section._key}
              useDisplayContents={false}
              noWrapper="section"
              whenVisible={{
                rootMargin: '-100px',
              }}
            >
              {content}
            </LazyHydrate>
          ) : (
            content
          );
        })}
  </>
);

export default Sections;
