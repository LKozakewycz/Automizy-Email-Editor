!function(t){"use strict";function e(t,e){return function(o){o.target&&o.target.matches(t)&&e.apply(this,arguments)}}Element.prototype.matches||(Element.prototype.matches=Element.prototype.matchesSelector||Element.prototype.mozMatchesSelector||Element.prototype.msMatchesSelector||Element.prototype.oMatchesSelector||Element.prototype.webkitMatchesSelector||function(t){for(var e=(this.document||this.ownerDocument).querySelectorAll(t),o=e.length;--o>=0&&e.item(o)!==this;);return o>-1}),t.addDynamicEventListener=function(t,o,n,r,c){t.addEventListener(o,e(n,r),c)}}(this);

(function() {
    $AEE.init().open();

    addDynamicEventListener(document, 'click', 'ls\\:outputfield', function(e) {
        tinymce.editors[0].plugins.outputfield.openMergeSelector();
    }, true);
})();