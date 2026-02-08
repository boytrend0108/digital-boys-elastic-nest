export function generateSuggestions(name: string): string[] {
  const suggestions = [name];

  // Remove common articles at the beginning
  const withoutArticles = name.replace(/^(The|A|An)\s+/i, '').trim();
  if (withoutArticles !== name) {
    suggestions.push(withoutArticles);
  }

  // Create suggestions from each significant word position
  const words = name.split(' ');
  for (let i = 1; i < words.length; i++) {
    const partial = words.slice(i).join(' ');
    if (partial.length > 2) {
      suggestions.push(partial);
    }
  }

  return [...new Set(suggestions)];
}
