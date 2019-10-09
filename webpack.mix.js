let mix = require('laravel-mix');
let SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
let scripts = require('./resources/js/bootstrap');

const httpRegex = 'http:\\/\\/|https:\\/\\/';
const projectProxy = process.env.APP_URL.replace(new RegExp(httpRegex), '');

require('laravel-mix-purgecss');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

let wpConfig = {
    plugins: [
        new SVGSpritemapPlugin('resources/svg/*.svg', {
            output: {
                filename: 'svg/sprite.svg',
                svgo: {
                    removeTitle: true,
                },
                chunk: {
                    name: '../resources/js/spritemap',
                },
            },
            sprite: {
                prefix: false,
            },
        }),
    ],
};

mix.options({
    imgLoaderOptions: {
        enabled: true,
        gifsicle: {},
        mozjpeg: {
            quality: 85,
            progressive: true,
        },
        optipng: {
            enabled: false,
        },
        pngquant: {
            quality: '85-90',
            speed: 4,
        },
        svgo: {},
    },
});

mix
    .sass('resources/sass/frontend.scss', 'public/css')
    .options({
        processCssUrls: false
        //     postCss: [
        //         require('postcss-sprites')({
        //             spritePath: 'images'
        //         }),
        //     ]
    })
    .copyDirectory('resources/fonts', 'public/fonts')
    //.copyDirectory('resources/images', 'public/images')
    //.copy('resources/images/*', 'public/images')
    .babel(scripts, 'public/js/frontend.js');

if (!mix.inProduction()) {
    wpConfig.devtool = 'source-map';
    mix.sourceMaps()
    // .copyDirectory('resources/images', 'public/images')
        .copy('resources/images/*', 'public/images')
        .copy('resources/images/**/*', 'public/images');
}

mix.webpackConfig(wpConfig);

if (mix.inProduction()) {
    mix
        .js('resources/js/compress.js', 'public/js')
        .purgeCss({
            enabled: true,
            globs: [
                path.join(__dirname, 'packages/mixdinternet/frontend/src/**/*.php'),
                path.join(__dirname, 'node_modules/slick-carousel/slick/**/*.js'),
                path.join(
                    __dirname,
                    'node_modules/bootstrap/dist/js/bootstrap.min.js',
                ),
            ],
            // Include classes we don't have access directly
            whitelistPatterns: [/hs-*/],
        })
        .version();
}

/*
 |--------------------------------------------------------------------------
 | BrowserSync
 |--------------------------------------------------------------------------
 */
mix.browserSync({
    host: '192.168.10.10',
    proxy: projectProxy,
    open: false,
    watch: true,
    files: [
        'app/**/*.php',
        'resources/views/**/*.php',
        'packages/mixdinternet/frontend/src/**/*.php',
        'resources/js/**/*.js',
        'resources/sass/**/*.scss',
        'public/js/**/*.js',
        'public/css/**/*.css',
    ],
    watchOptions: {
        usePolling: true,
        interval: 500,
    },
});
