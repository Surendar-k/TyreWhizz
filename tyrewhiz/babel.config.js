module.exports = {
  presets: ["module:metro-react-native-babel-preset",
    
  ],
  plugins: [
    "module:react-native-dotenv", // Ensure dotenv is added if you're using .env files
    "@babel/plugin-transform-private-methods", // Add for private methods support
    "@babel/plugin-transform-class-properties", // Add for class properties support
    "@babel/plugin-transform-private-property-in-object", // Add for private properties in objects
  ],
  overrides: [
    {
      test: /\.(js|jsx|ts|tsx)$/,
      plugins: [
        [
          "@babel/plugin-transform-class-properties",
          { loose: true }, // Ensure 'loose' mode is consistent
        ],
        [
          "@babel/plugin-transform-private-methods",
          { loose: true }, // Ensure 'loose' mode is consistent
        ],
        [
          "@babel/plugin-transform-private-property-in-object",
          { loose: true }, // Ensure 'loose' mode is consistent
        ],
      ],
    },
  ],
};