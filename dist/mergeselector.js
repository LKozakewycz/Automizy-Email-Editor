(function ($) {


    function getMockData(objectType) {
        return {
            'ls3__Registration__c': {
                object: {
                    name: 'ls3__Registration__c',
                    label: 'Registration'
                },
                fields: [
                    {label: 'Record ID', name: 'Id'},
                    {label: 'Reference', name: 'Name'},
                    {label: 'Status', name: 'ls3__Status__c'},
                    {label: 'Primary Contact', name: 'ls3__Contact__c'}
                ],
                lookups: [
                    {label: 'Primary Contact', name: 'ls3__Contact__r', object: 'Contact'}
                ]
            },
            'Contact': {
                object: {
                    name: 'Contact',
                    label: 'Contact'
                },
                fields: [
                    {label: 'Record ID', name: 'Id'},
                    {label: 'Full Name', name: 'Name'},
                    {label: 'First Name', name: 'FirstName'},
                    {label: 'Last Name', name: 'LastName'},
                    {label: 'Email', name: 'Email'},
                    {label: 'Account ID', name: 'AccountId'}
                ],
                lookups: [
                    {label: 'Account', name: 'Account', object: 'Account'}
                ]
            },
            'Account': {
                object: {
                    name: 'Account',
                    label: 'Account'
                },
                fields: [
                    {label: 'Record ID', name: 'Id'},
                    {label: 'Account Name', name: 'Name'},
                    {label: 'Account Number', name: 'AccountNumber'}
                ]
            }
        }[objectType];
    }


    /**
     * Merge selector container
     */
    $.fn.mergeSelector = function (options) {
        var $this = $(this);

        var methods = {
            /**
             * Update the selected field input
             */
            updateSelectedField: function() {
                var fieldPaths = [];

                $this.find('.field-selector').each(function () {
                    var fieldValue = $(this).data('field-value');
                    console.log('fieldValue = ' + fieldValue);
                    if (fieldValue) {
                        fieldPaths.push(fieldValue);
                    }
                });

                $this.find('#merge-field').val(fieldPaths.join('.'));
            },

            /**
             * Get the currently selected field
             *
             * @return {*}          the currently selected field as a string
             */
            getSelectedField: function() {
                return $('#merge-field').val();
            },

            /**
             * Set the field value currently selected
             *
             * @param val           the value to set
             */
            setSelectedField: function(val) {
                $('#merge-field').val(val);
            },

            /**
             * Get the full HTML for the merge field as an outputField
             *
             * @param field         the field to convert to an outputField
             * @return {string}     the outputField html string
             */
            toHTML: function() {
                return '<ls:outputField contenteditable="false">{!' + methods.getSelectedField() + '}</ls:outputField>';
            }
        };

        if (arguments.length >= 1) {
            if (typeof arguments[0] === 'string' && methods[arguments[0]]) {
                return methods[arguments[0]].apply(Array.prototype.slice.call(arguments, 1));
            }
        }

        if (typeof options === 'object') {
            init(options);
        }


        function init(options) {
            console.log('init');
            console.log(options);

            $this.html('<div class="merge-object-title">'
                + 'Merge Object: <span id="merge-object-name">...</span>'
                + '</div>'
                + '<div class="merge-selector-form">'
                + '     <div class="field-selector field-selector_main"></div>'
                + '</div>'
                + '<div class="merge-field_output">'
                + '     <label>Current Field</label>'
                + '     <input type="text" name="merge-field" id="merge-field" />'
                + '</div>');

            // Initiate the main field selector
            $('.field-selector_main').fieldSelector({
                object: options.object
            });

            $('#merge-field').click(function(){
               $(this).select();
            });

            /*
            var args = top.tinymce.activeEditor.windowManager.getParams();
            setSelectedField(args.mergeField);


            $('select-button').click(function () {
                top.tinymce.activeEditor.execCommand('mceInsertContent', false, toHTML(getSelectedField()));
                top.tinymce.activeEditor.windowManager.close();
            });
            */
        }

        return this;
    };


    /**
     * Field selector object
     */
    $.fn.fieldSelector = function (options) {
        var $this = $(this);


        if (typeof options === 'object') {
            init(options);
        }


        /**
         * Get the merge object information and the list of fields associated.
         *
         * @param mergeObject the api name of the merge object to fetch fields from
         */
        function getObjectFields(mergeObject) {
            if (typeof Visualforce === 'undefined') {
                if (window.location.href.includes('localhost')) {
                    var data = getMockData(mergeObject);

                    handleObjectFieldResults(data, {
                        status: 200
                    });
                } else {
                    console.error('Remoting is unavailable. If you are running via localhost, please start the server now for mock data.');
                }
            } else {
                Visualforce.remoting.Manager.invokeAction(
                    'ls3.FieldSelectController.getObjectFields',
                    mergeObject,
                    handleObjectFieldResults
                );
            }
        }


        /**
         * Handle the result of field selector data retrieval. This will create the select input with options
         * as well as construct images and previews.
         *
         * @param result    the data as a result of the callout
         * @param event     the event results (including status and errors)
         */
        function handleObjectFieldResults(result, event) {
            if (event.status) {
                var obj = result.object;
                var fields = result.fields;
                var lookups = result.lookups;

                $('#merge-object-name')
                    .text(obj.label + ' (' + obj.name + ')');

                var items = [];

                // Child down right icon
                if (!$this.hasClass('field-selector_main')) {
                    items.push(
                        $('<img />').addClass('field-selector_child-arrow').attr('src', 'images/downright.png')
                    );
                }

                // Get field select input
                items.push(getFieldSelect(fields, lookups));
                // Get field API name preview
                items.push($('<span/>').addClass('field-selector_preview'));

                // Append items to field selector container
                $this.append(items);
            } else if (event.type === 'exception') {
                console.error(event.message);
            } else {
                console.error(event.message);
            }
        }

        /**
         * Create a field selector input that includes the fields and lookups options
         *
         * @param fields    list of fields to include ({label: '', name: ''})
         * @param lookups   list of lookups to include ({label: '', name: '', object: ''})
         * @return {*}      select input as jquery object
         */
        function getFieldSelect(fields, lookups) {
            fields = [{label: '- Select Field -', value: ''}].concat(fields);

            var fieldOptions = fields.map(function (f) {
                return $('<option/>').text(f.label).val(f.name);
            });

            if (lookups) {
                var lookupOptions = lookups.map(function (f) {
                    return $('<option/>').text(f.label).val(f.name).data('object', f.object);
                });

                var lookupOptionsGroup = $('<optgroup/>')
                    .attr('label', 'Lookups')
                    .append(lookupOptions);
            }

            var select = $('<select/>')
                .change(handleFieldSelect)
                .append(fieldOptions);

            if (lookupOptionsGroup) {
                select.append(lookupOptionsGroup)
            }

            return select;
        }


        /**
         * Perform operations surrounding the events of a new field selection including
         * updating the selected field, creating child field selectors, etc.
         */
        function handleFieldSelect() {
            var fieldValue = $(this).val();

            // Set the field value and API name preview
            $this.data('field-value', fieldValue);
            $this.find('>.field-selector_preview').text(fieldValue);

            // Remove any child field selectors (because the value has changed)
            $this.find('.field-selector').remove();

            // Update the selected field on the merge selector container
            $this.closest('.merge-selector').mergeSelector('updateSelectedField');

            // If this is a lookup, open up a new child field selector
            if ($(this).find(':selected').data('object')) {
                var objectType = $(this).find(':selected').data('object');

                // Create a new selector
                $('<div/>')
                    .addClass('field-selector')
                    .appendTo($this)
                    .fieldSelector({object: objectType});
            }
        }


        function init(options) {
            getObjectFields(options.object);
        }
    };

})(jQuery);