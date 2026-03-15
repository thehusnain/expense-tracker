export const theme = {
    colors: {
        primary: '#6366f1', // Indigo 500
        primaryLight: '#818cf8', // Indigo 400
        primaryDark: '#4f46e5', // Indigo 600
        secondary: '#ec4899', // Pink 500
        accent: '#8b5cf6', // Violet 500
        background: '#0f172a', // Slate 900 (Dark mode by default for premium feel)
        surface: '#1e293b', // Slate 800
        card: 'rgba(30, 41, 59, 0.7)', // Semi-transparent for glassmorphism
        text: '#f8fafc', // Slate 50
        textLight: '#94a3b8', // Slate 400
        border: 'rgba(255, 255, 255, 0.1)',
        error: '#f87171', // Red 400
        success: '#4ade80', // Green 400
        income: '#10b981', // Emerald 500
        expense: '#f43f5e', // Rose 500
        gold: '#fbbf24', // Amber 400 for highlights
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    roundness: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        xxl: 32,
        full: 9999,
    },
    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.18,
            shadowRadius: 1.0,
            elevation: 1,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
        },
        lg: {
            shadowColor: '#6366f1',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 12,
        }
    },
    typography: {
        h1: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
        h2: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5 },
        h3: { fontSize: 20, fontWeight: '600' },
        body: { fontSize: 16, fontWeight: '400' },
        caption: { fontSize: 12, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 1 },
    }
};
