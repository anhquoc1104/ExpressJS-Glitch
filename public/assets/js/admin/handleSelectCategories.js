let countriesArray = $.map(categories, function (value, key) {
    return { value: value, data: key };
});

// Initialize ajax autocomplete:
$("#category").autocomplete({
    // serviceUrl: '/autosuggest/service/url',
    lookup: countriesArray,
    lookupFilter: function (suggestion, originalQuery, queryLowerCase) {
        let re = new RegExp(
            "\\b" +
                $.Autocomplete.utils.escapeRegExChars(
                    change_alias(queryLowerCase)
                ),
            "gi"
        );
        return re.test(change_alias(suggestion.value));
    },
    onSelect: function (suggestion) {
        $("#selction-ajax").html(
            "You selected: " + suggestion.value + ", " + suggestion.data
        );
    },
    onHint: function (hint) {
        $("#autocomplete-ajax-x").val(hint);
    },
    onInvalidateSelection: function () {
        $("#selction-ajax").html("You selected: none");
    },
});
