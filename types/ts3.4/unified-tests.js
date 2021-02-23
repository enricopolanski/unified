"use strict";
exports.__esModule = true;
var unified = require("unified");
var vfile = require("vfile");
var fileValue;
var nodeValue;
var stringValue;
/**
 * `processor()`
 */
var processor = unified();
var clonedProcessor = processor();
/**
 * `processor.use`
 */
var plugin = function () { };
var settings = {
    random: 'option'
};
var typedPlugin = function () { };
var typedSetting = { example: 'example' };
var implicitlyTypedPlugin = function (settings) { };
var transformerPlugin = function (settings) { return function (tree, file) { return ({
    type: 'random node'
}); }; };
var pluginWithTwoSettings = function (processor, settings) { };
var parserPlugin = (function () {
    var parser = function () { };
    parser.Parser = function (text, file) { return ({ type: '' }); };
    return parser;
})();
var compilerPlugin = (function () {
    var compiler = function () { };
    compiler.Compiler = function (node, file) { return ''; };
    return compiler;
})();
processor.use(plugin);
processor.use(plugin).use(plugin);
processor.use(plugin, settings);
processor.use([plugin, plugin]);
processor.use([plugin]);
processor.use([plugin, settings]);
processor.use([
    [plugin, settings],
    [plugin, settings]
]);
processor.use(parserPlugin);
processor.use(parserPlugin).use(parserPlugin);
processor.use(parserPlugin, settings);
processor.use([parserPlugin, plugin]);
processor.use([parserPlugin]);
processor.use([parserPlugin, settings]);
processor.use([
    [parserPlugin, settings],
    [parserPlugin, settings]
]);
processor.use(compilerPlugin);
processor.use(compilerPlugin).use(compilerPlugin);
processor.use(compilerPlugin, settings);
processor.use([compilerPlugin, plugin]);
processor.use([compilerPlugin]);
processor.use([compilerPlugin, settings]);
processor.use([
    [compilerPlugin, settings],
    [compilerPlugin, settings]
]);
processor.use(typedPlugin);
processor.use(typedPlugin).use(typedPlugin);
processor.use(typedPlugin, typedSetting);
// NOTE: in tuple/array form settings are not able to be type checked
processor.use([typedPlugin, typedSetting]);
processor.use([
    [typedPlugin, typedSetting],
    [typedPlugin, typedSetting]
]);
processor.use([
    [plugin, settings],
    [typedPlugin, typedSetting]
]);
processor.use([typedPlugin]);
processor.use([typedPlugin, typedSetting, settings]);
processor.use([typedPlugin, settings]);
processor.use(implicitlyTypedPlugin);
processor.use(implicitlyTypedPlugin).use(implicitlyTypedPlugin);
processor.use(implicitlyTypedPlugin, typedSetting);
// NOTE: in tuple/array form settings are not able to be type checked
processor.use([implicitlyTypedPlugin, typedSetting]);
processor.use([
    [implicitlyTypedPlugin, typedSetting],
    [implicitlyTypedPlugin, typedSetting]
]);
processor.use([
    [plugin, settings],
    [implicitlyTypedPlugin, typedSetting]
]);
processor.use([implicitlyTypedPlugin]);
processor.use([implicitlyTypedPlugin, settings]);
processor.use([implicitlyTypedPlugin, typedSetting, settings]);
processor.use(transformerPlugin);
processor.use([transformerPlugin, transformerPlugin]);
processor.use(transformerPlugin, typedSetting);
// $ExpectError
processor.use(transformerPlugin, settings);
processor.use(pluginWithTwoSettings);
processor.use(pluginWithTwoSettings).use(pluginWithTwoSettings);
processor.use(pluginWithTwoSettings, processor, typedSetting);
processor.use(pluginWithTwoSettings, processor);
// NOTE: in tuple/array form settings are not able to be type checked
processor.use([pluginWithTwoSettings, processor, settings]);
processor.use([pluginWithTwoSettings, processor, typedSetting]);
processor.use([pluginWithTwoSettings, processor]);
processor.use([
    [pluginWithTwoSettings, processor, typedSetting],
    [pluginWithTwoSettings, processor, typedSetting]
]);
processor.use([
    [plugin, settings],
    [pluginWithTwoSettings, processor, typedSetting]
]);
processor.use([pluginWithTwoSettings]);
// $ExpectError
processor.use(typedPlugin, settings);
// $ExpectError
processor.use(typedPlugin, typedSetting, settings);
// $ExpectError
processor.use(implicitlyTypedPlugin, settings);
// $ExpectError
processor.use(implicitlyTypedPlugin, typedSetting, settings);
// $ExpectError
processor.use(pluginWithTwoSettings, typedSetting);
// $ExpectError
processor.use(pluginWithTwoSettings, typedSetting);
// $ExpectError
processor.use(pluginWithTwoSettings, processor, settings);
// $ExpectError
processor.use({});
// $ExpectError
processor.use(false);
// $ExpectError
processor.use(true);
// $ExpectError
processor.use('alfred');
// $ExpectError
processor.use([false]);
// $ExpectError
processor.use([true]);
// $ExpectError
processor.use(['alfred']);
processor.use({
    // $ExpectError
    plugins: false
});
processor.use({
    // $ExpectError
    plugins: { foo: true }
});
processor.use({
    plugins: []
});
processor.use({
    settings: {}
});
processor.use({
    plugins: [plugin]
});
processor.use({
    plugins: [plugin, plugin]
});
processor.use({
    plugins: [
        [plugin, settings],
        [plugin, settings]
    ]
});
processor.use({
    plugins: [
        {
            plugins: [plugin]
        }
    ]
});
/**
 * `processor.parse`
 */
