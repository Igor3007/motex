import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';
import cssNano from "gulp-cssnano";
import webpCss from 'gulp-webpcss';
import sortMediaQueries from 'postcss-sort-media-queries';
import autoprefixer from 'autoprefixer';
import postcss from 'gulp-postcss';
import postcssPresetEnv from 'postcss-preset-env';
import sourcemaps from "gulp-sourcemaps";

import {
  filePaths
} from '../config/paths.js';
import {
  plugins
} from '../config/plugins.js';

const sass = gulpSass(dartSass);

const scss = (isBuild) => {
  const webpConfig = {
    webpClass: '.webp',
    noWebpClass: '.no-webp',
  };

  return gulp.src(filePaths.src.scss)
    .pipe(plugins.if(!isBuild, sourcemaps.init()))
    .pipe(sass({
      outputStyle: 'expanded'
    }, null))
    .pipe(plugins.if(isBuild, webpCss(webpConfig)))
    .pipe(postcss([
      autoprefixer(),
      postcssPresetEnv(),
      sortMediaQueries({sort:'mobile-first'})
    ]))
    .pipe(cssNano())
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(plugins.if(!isBuild, sourcemaps.write('.')))
    .pipe(gulp.dest(filePaths.build.css))
    .pipe(plugins.browserSync.stream());
};

export {
  scss
};
