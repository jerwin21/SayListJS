export const makePhrase = (words, startIndex, wordCount) => {
  // Ensure the range is within the bounds of the array
  let safeEndIndex = Math.min(startIndex + wordCount, words.length);

  // Join the specified range of words into a single string
  return words.slice(startIndex, safeEndIndex).join(" ") + " ";
};
