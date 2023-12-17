import { CharacterOccurrence } from '../entities/character-occurrence.entity';
import { WordOccurrence } from '../entities/word-occurrence.entity';

export const getUniqueWordsWithOccurrencesFromOpeningCrawls = (
  openingCrawls: string[],
): WordOccurrence[] => {
  const uniqueWordsMap = new Map<string, number>();

  openingCrawls.forEach((openingCrawl) => {
    const words = openingCrawl.split(/\s+/);

    words.forEach((word) => {
      if (word.trim() !== '') {
        const lowercaseWord = word.toLowerCase();
        const count = uniqueWordsMap.get(lowercaseWord) || 0;
        uniqueWordsMap.set(lowercaseWord, count + 1);
      }
    });
  });

  const uniqueWordsWithOccurrences = Array.from(uniqueWordsMap.entries()).map(
    ([word, occurrences]) => ({ word, occurrences }),
  );

  return uniqueWordsWithOccurrences;
};

export const getCharacterNamesWithOccurrencesFromOpeningCrawls = (
  characterNames: string[],
  openingCrawls: string[],
): CharacterOccurrence[] => {
  const characterOccurrencesMap = new Map<string, number>();

  characterNames.forEach((name) => {
    const regex = new RegExp(`\\b${name}\\b`, 'gi');

    openingCrawls.forEach((openingCrawl) => {
      const matches = openingCrawl.match(regex);
      const count = matches ? matches.length : 0;
      const currentCount = characterOccurrencesMap.get(name) || 0;
      characterOccurrencesMap.set(name, currentCount + count);
    });
  });

  const characterOccurrences: CharacterOccurrence[] = Array.from(
    characterOccurrencesMap.entries(),
  ).map(([name, occurrences]) => ({
    name,
    occurrences,
  }));

  return characterOccurrences;
};

export const findMostFrequentNames = (
  nameOccurrences: CharacterOccurrence[],
): CharacterOccurrence[] => {
  const maxOccurrences = Math.max(
    ...nameOccurrences.map((entry) => entry.occurrences),
  );

  const mostFrequentNames = nameOccurrences.filter(
    (entry) => entry.occurrences === maxOccurrences,
  );

  return mostFrequentNames;
};
