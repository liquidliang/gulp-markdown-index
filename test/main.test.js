'use strict';

const indexerPlugin = require('../');
const fs = require('fs');
const File = require('vinyl');
const path = require('path');
const PluginError = require('plugin-error');

describe('gulp-markdown-index', function () {
    let file, check;

    beforeEach(function () {
        file = new File({
            path: path.resolve(__dirname, '../examples/blog/about.md'),
            contents: fs.readFileSync(path.resolve(__dirname, '../examples/blog/about.md')),
            stat: fs.statSync(path.resolve(__dirname, '../examples/blog/about.md')),
        });

        check = function (stream, done, cb) {
            try{
                stream.on('data', function (newFile) {
                    cb(newFile);
                    done();
                });

                stream.write(file);
                stream.end();
            }catch(e){
                done();
                throw e;
            }
        };
    });

    test('auto find static path ../examples/article.json（Suppose that blog is in the root directory of the static resource）', function (done) {
        let stream = indexerPlugin(path.resolve(__dirname, '../examples/article.json'))
        check(stream, done, function (newFile) {
            let list = JSON.parse(String(newFile.contents));
            expect(list[0]).toEqual(expect.objectContaining({
                path: "blog/about.md",
            }), );
        });
    });

    test('auto find static path （../examples/public/json/article.json）', function (done) {
        let stream = indexerPlugin(path.resolve(__dirname, '../examples/public/json/article.json'))
        check(stream, done, function (newFile) {
            let list = JSON.parse(String(newFile.contents));
            expect(list[0]).toEqual(expect.objectContaining({
                path: "blog/about.md",
            }), );
        });
    });

    test('Specify a static resource directory ../examples/', function (done) {
        let stream = indexerPlugin(path.resolve(__dirname, '../examples/article.json'), path.resolve(__dirname, '../examples/'))
        check(stream, done, function (newFile) {
            let list = JSON.parse(String(newFile.contents));
            expect(list[0]).toEqual(expect.objectContaining({
                path: "blog/about.md",
            }), );
        });
    });


    test('Specify a static resource directory ../', function (done) {
        let stream = indexerPlugin(path.resolve(__dirname, '../examples/article.json'), path.resolve(__dirname, '../'))
        check(stream, done, function (newFile) {
            let list = JSON.parse(String(newFile.contents));
            expect(list[0]).toEqual(expect.objectContaining({
                path: "examples/blog/about.md",
            }), );
        });
    });

    test('Specify a static resource directory need toThrow Error', function (done) {
        let stream = indexerPlugin(path.resolve(__dirname, '../examples/article.json'), path.resolve(__dirname, '../examples/public'));
        expect(function(){
            check(stream, done, function(){});
        }).toThrow('not in the static directory');
    });
});
