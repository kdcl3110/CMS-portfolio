const plugin = require('tailwindcss/plugin');
/** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
//   theme: {
//     extend: {
//       colors: {
//         primary: {
//           50: "#c4e7dc",
//           100: "#9dd7c6",
//           200: "#79cfb5",
//           300: "#5dcfad",
//           400: "#38d6a7",
//           500: "#30d0a1",
//           600: "#20c997",
//           700: "#20c997",
//           800: "#20c997",
//           900: "#1aa37b",
//         },
//         secondary: {
//           50: "#fcdec8",
//           100: "#f8d5ba",
//           200: "#f3b482",
//           300: "#faaa6b",
//           400: "#f69547",
//           500: "#14141c",
//           600: "#d27227",
//           700: "#9f551b",
//           800: "#814617",
//           900: "#794115",
//         },
//       },
//       boxShadow: {
//         DEFAULT:
//           "0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.02)",
//         md: "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.02)",
//         lg: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.01)",
//         xl: "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.01)",
//       },
//       outline: {
//         blue: "2px solid rgba(0, 112, 244, 0.5)",
//       },
//       fontFamily: {
//         inter: ["Inter", "sans-serif"],
//         outfit: ["Outfit", "sans-serif"],
//       },
//       fontSize: {
//         xs: ["0.75rem", { lineHeight: "1.5" }],
//         sm: ["0.875rem", { lineHeight: "1.5715" }],
//         base: ["1rem", { lineHeight: "1.5", letterSpacing: "-0.01em" }],
//         lg: ["1.125rem", { lineHeight: "1.5", letterSpacing: "-0.01em" }],
//         xl: ["1.25rem", { lineHeight: "1.5", letterSpacing: "-0.01em" }],
//         "2xl": ["1.5rem", { lineHeight: "1.33", letterSpacing: "-0.01em" }],
//         "3xl": ["1.88rem", { lineHeight: "1.33", letterSpacing: "-0.01em" }],
//         "4xl": ["2.25rem", { lineHeight: "1.25", letterSpacing: "-0.02em" }],
//         "5xl": ["3rem", { lineHeight: "1.25", letterSpacing: "-0.02em" }],
//         "6xl": ["3.75rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
//       },
//       screens: {
//         xs: "480px",
//       },
//       borderWidth: {
//         3: "3px",
//       },
//       minWidth: {
//         36: "9rem",
//         44: "11rem",
//         56: "14rem",
//         60: "15rem",
//         72: "18rem",
//         80: "20rem",
//       },
//       maxWidth: {
//         "8xl": "88rem",
//         "9xl": "96rem",
//       },
//       zIndex: {
//         60: "60",
//         1: "1",
//       },
//     },
//   },
//   plugins: [
//     require("@tailwindcss/forms"),
//     plugin(({ addVariant, e }) => {
//       addVariant("sidebar-expanded", ({ modifySelectors, separator }) => {
//         modifySelectors(
//           ({ className }) =>
//             `.sidebar-expanded .${e(
//               `sidebar-expanded${separator}${className}`
//             )}`
//         );
//       });
//     }),
//   ],
// };


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'outfit': ['Outfit', 'sans-serif'],
      },
      screens: {
        '2xsm': '375px',
        'xsm': '425px',
        '3xl': '2000px',
      },
      fontSize: {
        'title-2xl': ['72px', '90px'],
        'title-xl': ['60px', '72px'],
        'title-lg': ['48px', '60px'],
        'title-md': ['36px', '44px'],
        'title-sm': ['30px', '38px'],
        'theme-xl': ['20px', '30px'],
        'theme-sm': ['14px', '20px'],
        'theme-xs': ['12px', '18px'],
      },
      colors: {
        current: 'currentColor',
        transparent: 'transparent',
        white: '#ffffff',
        black: '#101828',
        brand: {
          25: '#f2f7ff',
          50: '#ecf3ff',
          100: '#dde9ff',
          200: '#c2d6ff',
          300: '#9cb9ff',
          400: '#7592ff',
          500: '#465fff',
          600: '#3641f5',
          700: '#2a31d8',
          800: '#252dae',
          900: '#262e89',
          950: '#161950',
        },
        'blue-light': {
          25: '#f5fbff',
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#b9e6fe',
          300: '#7cd4fd',
          400: '#36bffa',
          500: '#0ba5ec',
          600: '#0086c9',
          700: '#026aa2',
          800: '#065986',
          900: '#0b4a6f',
          950: '#062c41',
        },
        gray: {
          25: '#fcfcfd',
          50: '#f9fafb',
          100: '#f2f4f7',
          200: '#e4e7ec',
          300: '#d0d5dd',
          400: '#98a2b3',
          500: '#667085',
          600: '#475467',
          700: '#344054',
          800: '#1d2939',
          900: '#101828',
          950: '#0c111d',
          dark: '#1a2231',
        },
        orange: {
          25: '#fffaf5',
          50: '#fff6ed',
          100: '#ffead5',
          200: '#fddcab',
          300: '#feb273',
          400: '#fd853a',
          500: '#fb6514',
          600: '#ec4a0a',
          700: '#c4320a',
          800: '#9c2a10',
          900: '#7e2410',
          950: '#511c10',
        },
        success: {
          25: '#f6fef9',
          50: '#ecfdf3',
          100: '#d1fadf',
          200: '#a6f4c5',
          300: '#6ce9a6',
          400: '#32d583',
          500: '#12b76a',
          600: '#039855',
          700: '#027a48',
          800: '#05603a',
          900: '#054f31',
          950: '#053321',
        },
        error: {
          25: '#fffbfa',
          50: '#fef3f2',
          100: '#fee4e2',
          200: '#fecdca',
          300: '#fda29b',
          400: '#f97066',
          500: '#f04438',
          600: '#d92d20',
          700: '#b42318',
          800: '#912018',
          900: '#7a271a',
          950: '#55160c',
        },
        warning: {
          25: '#fffcf5',
          50: '#fffaeb',
          100: '#fef0c7',
          200: '#fedf89',
          300: '#fec84b',
          400: '#fdb022',
          500: '#f79009',
          600: '#dc6803',
          700: '#b54708',
          800: '#93370d',
          900: '#7a2e0e',
          950: '#4e1d09',
        },
        'theme-pink': {
          500: '#ee46bc',
        },
        'theme-purple': {
          500: '#7a5af8',
        },
      },
      boxShadow: {
        'theme-md': '0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
        'theme-lg': '0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)',
        'theme-sm': '0px 1px 3px 0px rgba(16, 24, 40, 0.1), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)',
        'theme-xs': '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
        'theme-xl': '0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03)',
        'focus-ring': '0px 0px 0px 4px rgba(70, 95, 255, 0.12)',
        'slider-navigation': '0px 1px 2px 0px rgba(16, 24, 40, 0.1), 0px 1px 3px 0px rgba(16, 24, 40, 0.1)',
        'tooltip': '0px 4px 6px -2px rgba(16, 24, 40, 0.05), -8px 0px 20px 8px rgba(16, 24, 40, 0.05)',
      },
      zIndex: {
        '1': '1',
        '9': '9',
        '99': '99',
        '999': '999',
        '9999': '9999',
        '99999': '99999',
        '999999': '999999',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.no-scrollbar': {
          '-webkit-scrollbar': {
            'display': 'none'
          },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none'
        },
        '.custom-scrollbar': {
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px'
          },
          '&::-webkit-scrollbar-track': {
            'border-radius': '9999px'
          },
          '&::-webkit-scrollbar-thumb': {
            'background-color': '#e4e7ec',
            'border-radius': '9999px'
          }
        }
      }
      addUtilities(newUtilities)
    }
  ],
}