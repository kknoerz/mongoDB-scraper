$('#article').text('');
$('#article').text($(this).children('h1.smashing-title').text());
var selected = $(this).children('p.smashing-content');

$('#results').empty();
$(selected).addClass('smashing-article')
$('#results').append($(selected).text());

$('#results').append($('<button>').attr('id', 'back').html('back'));
