import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

const isProd = process.env.BUILD === 'prod';

export default {
    input: 'src/index.js',

    output: {
        format: 'iife',
        file: 'dist/bundle.js',
    },

    watch: isProd
        ? null
        : {
            // include and exclude govern which files to watch. by
            // default, all dependencies will be watched
            exclude: ['node_modules/**'],
        },

    plugins: (() => {
        const plugins = [
            babel({
                exclude: 'node_modules/**',
                presets: [
                    '@babel/preset-env',
                ],
            }),
        ];

        if(isProd) {
            plugins.push(
                uglify()
            );
        }

        return plugins;
    })(),
  };