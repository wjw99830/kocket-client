import ts2 from 'rollup-plugin-typescript2';
import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';
export default [{
  input: pkg.main,
  plugins: [
    ts2(),
    process.env.NODE_ENV.trim() === 'production' && terser(),
  ],
  output: [{
    file: pkg.umd,
    format: 'umd',
    name: 'Kocket',
  }],
}, {
  input: pkg.main,
  plugins: [
    ts2(),
  ],
  output: [{
    file: pkg.module,
    format: 'es',
  }],
}];
