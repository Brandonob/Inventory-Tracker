import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  }
  return false;
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    darkMode: getInitialTheme(),
  },
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.darkMode ? 'dark' : 'light');
        if (state.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;