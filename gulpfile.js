import gulp from "gulp";
import { deleteAsync as del } from "del";

// Caminhos
const paths = {
  chrome: "build/chrome",
  firefox: "build/firefox"
};

// Arquivos que devem ser copiados
const buildFiles = [
  "**",
  "!node_modules/**",
  "!build/**",
  "!npm-debug.log",
  "!gulpfile.*",
  "!package-lock.json",
  "!README.md",
  "!**/*.test.js"
];

// Limpa a pasta build
export async function clean() {
  await del(["build"]);
}

// Copia arquivos para build/chrome
export function copyChrome() {
  return gulp.src(buildFiles, { base: "." }).pipe(gulp.dest(paths.chrome));
}

// Copia arquivos para build/firefox
export function copyFirefox() {
  return gulp.src(buildFiles, { base: "." }).pipe(gulp.dest(paths.firefox));
}

// Build principal
export const build = gulp.series(
  clean,
  gulp.parallel(copyChrome, copyFirefox)
);

// Observa mudanças e rebuila
export function watch() {
  gulp.watch(buildFiles, build);
}

// Default
export default build;
