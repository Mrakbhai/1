export type Theme = 'light' | 'dark' | 'luxury';

export const setTheme = (theme: Theme): void => {
  // Remove all theme classes first
  document.documentElement.classList.remove('light', 'dark', 'luxury');
  
  // Add the new theme class
  document.documentElement.classList.add(theme);
  
  // Store the user's preference
  localStorage.setItem('theme', theme);
};

export const getTheme = (): Theme => {
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  return savedTheme || 'light';
};

export const applyTheme = (): void => {
  const theme = getTheme();
  setTheme(theme);
};
