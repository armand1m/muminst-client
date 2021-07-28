import split from 'split-string';
import escapeRegExp from 'lodash.escaperegexp';
import { score } from 'fuzzaldrin';

interface Item {
  [key: string]: any;
}

/**
 * Filters a list of objects based on a given field
 *
 * fuzzyFilter filters objects based on the string stored in the "label" property.
 * The returned array will contain a subset of objects where the string
 * contains all search words (case-insensitive), sorted using a fuzzy matching
 * score. Quoted search substrings will filter based on the word ordering.
 *
 * @param {Object[]} items - A list of items to filter
 * @param {string} filterText - The string used to match objects in the array
 *
 * @example
 * const items = [
 *  {label: 'Pop Rocks'},
 *  {label: 'Charleston Chew'}
 * ];
 *
 * const results = fuzzyFilter(items, "rock");
 * // => [{label: 'Pop Rocks'}]
 */
export function fuzzyFilter<T extends Item>(
  key: string,
  items: T[],
  filterText: string
) {
  if (!filterText) {
    return items;
  }
  const splitOpts = { separator: ' ', quotes: ['"'] };
  const substrings = split(filterText, splitOpts).map((s) =>
    s.split('"').join('')
  );

  let result = substrings.reduce((filteredItems, substring) => {
    let regex: RegExp;
    try {
      regex = new RegExp(`^.*${substring}.*$`, 'i');
    } catch (e) {
      // Escape the substring only if necessary to enable filtering with
      // regular expressions
      const escapedSubstring = escapeRegExp(substring);
      regex = new RegExp(`^.*${escapedSubstring}.*$`, 'i');
    }
    return filteredItems.filter((item) => regex.test(item?.[key]));
  }, items);

  const getScore = (item: T) => score(item?.[key], filterText);
  result = result.sort((a, b) => getScore(b) - getScore(a));
  return result;
}
