(function($) {
    var _iCheck = 'iCheck',
        selectorMap = {
            checkbox: {
                hover: "chover",
                check: "cchecked",
                type: "checkbox"
            },
            radio: {
                hover: "rhover",
                check: "rchecked",
                type: "radio"
            }
        },
        $cbox,
        $radiobox,
        _type = 'type',
        _label = 'label';

    $.fn[_iCheck] = function(options) {
        var settings = $.extend({
            labelHover: true
        }, options),
            boxskill = !! settings.skill;
            labelHover = !! settings.labelHover;

        var walker = function(object) {
            object.each(function() {
                var self = $(this);
                var selector =  self.attr("type");
                var node = this;
                var id = node.id;
                var label =_label + '[for="' + id + '"]';
                var className = selectorMap[selector].type;
                $(this).wrap('<div class="' + className + '"></div>');
                $("#" + id+","+label).on("click mouseenter mouseleave", function(event) {
                    var type = event[_type];
                    if (type === "click") {
                        operate(self, selector);
                    }else if (labelHover) {
                        HoverHandle(self, type, selector);
                    }
                });
            });
        };
        walker(this);
        cbox = $(".checkbox input");
        radiobox = $(".radio input");
        $("input:checked").trigger("click");
    };

    function HoverHandle(self, type, selector) {
        if (/ve/.test(type)) {
            self.parent().removeClass(selectorMap[selector].hover);
        } else {
            self.parent().addClass(selectorMap[selector].hover);
        }
    }

    function operate(input, selector) {
        var node = input[0];
        state = node["checked"];
        if (state) {
            $(input).parent().addClass(selectorMap[selector].check);
        }
        cbox.change(function(e) {
            $(this).parent().addClass("cchecked");
            if (!$(this)[0].checked) {
                $(this).parent().removeClass("cchecked");
            }
        });

        radiobox.change(function(e) {
            $(this).parent().addClass("rchecked");
            radiobox.not(":checked").parent().removeClass("rchecked");
        });
    }

})(jQuery);