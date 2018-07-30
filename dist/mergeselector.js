(function(){
    function getSelectedField() {
        return document.querySelector('input[name="merge-field"]').value;
    }

    function setSelectedField(val) {
        document.querySelector('input[name="merge-field"]').value = val;
    }

    function toHTML(field) {
        return `<ls:outputField contenteditable="false">{!${field}}</ls:outputField>`;
    }

    document.addEventListener('DOMContentLoaded', function() {
        var args = top.tinymce.activeEditor.windowManager.getParams();
        console.log('ARGUMENTS ---------------------');
        console.log(args);
        setSelectedField(args.mergeField);

        document.getElementById('select-button').addEventListener('click', function(){
            top.tinymce.activeEditor.execCommand('mceInsertContent', false, toHTML(getSelectedField()));
            top.tinymce.activeEditor.windowManager.close();
        });
    });

})();