nodeValue = processor.parse(vfile());
processor.parse('random string');
processor.parse(Buffer.from('random buffer'));
/**
 * `processor.Parser`
 */
processor.Parser = function (text, file) { return ({
    type: 'random node'
}); };
processor.Parser = /** @class */ (function () {
    function CustomParser(text, file) {
        // Nothing.
    }
    CustomParser.prototype.parse = function () {
        return {
            type: 'random node'
        };
    };
    return CustomParser;
}());
/**
 * `processor.stringify`
 */
stringValue = processor.stringify(nodeValue);
/**
 * `processor.Compiler`
 */
processor.Compiler = function (node, file) {
    return 'random string';
};
processor.Compiler = /** @class */ (function () {
    function CustomCompiler(node, file) {
        // Nothing.
    }
    CustomCompiler.prototype.compile = function () {
        return 'random string';
    };
    return CustomCompiler;
}());
/**
 * `processor.run`
 */
processor.run(nodeValue).then(function (transFormedNode) {
    nodeValue = transFormedNode;
});
processor.run(nodeValue, vfile());
var runCallback = function (error, node, file) { };
processor.run(nodeValue, runCallback);
// $ExpectError
processor.run(nodeValue, runCallback).then(function () { });
// $ExpectError
processor.run(nodeValue, vfile(), runCallback).then(function () { });
/**
 * `processor.runSync`
 */
nodeValue = processor.runSync(nodeValue);
processor.runSync(nodeValue, vfile());
/**
 * `processor.process`
 */
processor.process(vfile()).then(function (file) {
    fileValue = file;
});
processor.process('random string');
processor.process(Buffer.from('random buffer'));
var processCallback = function (error, node) { };
processor.process(vfile(), processCallback);
// $ExpectError
processor.process(vfile(), processCallback).then(function () { });
/**
 * `processor.processSync`
 */
fileValue = processor.processSync(vfile());
processor.processSync('random string');
processor.processSync(Buffer.from('random buffer'));
/**
 * `processor.data`
 */
processor.data('random key', {});
processor.data('random key', {}).data('random key2', {});
var unknownValue = processor.data('random key');
// $ExpectError
processor.data('random key').data('random key2', {});
unknownValue = processor.data().randomKey;
/**
 * `processor.freeze`
 */
var frozenProcessor = processor.freeze();
// $ExpectError
frozenProcessor.use(plugin);
var remark = unified()
    .use(function () { })
    .freeze();
remark.parse('# Hello markdown');
remark()
    .use({ settings: { gfm: true } })
    // $ExpectError
    .use({ settings: { dne: true } });
remark()
    // $ExpectError
    .use({ settings: { dne: true } })
    .use({ settings: { gfm: true } });
remark().use(function () {
    this
        // $ExpectError
        .use({ settings: { dne: true } })
        .use({ settings: { gfm: true } });
    this.use({ settings: { gfm: true } })
        // $ExpectError
        .use({ settings: { dne: true } });
});
// $ExpectError
remark.use({});
