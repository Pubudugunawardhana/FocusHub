const categories: Record<string, string[]> = {
  Programming: ['react', 'javascript', 'node', 'api', 'tutorial', 'jwt', 'python', 'java', 'coding', 'html', 'css', 'nextjs', 'express'],
  Finance: ['stock', 'crypto', 'invest', 'money', 'trading', 'bitcoin', 'finance'],
  Fitness: ['workout', 'gym', 'diet', 'protein', 'fitness', 'muscle', 'exercise'],
};

export function categorizeVideo(title: string): string {
  const lower = title.toLowerCase();
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some((k) => lower.includes(k))) return category;
  }
  return 'General';
}
