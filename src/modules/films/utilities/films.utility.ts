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
