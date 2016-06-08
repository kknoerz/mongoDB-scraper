
function getNotes(){
  $('#all-notes').empty();
  $.getJSON('/notes', function(data) {
    for (var i = 0; i<data.length; i++){
      console.log(data);
      // debugger;
      $('#all-notes').prepend('<p id="dataentry" data-id=' +data[i]._id+ '>' + data[i].title + '<span class=deleter>X</span></p>');
      $('#note').val("");
      $('#title').val("");
      $('#article').text('');
    }
  });
}

function initScrape() {
  $.getJSON('/scrape', function(){});
}

$(document).ready(function(){
  initScrape();
  getNotes();
});


$(document).on('click', '#get-smashed', function(){
  function getResults(){
    $('#results').empty();
    $.getJSON('/articles', function(data) {
      for (var i = 0; i<data.length; i++){
        // debugger;
        var content = data[i].content;
        var findLink = content.replace(/Read more...$/g, ' ');//Why isn't this working!!!?!?!
        // console.log('content: ', content);
        // console.log('findLink: ', findLink);
        $('#results').append('<div class="smashing-article" data-id=' +data[i]._id+ '>' + '<h1 class="smashing-title">' +data[i].title+ '</h1>' + '<p class="smashing-content" data-id=smashing-'+i+'>' + findLink + '<span id=smashing-link'+i+'></span><span class=deleter>X</span></p></div>');
        $('#smashing-link'+i).append('<a href="' +data[i].link+ '" target="_blank">Read More');
      }
    });
  }
  getResults();
});


$('#makenew').on('click', function(){
  $.ajax({
    type: "POST",
    dataType: "json",
    url: '/submit',
    data: {
      article: $('#article').text(),
      title: $('#title').val(),
      note: $('#note').val(),
      created: Date.now()
    }
  })
  .done(function(){
    getNotes();
  });
});

$('#clearall').on('click', function(){
  $.ajax({
    type: "GET",
    dataType: "json",
    url: '/clearall',
    success: function(response){
      console.log(response);
      $('#results').empty();
    }
  });
});

$(document).on('click', '.deleter', function(){
  var selected = $(this).parent();
  $.ajax({
    type: "GET",
    url: '/delete/' + selected.data('id'),
    success: function(response){
      console.log(response);
      selected.remove();
    }
  });
});

$(document).on('click', '#dataentry', function(){
  var selected = $(this);
  console.log(selected);
  $.ajax({
    type: "GET",
    url: '/find/' + selected.data('id'),
    success: function(data){
      $('#article').text(data.article);
      $('#note').val(data.note);
      $('#title').val(data.title);
      $('#actionbutton').html('<button id="updater" data-id="'+ data._id +'">Update</button>');
    }
  });
});

$(document).on('click', '#updater', function(){
  var selected = $(this);
  console.log(selected);
  $.ajax({
    type: "POST",
    url: '/update/' + selected.data('id'),
    dataType:"json",
    data: {
      title: $('#title').val(),
      note: $('#note').val()
    },
    success: function(data){
      $('#note').val("");
      $('#title').val("");
      $('#actionbutton').html('<button id="makenew">Submit</button>');
    }
  });
});

$(document).on('click', '.smashing-article', function(){

  $('#article').text('');
  $('#article').text($(this).children('h1.smashing-title').text());
  var selected = $(this).children('p.smashing-content');
  if($(selected).css('display') == 'none') {
    $(selected).css('display', 'unset');
  }else{
    $(selected).css('display', 'none');
  }

});
