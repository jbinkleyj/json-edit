/*global define*/
(function (root, factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function () {
            // Also create a global in case some scripts
            // that are loaded still are looking for
            // a global even when an AMD loader is in use.
            return (root.NsGen = factory());
        });
    } else {
        // Browser globals
        root.NsGen = factory();
    }
}(this, function () {
    "use strict";
    var cons, globalCount = 0;

    cons = {
        id: function (prefix) {
            var id = (prefix || "") + globalCount;
            globalCount += 1;

            return id;
        },
        namespace: function (prefix, sep, count, inc) {
            var num = globalCount;
            globalCount += 1;

            sep = sep || "-";
            count = count || 0;
            inc = inc || 1;

            function nextCount() {
                var next = count;
                count += inc;

                return next;
            }

            function cls(suffix) {
                return prefix + sep + suffix;
            }

            function id(suffix, omitCount, count) {
                if (count === undefined) {
                    count = nextCount();
                }

                var countSuffix = (omitCount) ? "" : sep + count;
                return prefix + num + sep + suffix + countSuffix;
            }

            // return a function that can take a list of args as first parameter
            // or spliced, if it takes just one argument and is an array use that
            // as the list, otherwise collect the arguments and use that as the list
            // examples:
            //  foo([1,2,3]) === foo(1,2,3)
            function dualVarArgs(fun) {
                return function () {
                    var args = $.makeArray(arguments);

                    // if it's just one argument and is an array then take the
                    // array as the list of arguments
                    // otherwise use all the arguments as the list of arguments
                    if (args.length === 1 && $.isArray(args[0])) {
                        args = args[0];
                    }

                    return fun(args);
                };
            }

            return {
                nextCount: nextCount,
                id: id,
                $id: function (suffix, omitCount, count) {
                    return "#" + id(suffix, omitCount, count);
                },
                cls: cls,
                $cls: function (suffix) {
                    return "." + cls(suffix);
                },
                classesList: dualVarArgs(function (suffixes) {
                    return $.map(
                        suffixes,
                        function (suffix) {
                            return cls(suffix);
                        }
                    );
                }),
                // return a string with classes separated by spaces
                classes: function () {
                    return this.classesList.apply(this, arguments).join(" ");
                },
                _reset: function (value) {
                    count = value || 0;
                },
                base: function () {
                    return prefix;
                },
                idbase: function () {
                    return prefix + num;
                }
            };
        }
    };

    return cons;
}));
