function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

function getUrlParams(qs, sep, eq, options) {
    sep = sep || '&';
    eq = eq || '=';
    var obj = {};

    if (typeof qs !== 'string' || qs.length === 0) {
        return obj;
    }

    var regexp = /\+/g;
    qs = qs.split(sep);

    var maxKeys = 1000;
    if (options && typeof options.maxKeys === 'number') {
        maxKeys = options.maxKeys;
    }

    var len = qs.length;
    // maxKeys <= 0 means that we should not limit keys count
    if (maxKeys > 0 && len > maxKeys) {
        len = maxKeys;
    }

    for (var i = 0; i < len; ++i) {
        var x = qs[i].replace(regexp, '%20'),
            idx = x.indexOf(eq),
            kstr, vstr, k, v;

        if (idx >= 0) {
            kstr = x.substr(0, idx);
            vstr = x.substr(idx + 1);
        } else {
            kstr = x;
            vstr = '';
        }

        k = decodeURIComponent(kstr);
        v = decodeURIComponent(vstr);

        if (!hasOwnProperty(obj, k)) {
            obj[k] = v;
        } else if (Array.isArray(obj[k])) {
            obj[k].push(v);
        } else {
            obj[k] = [obj[k], v];
        }
    }

    return obj;
};


tinymce.PluginManager.add('outputfield', function(editor, url) {
    var self = this;
    self.openMergeSelector = openMergeSelector;

    function openMergeSelector() {
        editor.windowManager.open({
            title: 'Insert Field',
            body: [
                {
                    type: 'container',
                    name: 'container-name',
                    html: '<div class="merge-selector"></div>'
                }
            ],
            onPostRender: function(e, f) {
                $('.merge-selector').mergeSelector();
            },
            width: 700,
            height:500,
            buttons: [{
                text: 'Select Field',
                onclick: function(e) {
                    var params = editor.windowManager.getParams();
                    console.log(params);
                }
            }],
            onSubmit: function(e) {
                var params = editor.windowManager.getParams();
                console.log(params);
            }
        }, {
            mergeObject: 'ls3__Registration__c',
            mergeField: 'id'
        });
    }


    // Add a button that opens a window
    editor.addButton('outputfield', {
        text: 'Insert Field',
        icon: false,
        onclick: openMergeSelector
    });

    editor.addCommand('selectField', openMergeSelector);
});