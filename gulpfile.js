// Основной модуль
import gulp from "gulp";
// Импорт модулей
import { path } from "./gulp/config/path.js";
// Импорт общих плагинов
import { plugins } from "./gulp/config/plugins.js";

// Передаём значения в глобальную переменную
global.app = {
	isBuild: process.argv.includes('--build'),
	isDev: !process.argv.includes('--build'),
	path: path,
	gulp: gulp,
	plugins: plugins,
}

// Импорт задач
import { copy, copyImgFile } from "./gulp/tasks/copy.js";
import { reset } from "./gulp/tasks/reset.js";
import { html } from "./gulp/tasks/html.js";
import { catalog } from "./gulp/tasks/html.js";
import { server } from "./gulp/tasks/server.js";
import { scss, scss_vendors, scss_fonts } from "./gulp/tasks/scss.js";
import { js } from "./gulp/tasks/js.js";
import { images } from "./gulp/tasks/images.js";
import { otfToTtf, ttfToWoff, fontsStyle } from "./gulp/tasks/fonts.js";
import { svgSprive } from "./gulp/tasks/svgSprive.js";
import { zip } from "./gulp/tasks/zip.js";
import { ftp } from "./gulp/tasks/ftp.js";

// Наблюдатель за изменениями в файлах
function watcher() {
	gulp.watch(path.watch.files, copy); //gulp.watch(path.watch.files, gulp.series(htm;, ftp))
	gulp.watch(path.watch.html, html); //gulp.watch(path.watch.html, gulp.series(htm;, ftp))
	gulp.watch(path.watch.catalog, catalog);
	gulp.watch(path.watch.imgfiles, copyImgFile);
	gulp.watch(path.watch.scss, scss); //gulp.watch(path.watch.scss, gulp.series(htm;, ftp))
	gulp.watch(path.watch.js, js); //gulp.watch(path.watch.js, gulp.series(htm;, ftp))
	gulp.watch(path.watch.images, images); //gulp.watch(path.watch.images, gulp.series(htm;, ftp))
}

export { svgSprive }

// Последовательная обработка шрифтов
const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle);

// Основные задачи
const mainTasks = gulp.series(fonts, gulp.parallel(copy, html, catalog, scss_fonts, scss, scss_vendors, js, images, copyImgFile));

// Построение сценариев выполнения задач
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);
const deployZIP = gulp.series(reset, mainTasks, zip);
const deployFTP = gulp.series(reset, mainTasks, ftp);

// Экспорт сценариев
export { dev }
export { build }
export { deployZIP }
export { deployFTP }

// Выполнение сценария по умолчанию
gulp.task('default', dev);