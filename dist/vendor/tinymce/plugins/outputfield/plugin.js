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
                $('.merge-selector').mergeSelector({
                    object: 'ls3__Registration__c'
                });
            },
            width: 700,
            height:400,
            buttons: [{
                text: 'Select Field',
                onclick: function(e) {
                    var fieldHtml = $('.merge-selector').mergeSelector('toHTML');
                    console.log('fieldHtml = ' + fieldHtml);
                    editor.execCommand('mceInsertContent', false, fieldHtml);
                    editor.windowManager.close();
                }
            }]
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