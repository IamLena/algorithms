//open the file, read text data
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "coma-table.csv",
        dataType: "text",
        success: function(data) {processData(data);}
    });
});


