tinymce.PluginManager.add('outputfield', function(editor, url) {
    var self = this;
    self.openMergeSelector = openMergeSelector;

    function openMergeSelector() {
        editor.windowManager.open({
            title: 'Insert Field',
            url: 'mergeselector.html',
            width: 700,
            height:500,
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