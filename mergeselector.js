(function () {

    /**
     * Get the currently selected field
     *
     * @return {*} the currently selected field as a string
     */
    function getSelectedField() {
        return $('input[name="merge-field"]').val();
    }


    /**
     * Set the field value currently selected
     *
     * @param val the value to set
     */
    function setSelectedField(val) {
        $('input[name="merge-field"]').val(val);
    }


    /**
     * Get the full HTML for the merge field as an outputField
     *
     * @param field the field to convert to an outputField
     * @return {string} the outputField html string
     */
    function toHTML(field) {
        return `<ls:outputField contenteditable="false">{!${field}}</ls:outputField>`;
    }


    /**
     * Get the merge object information and the list of fields associated.
     *
     * @param mergeObject the api name of the merge object to fetch fields from
     */
    function getObjectFields(mergeObject) {
        Visualforce.remoting.Manager.invokeAction(
            'ls3.FieldSelectController.getObjectFields',
            mergeObject,
            function (result, event) {
                if (event.status) {
                    var obj = result.object;
                    var fields = result.fields;

                    $('#merge-object-name')
                        .text(`${obj.label} (${obj.name})`);

                    var options = fields.map(function(f) {
                        return options.push(
                            $j('<div/>').text(f.label).val(f.name)
                        );
                    });

                    $('#merge-field-options')
                        .clear()
                        .append(options);
                } else if (event.type === 'exception') {
                    console.error(event.message);
                } else {
                    console.error(event.message);
                }
            }
        );
    }


    /**
     * When the DOM content has loaded, initialize the field selector
     */
    document.addEventListener('DOMContentLoaded', function () {
        var args = top.tinymce.activeEditor.windowManager.getParams();
        setSelectedField(args.mergeField);

        document.getElementById('select-button').addEventListener('click', function () {
            top.tinymce.activeEditor.execCommand('mceInsertContent', false, toHTML(getSelectedField()));
            top.tinymce.activeEditor.windowManager.close();
        });

        getObjectFields(args.mergeObject);
    });

})();