import typescript from 'rollup-plugin-typescript';
import babel from 'rollup-plugin-babel';
import json from "rollup-plugin-json";

export default {
  input: './src/broadcastt.ts',
  output: {
    format: 'cjs',
    file: './dist/broadcastt.js',
  },
  plugins: [
    json(),
    typescript(),
    babel({
      exclude: 'node_modules/**',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
  ],
}
