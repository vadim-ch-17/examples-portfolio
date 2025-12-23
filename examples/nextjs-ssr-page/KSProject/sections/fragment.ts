import gql from 'graphql-tag';
import importSectionFragments from '../../utils/importSectionFragments';

const fragments = importSectionFragments(require.context('./Templates', true, /fragment.ts$/));

const fragmentsString = fragments
  .reduce<string[]>((acc, fragment) => {
    const body = fragment?.loc?.source?.body;

    if (!body) {
      return acc;
    }

    return [...acc, body];
  }, [])
  .join('\n');

const sectionFragments = gql`
  ${fragmentsString}
`;

export default sectionFragments;
