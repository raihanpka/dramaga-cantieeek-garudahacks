export const breakLongWords = (text: string, maxCharsPerLine: number = 25): string => {
  const words = text.split(' ');
  const processedWords = words.map(word => {
    if (word.length > maxCharsPerLine) {
      // Break long words into chunks
      const chunks = [];
      for (let i = 0; i < word.length; i += maxCharsPerLine) {
        chunks.push(word.substring(i, i + maxCharsPerLine));
      }
      return chunks.join('\n');
    }
    return word;
  });
  
  return processedWords.join(' ');
};

export const formatMessageText = (text: string): string => {
  return breakLongWords(text, 25);
};
