import { fuzzyFilter } from './fuzzyFilter';

describe('fuzzyFilter(items, filterText)', () => {
  const items = [
    { label: 'New York' },
    { label: 'New Mexico' },
    { label: 'Alaska' },
  ];

  it.each`
    filterText
    ${''}
    ${'NEW'}
    ${'alas'}
    ${'new jersey'}
    ${'"new york"'}
    ${'"(me?x|al.ska+)"'}
  `(
    'should return the expected array if filterText equals "$filterText"',
    ({ filterText }) => {
      const result = fuzzyFilter('label', items, filterText);
      expect(result).toMatchSnapshot();
    }
  );
});
