'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
var program = require("commander");
var process_1 = require("process");
var graceful_fs_1 = require("graceful-fs");
var glob = require("glob");
var path_1 = require("path");
// Modules
var convert_1 = require("@visbot/webvsc/lib/convert");
program
    .version(require('../package.json').version)
    .usage('[options] <file(s)>')
    .option('-v, --verbose <int>', 'print more information, can be set multiple times to increase output', function (d, t) { return t + 1; }, 0)
    .option('-m, --minify', 'minify generated JSON')
    .option('-q, --quiet', 'print errors only')
    .option('-n, --no-hidden', 'don\'t extract hidden strings from fixed-size strings')
    .parse(process_1.argv);
var convert = function (file, args) {
    if (args.quiet !== true)
        console.log("\nReading \"" + file + "\"");
    var presetObj = convert_1.convertPreset(file, args);
    var whitespace = (program.minify === true) ? 0 : 4;
    var presetJson = JSON.stringify(presetObj, null, whitespace);
    var baseName = path_1.basename(file, '.avs');
    var dirName = path_1.dirname(file);
    var outFile = path_1.join(dirName, baseName + '.webvs');
    graceful_fs_1.writeFile(outFile, presetJson, function (err) {
        if (err)
            console.error(err);
        if (args.quiet !== true)
            console.log("Writing \"" + outFile + "\"");
    });
};
if (program.args !== 'undefined' && program.args.length > 0) {
    program.args.forEach(function (element, index) {
        glob(element, function (error, files) {
            if (error)
                throw error;
            files.forEach(function (file) {
                graceful_fs_1.lstat(file, function (error, stats) {
                    if (error)
                        return;
                    if (stats.isFile()) {
                        convert(file, program);
                    }
                });
            });
        });
    });
}
if (program.args.length === 0)
    program.help();
//# sourceMappingURL=cli.js.map