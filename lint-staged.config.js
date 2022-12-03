export default {
  "./{src,tests}/**/*.{js,jsx,ts,tsx}": "eslint --fix",
  "./{src,tests}/**/*.{ts,tsx}": () => "tsc -p tsconfig.json --noEmit",
}
