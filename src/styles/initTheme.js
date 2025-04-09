// REPO: @hitchsoftware/react-file-manager
// FILE: src\styles\initTheme.js

// Automatically sets data-theme based on system preference if not already defined
export const applyAutoTheme = () => {
    if (typeof window !== 'undefined' && !document.documentElement.hasAttribute('data-theme')) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
};
