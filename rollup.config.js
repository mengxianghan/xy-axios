import { terser } from 'rollup-plugin-terser'

import babel from '@rollup/plugin-babel'
import cleaner from 'rollup-plugin-cleaner'

const name = 'XYAxios'

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/es/index.js',
            format: 'es',
        },
        {
            file: 'dist/es/index.min.js',
            format: 'es',
            plugins: [terser()],
        },
        {
            file: 'dist/index.js',
            format: 'umd',
            globals: { axios: 'axios' },
            name,
        },
        {
            file: 'dist/index.min.js',
            format: 'umd',
            globals: { axios: 'axios' },
            name,
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
    external: ['axios'],
    watch: {
        include: 'src/**',
    },
}
