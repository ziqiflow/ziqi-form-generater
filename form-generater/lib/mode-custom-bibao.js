ace.define('ace/mode/custom_formula', function(require, exports, module) {
    const oop = require('ace/lib/oop');
    const TextMode = require('ace/mode/text').Mode;
    const Tokenizer = require('ace/tokenizer').Tokenizer;
    const CustomHighlightRules = require('ace/mode/custom_formula_highlight_rules').CustomHighlightRules;

    const Mode = function() {
        this.HighlightRules = CustomHighlightRules;
    };

    oop.inherits(Mode, TextMode);

    (function() {
        this.$id = 'ace/mode/custom_formula';
    }).call(Mode.prototype);

    exports.Mode = Mode;
});

ace.define('ace/mode/custom_formula_highlight_rules', function(require, exports, module) {
    const oop = require('ace/lib/oop');
    const TextHighlightRules = require('ace/mode/text_highlight_rules').TextHighlightRules;

    const CustomHighlightRules = function() {
        this.$rules = {
            start: [
                {
                    token: 'custom_paren_bibao',
                    regex: '[\\[\\]\\(\\)\\{\\}\\<\\>]'
                },
                {
                    token: 'custom_special',
                    regex: '@\\[.+?\\]'//效果：@[报销项目_1556848736000_27452]
                },
                {
                    token: 'custom_self_define_function',
                    regex: '#C\\[.+?\\]'//效果： //#C[当前审批人_1685774578_15827]()
                },
                {
                    token: 'custom_function_name',//远程函数
                    regex: '#\\[[^\\]]+\\]'//#[转为简单进销存商品字段]()
                },
                {
                    token: 'custom_local_function_name',
                    regex: '\\$\\[[^\\]]+\\]'//$[百分比转数字]()
                },
                {
                    token: 'custom_string',//普通连续字符串
                    regex: '[^\\(\\)\\[\\]\\{\\}@#$%^&*<>~`\\s]+'
                },

            ]
        };
    };

    oop.inherits(CustomHighlightRules, TextHighlightRules);

    exports.CustomHighlightRules = CustomHighlightRules;
});

//------------ json -------------------


ace.define('ace/mode/custom_jsonformula', function(require, exports, module) {
    const oop = require('ace/lib/oop');
    const JsonMode = require('ace/mode/json').Mode;
    const Tokenizer = require('ace/tokenizer').Tokenizer;
    const CustomHighlightRules = require('ace/mode/custom_jsonformula_highlight_rules').CustomHighlightRules;
    //const Validator = require('jsonschema').Validator;

    const Mode = function() {
        this.HighlightRules = CustomHighlightRules;
        // this.$tokenizer = new Tokenizer(this.HighlightRules.getRules());
    };

    oop.inherits(Mode, JsonMode);

    (function() {
        this.$id = 'ace/mode/custom_jsonformula';
        this.checkOutdent = function(line, input) {
            if (!/^\s+$/.test(line)) return false;
            return /^\s*\}/.test(input);
        };
/*        this.validate = function(json) {

            const v = new Validator();
            const schema = {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    age: { type: 'number', minimum: 18 },
                    email: { type: 'string', format: 'email' },
                    address: {
                        type: 'object',
                        properties: {
                            street: { type: 'string' },
                            city: { type: 'string' },
                            state: { type: 'string' },
                            zip: { type: 'string', pattern: '^\\d{5}(?:[-\\s]\\d{4})?$' }
                        }
                    }
                },
                required: ['name', 'age', 'email', 'address']
            };
            console.log('abc',json)
            const result = v.validate(json, schema);
            return result.errors;
        };*/
    }).call(Mode.prototype);

    exports.Mode = Mode;
});



ace.define('ace/mode/custom_jsonformula_highlight_rules', function(require, exports, module) {
    const oop = require('ace/lib/oop');
    const TextHighlightRules = require('ace/mode/text_highlight_rules').TextHighlightRules;

    const CustomHighlightRules = function() {
        this.$rules = {
            start: [
                {
                    token: 'custom_paren_bibao',
                    regex: '[\\[\\]\\(\\)\\{\\}\\<\\>]'
                },
                {
                    token: 'custom_special',
                    regex: '@\\[.+?\\]'//效果：@[报销项目_1556848736000_27452]
                },
                {
                    token: 'custom_self_define_function',
                    regex: '#C\\[.+?\\]'//效果： //#C[当前审批人_1685774578_15827]()
                },
                {
                    token: 'custom_function_name',//远程函数
                    regex: '#\\[[^\\]]+\\]'//#[转为简单进销存商品字段]()
                },
                {
                    token: 'custom_local_function_name',
                    regex: '\\$\\[[^\\]]+\\]'//$[百分比转数字]()
                },
                {
                    token: 'custom_string',//普通连续字符串
                    regex: '[^\\(\\)\\[\\]\\{\\}@#$%^&*<>~`\\s]+'
                },

            ]
        };
    };

    oop.inherits(CustomHighlightRules, TextHighlightRules);

    exports.CustomHighlightRules = CustomHighlightRules;
});
