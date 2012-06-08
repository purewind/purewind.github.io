(function(window, undefined) {
     var OTK = (function() {
        var that = {};
        var register = function(ns, maker) {
            var path = ns.split(".");
            var curr = that;
            for (var i = 0,
            len = path.length; i < len; i += 1) {
                if (i == len - 1) {
                    if (curr[path[i]] !== undefined) {
                        throw ns + "has been register!!!"
                    }
                    curr[path[i]] = maker(that);
                    return true
                }
                if (curr[path[i]] === undefined) {
                    curr[path[i]] = {}
                }
                curr = curr[path[i]]
            }
        };
        var E = function(id) {
            if (typeof id === "string") {
                return document.getElementById(id)
            } else {
                return id
            }
        };
        that.register = register;
        that.regShort = function(sname, sfun) {
            if (that[sname] !== undefined) {
                throw sname + ":show has been register"
            }
            that[sname] = sfun
        };
        that.IE = /msie/i.test(navigator.userAgent);
        that.E = E;
        that.C = function(tagName) {
            var dom;
            tagName = tagName.toUpperCase();
            if (tagName == "TEXT") {
                dom = document.createTextNode("")
            } else {
                if (tagName == "BUFFER") {
                    dom = document.createDocumentFragment()
                } else {
                    dom = document.createElement(tagName)
                }
            }
            return dom
        };
        
        return that
    })();
     OTK.register("core.arr.isArray",
    		    function($) {
    		        return function(o) {
    		            return Object.prototype.toString.call(o) === "[object Array]"
    		        }
    		    });
     OTK.register("core.str.trim",
		    function($) {
		        return function(str) {
		            if (typeof str !== "string") {
		                throw "trim need a string as parameter"
		            }
		            if (typeof str.trim === "function") {
		                return str.trim()
		            } else {
		                return str.replace(/^(\u3000|\s|\t|\u00A0)*|(\u3000|\s|\t|\u00A0)*$/g, "")
		            }
		        }
		    });
     OTK.register("core.str.parseURL",
		    function($) {
		        return function(url) {
		            var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+\.[0-9A-Za-z]+)?(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
		            var names = ["url", "scheme", "slash", "host", "port", "path", "query", "hash"];
		            var results = parse_url.exec(url);
		            var that = {};
		            for (var i = 0,
		            len = names.length; i < len; i += 1) {
		                that[names[i]] = results[i] || ""
		            }
		            return that
		        }
		    });
    OTK.register("core.json.queryToJson",
		    function($) {
		        return function(QS, isDecode) {
		            var _Qlist = $.core.str.trim(QS).split("&");
		            var _json = {};
		            var _fData = function(data) {
		                if (isDecode) {
		                    return decodeURIComponent(data)
		                } else {
		                    return data
		                }
		            };
		            for (var i = 0,
		            len = _Qlist.length; i < len; i++) {
		                if (_Qlist[i]) {
		                    _hsh = _Qlist[i].split("=");
		                    _key = _hsh[0];
		                    _value = _hsh[1];
		                    if (_hsh.length < 2) {
		                        _value = _key;
		                        _key = "$nullName"
		                    }
		                    if (!_json[_key]) {
		                        _json[_key] = _fData(_value)
		                    } else {
		                        if ($.core.arr.isArray(_json[_key]) != true) {
		                            _json[_key] = [_json[_key]]
		                        }
		                        _json[_key].push(_fData(_value))
		                    }
		                }
		            }
		            return _json
		        }
		    });
    OTK.register("core.json.jsonToQuery",
		    function($) {
		        var _fdata = function(data, isEncode) {
		            data = data == null ? "": data;
		            data = $.core.str.trim(data.toString());
		            if (isEncode) {
		                return encodeURIComponent(data)
		            } else {
		                return data
		            }
		        };
		        return function(JSON, isEncode) {
		            var _Qstring = [];
		            if (typeof JSON == "object") {
		                for (var k in JSON) {
		                    if (JSON[k] instanceof Array) {
		                        for (var i = 0,
		                        len = JSON[k].length; i < len; i++) {
		                            _Qstring.push(k + "=" + _fdata(JSON[k][i], isEncode))
		                        }
		                    } else {
		                        if (typeof JSON[k] != "function") {
		                            _Qstring.push(k + "=" + _fdata(JSON[k], isEncode))
		                        }
		                    }
		                }
		            }
		            if (_Qstring.length) {
		                return _Qstring.join("&")
		            } else {
		                return ""
		            }
		        }
		    });
    OTK.register("core.util.URL",
		    function($) {
		        return function(sURL) {
		            var that = {};
		            var url_json = $.core.str.parseURL(sURL);
		            var query_json = $.core.json.queryToJson(url_json.query);
		            var hash_json = $.core.json.queryToJson(url_json.hash);
		            that.setParam = function(sKey, sValue) {
		                query_json[sKey] = sValue;
		                return this
		            };
		            that.getParam = function(sKey) {
		                return query_json[sKey]
		            };
		            that.setParams = function(oJson) {
		                for (var key in oJson) {
		                    that.setParam(key, oJson[key])
		                }
		                return this
		            };
		            that.setHash = function(sKey, sValue) {
		                hash_json[sKey] = sValue;
		                return this
		            };
		            that.getHash = function(sKey) {
		                return hash_json[sKey]
		            };
		            that.valueOf = that.toString = function() {
		                var url = [];
		                var query = $.core.json.jsonToQuery(query_json);
		                var hash = $.core.json.jsonToQuery(hash_json);
		                if (url_json.scheme != "") {
		                    url.push(url_json.scheme + ":");
		                    url.push(url_json.slash)
		                }
		                if (url_json.host != "") {
		                    url.push(url_json.host);
		                    url.push(url_json.port)
		                }
		                url.push("/");
		                url.push(url_json.path);
		                if (query != "") {
		                    url.push("?" + query)
		                }
		                if (hash != "") {
		                    url.push("#" + hash)
		                }
		                return url.join("")
		            };
		            return that
		        }
		    });  
    OTK.register("core.dom.removeNode",
    	    function($) {
    	        return function(node) {
    	            node = $.E(node) || node;
    	            try {
    	                node.parentNode.removeChild(node)
    	            } catch(e) {}
    	        }
    	    });
   
    OTK.register("core.json.jsonToStr",
    	    function($) {
    	        function f(n) {
    	            return n < 10 ? "0" + n: n
    	        }
    	        if (typeof Date.prototype.toJSON !== "function") {
    	            Date.prototype.toJSON = function(key) {
    	                return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z": null
    	            };
    	            String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(key) {
    	                return this.valueOf()
    	            }
    	        }
    	        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    	        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    	        gap, indent, meta = {
    	            "\b": "\\b",
    	            "\t": "\\t",
    	            "\n": "\\n",
    	            "\f": "\\f",
    	            "\r": "\\r",
    	            '"': '\\"',
    	            "\\": "\\\\"
    	        },
    	        rep;
    	        function quote(string) {
    	            escapable.lastIndex = 0;
    	            return escapable.test(string) ? '"' + string.replace(escapable,
    	            function(a) {
    	                var c = meta[a];
    	                return typeof c === "string" ? c: "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice( - 4)
    	            }) + '"': '"' + string + '"'
    	        }
    	        function str(key, holder) {
    	            var i, k, v, length, mind = gap,
    	            partial, value = holder[key];
    	            if (value && typeof value === "object" && typeof value.toJSON === "function") {
    	                value = value.toJSON(key)
    	            }
    	            if (typeof rep === "function") {
    	                value = rep.call(holder, key, value)
    	            }
    	            switch (typeof value) {
    	            case "string":
    	                return quote(value);
    	            case "number":
    	                return isFinite(value) ? String(value) : "null";
    	            case "boolean":
    	            case "null":
    	                return String(value);
    	            case "object":
    	                if (!value) {
    	                    return "null"
    	                }
    	                gap += indent;
    	                partial = [];
    	                if (Object.prototype.toString.apply(value) === "[object Array]") {
    	                    length = value.length;
    	                    for (i = 0; i < length; i += 1) {
    	                        partial[i] = str(i, value) || "null"
    	                    }
    	                    v = partial.length === 0 ? "[]": gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]": "[" + partial.join(",") + "]";
    	                    gap = mind;
    	                    return v
    	                }
    	                if (rep && typeof rep === "object") {
    	                    length = rep.length;
    	                    for (i = 0; i < length; i += 1) {
    	                        k = rep[i];
    	                        if (typeof k === "string") {
    	                            v = str(k, value);
    	                            if (v) {
    	                                partial.push(quote(k) + (gap ? ": ": ":") + v)
    	                            }
    	                        }
    	                    }
    	                } else {
    	                    for (k in value) {
    	                        if (Object.hasOwnProperty.call(value, k)) {
    	                            v = str(k, value);
    	                            if (v) {
    	                                partial.push(quote(k) + (gap ? ": ": ":") + v)
    	                            }
    	                        }
    	                    }
    	                }
    	                v = partial.length === 0 ? "{}": gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}": "{" + partial.join(",") + "}";
    	                gap = mind;
    	                return v
    	            }
    	        }
    	        return function(value, replacer, space) {
    	            var i;
    	            gap = "";
    	            indent = "";
    	            if (typeof space === "number") {
    	                for (i = 0; i < space; i += 1) {
    	                    indent += " "
    	                }
    	            } else {
    	                if (typeof space === "string") {
    	                    indent = space
    	                }
    	            }
    	            rep = replacer;
    	            if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
    	                throw new Error("JSON.stringify")
    	            }
    	            return str("", {
    	                "": value
    	            })
    	        }
    	    });
    OTK.register("core.json.strToJson",
    	    function($) {
		    	return function(data) {
		    		if ( typeof data !== "string" || !data ) {
						return null;
					}
					data = $.core.str.trim( data );
					if ( /^[\],:{}\s]*$/.test(data.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
						.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
						.replace(/(?:^|:|,)(?:\s*\[)+/g, "")) ) {
						return window.JSON && window.JSON.parse ?
							window.JSON.parse( data ) :
							(new Function("return " + data))();
					} else {
						return null;
					}
		        }
    		});
    window.OTK = OTK;
})(window);
