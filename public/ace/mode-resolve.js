ace.define("ace/mode/resolve", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/tokenizer", "ace/mode/resolve_highlight_rules", "ace/mode/matching_brace_outdent", "ace/range"], function(e, t, n) {
    var r = e("ace/lib/oop"),
        i = e("ace/mode/text").Mode,
        s = e("ace/tokenizer").Tokenizer,
        o = e("ace/mode/resolve_highlight_rules").ResolveHighlightRules,
        u = e("ace/mode/matching_brace_outdent").MatchingBraceOutdent,
        a = e("ace/range").Range,
        f = function() {
            this.$tokenizer = new s((new o).getRules()), this.$outdent = new u
        };
    r.inherits(f, i),
        function() {
            this.toggleCommentLines = function(e, t, n, r) {
                var i = !0,
                    s = /^(\s*)\/\//;
                for (var o = n; o <= r; o++)
                    if (!s.test(t.getLine(o))) {
                        i = !1;
                        break
                    }
                if (i) {
                    var u = new a(0, 0, 0, 0);
                    for (var o = n; o <= r; o++) {
                        var f = t.getLine(o),
                            l = f.match(s);
                        u.start.row = o, u.end.row = o, u.end.column = l[0].length, t.replace(u, l[1])
                    }
                } else t.indentRows(n, r, "//")
            }, this.createWorker = function(e) {
                var t = e.getDocument();
                t.on("annotate", function(t) {
                    e.setAnnotations(t)
                })
            }
        }.call(f.prototype), t.Mode = f
}), ace.define("ace/mode/resolve_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/lib/lang", "ace/mode/doc_comment_highlight_rules", "ace/mode/text_highlight_rules"], function(e, t, n) {
    var r = e("../lib/oop"),
        i = e("../lib/lang"),
        s = e("./doc_comment_highlight_rules").DocCommentHighlightRules,
        o = e("./text_highlight_rules").TextHighlightRules,
        u = function() {
            var e = i.arrayToMap("".split("|")),
                t = i.arrayToMap("".split("|")),
                n = i.arrayToMap("".split("|"));
            this.$rules = {
                start: [{
                    token: "comment",
                    regex: "\\-\\-.*$"
                }, s.getStartRule("doc-start"), {
                    token: "comment",
                    merge: !0,
                    regex: "\\(\\*",
                    next: "comment"
                }, {
                    token: "stringify",
                    regex: "<.+>"
                }, {
                    token: "string.regexp",
                    regex: "[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/]\\w*\\s*(?=[).,;]|$)"
                }, {
                    token: "string",
                    regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
                }, {
                    token: "string",
                    regex: '["].*\\\\$',
                    next: "qqstring"
                }, {
                    token: "string",
                    regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
                }, {
                    token: "string",
                    regex: "['].*\\\\$",
                    next: "qstring"
                }, {
                    token: "constant.numeric",
                    regex: "0[xX][0-9a-fA-F]+\\b"
                }, {
                    token: "constant.numeric",
                    regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
                }, {
                    token: "constant.language.boolean",
                    regex: "(?:true|false)\\b"
                }, {
                    token: function(e) {
                        return checkResolveKeywords(e) ? "keyword" : "identifier"
                    },
                    regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
                }, {
                    token: "keyword.operator",
                    regex: "!|\\$|%|&|\\*|\\-|\\-\\-|\\+\\+|\\+|~|===|=|:=:|:=|/=|!==|<=|>=|<<=|>>=|>>>=|<>|<(?=[0-9\\s])|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|instanceof|new|delete|typeof|void)"
                }, {
                    token: "lparen",
                    regex: "[[({]"
                }, {
                    token: "rparen",
                    regex: "[\\])}]"
                }, {
                    token: "comment",
                    regex: "^#!.*$"
                }, {
                    token: "text",
                    regex: "\\s+"
                }],
                comment: [{
                    token: "comment",
                    regex: ".*?\\*\\)",
                    next: "start"
                }, {
                    token: "comment",
                    regex: ".+"
                }],
                qqstring: [{
                    token: "string",
                    regex: '(?:(?:\\\\.)|(?:[^"\\\\]))*?"',
                    next: "start"
                }, {
                    token: "string",
                    regex: ".+"
                }],
                qstring: [{
                    token: "string",
                    regex: "(?:(?:\\\\.)|(?:[^'\\\\]))*?'",
                    next: "start"
                }, {
                    token: "string",
                    regex: ".+"
                }]
            }, this.embedRules(s, "doc-", [s.getEndRule("start")])
        };
    r.inherits(u, o), t.ResolveHighlightRules = u
}), ace.define("ace/mode/doc_comment_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function(e, t, n) {
    var r = e("../lib/oop"),
        i = e("./text_highlight_rules").TextHighlightRules,
        s = function() {
            this.$rules = {
                start: [{
                    token: "comment.doc.tag",
                    regex: "@[\\w\\d_]+"
                }, {
                    token: "comment.doc",
                    merge: !0,
                    regex: "\\s+"
                }, {
                    token: "comment.doc",
                    merge: !0,
                    regex: "TODO"
                }, {
                    token: "comment.doc",
                    merge: !0,
                    regex: "[^@\\*]+"
                }, {
                    token: "comment.doc",
                    merge: !0,
                    regex: "."
                }]
            }
        };
    r.inherits(s, i), s.getStartRule = function(e) {
        return {
            token: "comment.doc",
            merge: !0,
            regex: "\\/\\*(?=\\*)",
            next: e
        }
    }, s.getEndRule = function(e) {
        return {
            token: "comment.doc",
            merge: !0,
            regex: "\\*\\/",
            next: e
        }
    }, t.DocCommentHighlightRules = s
}), ace.define("ace/mode/matching_brace_outdent", ["require", "exports", "module", "ace/range"], function(e, t, n) {
    var r = e("../range").Range,
        i = function() {};
    (function() {
        this.checkOutdent = function(e, t) {
            return /^\s+$/.test(e) ? /^\s*\}/.test(t) : !1
        }, this.autoOutdent = function(e, t) {
            var n = e.getLine(t),
                i = n.match(/^(\s*\})/);
            if (!i) return 0;
            var s = i[1].length,
                o = e.findMatchingBracket({
                    row: t,
                    column: s
                });
            if (!o || o.row == t) return 0;
            var u = this.$getIndent(e.getLine(o.row));
            e.replace(new r(t, 0, t, s - 1), u)
        }, this.$getIndent = function(e) {
            var t = e.match(/^(\s+)/);
            return t ? t[1] : ""
        }
    }).call(i.prototype), t.MatchingBraceOutdent = i
})