import { useState, useEffect } from 'react';

const THEME_OPTIONS = ['light', 'dark', 'pink', 'violet', 'blue', 'green', 'red'];

export const useTheme = () => {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme && THEME_OPTIONS.includes(savedTheme) ? savedTheme : 'dark';
    });

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    const cycleTheme = () => {
        const currentIndex = THEME_OPTIONS.indexOf(theme);
        const nextIndex = (currentIndex + 1) % THEME_OPTIONS.length;
        setTheme(THEME_OPTIONS[nextIndex]);
    };

    return {
        theme,
        cycleTheme,
        themeOptions: THEME_OPTIONS,
        setTheme: (newTheme) => {
            if (THEME_OPTIONS.includes(newTheme)) {
                setTheme(newTheme);
            }
        }
    };
}; 