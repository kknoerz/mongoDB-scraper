
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

function getResults(){
  $('#results').empty();
  $.getJSON('/articles', function(data) {
    for (var i = 0; i<data.length; i++){
      // debugger;
      var content = data[i].content;
      var findLink = content.replace(/Read More...$/g, ' ');//Why isn't this working!!!?!?!
      $('#results').append('<div class="smashing-article" data-id=' +data[i]._id+ '>' + '<h1 class="smashing-title">' +data[i].title+ '</h1>' + '<p class="smashing-content" data-id=smashing-'+i+'>' + findLink + '<span id=smashing-link'+i+'></span><span id=back>X</span></p></div>');
      $('#smashing-link'+i).append('<a href="' +data[i].link+ '" target="_blank">Read More');
    }
  });
}

function initScrape() {
  $.getJSON('/scrape', function(){});
}

function goBack(){
  getResults();
  $('#article').empty();
  $('#title').val('');
  $('#note').val('');
  $('#actionbutton').html('<button id="makenew">Submit</button>');
}

$(document).ready(function(){
  initScrape();
  getNotes();
});


$(document).on('click', '#get-smashed', function(){
  getResults();
});

$(document).on('click', '#back', function(){
  goBack();
});



$(document).on('click', '#makenew' function(){
  $.ajax({
    type: "POST",
    dataType: "json",
    url: '/submit',
    data: {
      article: $('#article').text(),
      title: $('#title').val(),
      note: $('#note').val(),
      body: $('.current').text(),
      created: Date.now()
    }
  })
  .done(function(){
    getNotes();
  });
});

$(document).on('click', '#clearall' function(){
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
      $('#results').empty();
      data.body = data.body.replace('Read MoreX', '')
      $('#results').append($('<p class="smashing-article">').text(data.body));
      $('#results').append($('<button>').attr('id', 'back').html('back'));
      $('#article').text(data.article);
      $('#note').val(data.note);
      $('#title').val(data.title);
      $('#actionbutton').html('<button id="updater" data-id="'+ data._id +'">Update</button>');
    }
  });
});

$(document).on('click', '#updater', function(){
  var selected = $(this);
  // console.log(selected);
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

  // $('#results').text('');
  var selected = $(this).children('p.smashing-content');
  // $('#results').append($('<div class=.smashing-article>').text(selected));
  if($(selected).css('display') == 'none') {
    $(selected).css('display', 'unset');
    $(selected).addClass('current');
  }else{
    $(selected).removeClass('current');
    $(selected).css('display', 'none');

  }

});
