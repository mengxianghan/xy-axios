import { terser } from 'rollup-plugin-terser'

import babel from '@rollup/plugin-babel'
import cleaner from 'rollup-plugin-cleaner'

export default {
    input: 'src/main.js',
    output: [
        {
            file: 'dist/index.esm.js',
            format: 'esm',
        },
        {
            file: 'dist/index.esm.min.js',
            format: 'esm',
            plugins: [terser()],
        },
        {
            file: 'dist/index.umd.js',
            format: 'umd',
            name: 'Enum',
        },
        {
            file: 'dist/index.umd.min.js',
            format: 'umd',
            name: 'Enum',
            plugins: [terser()],
        },
    ],
    plugins: [
        babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**',
        }),
        cleaner({
            targets: ['dist'],
        }),
    ],
    watch: {
        include: 'src/**',
    },
}
