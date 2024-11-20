module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: '#4B56D2', // Deep Blue
        secondary: '#F9A826', // Vibrant Orange
        accent: '#F1C40F', // Yellow Accent

        // Neutral Colors
        dark: '#2D3436', // Dark Gray
        light: '#F4F6F9', // Light Gray

        // Background Colors
        backgroundLight: '#FFFFFF', // White
        backgroundDark: '#2F3640', // Dark Background

        // Text Colors
        textLight: '#A4A8B3', // Light Gray Text
        textDark: '#2F3A53', // Dark Gray Text

        // Button Colors
        buttonPrimary: '#4B56D2', // Button with primary color
        buttonSecondary: '#F9A826', // Button with secondary color
      },
    },
  },
  plugins: [],
};
