/*
 Problem: When user submit a search, nothing happens.
 Solution: Use ajax to retrieve photos from flickr matching the user's query
 */

var $searchForm = $('form');
var $formInput = $('form input');
var $thumb = $('li');
var photoObjects = [];
var $close = $('.ion-close');
var scrollPosition;

// [p1, text1, p2, text2, p3] ==> p3
function getDescription(str) {
  console.log(str);
  if (str.length === 5) {
    str = str[4].innerHTML;
  } else {
    str = "";
  }
  return str;
}

function getTitle(str) {
  var maxLength = 21;
  if (str.length > maxLength && $(window).width() <= 699) {
    str = str.substring(0, maxLength) + '...';
  }
  return str;

}

// julian@example.com (Julian) ==> Julian
function getAuthor(str) {
  var newStr = '';
  str = str.split('');
  for (var i = 0, j = str.length; i < j; i += 1 ) {
    if (str[i]!== '(' && Array.isArray(str)) {
      str[i] = str[i].replace(str[i], '');
      continue;
    }
    if (str[i] === '(') {
      str = str.join('');
      newStr = str;
    }
    newStr = newStr.split('');
    for (var x = 0, y = newStr.length; x < y; x += 1) {
      if (newStr[x] === '(' || newStr[x] === ')') {
        newStr[x] = newStr[x].replace(newStr[x], '');
      }
    }
    newStr = newStr.join('');
    return newStr;
  }
}


function ajaxRequest(e) {
  photoObjects = [];
  var query = $formInput.val();
  var url = 'https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?';
  var flickrOptions = {
    tags: query,
    format: "json"
  }
  function getImages(data) {
    var galleryUL = $('<ul class="gallery-list"></ul>');

    $.each(data.items, function(index, photo) {

      var single = $('<li class="thumb-li"><a href="#"><img class="thumb-img" src="' + photo.media.m + '"></a></li>');
      galleryUL.append(single);
      var photoObject = {
        'title': photo.title,
        'link': photo.link,
        'author': photo.author,
        'description': photo.description,
        'src': photo.media.m
      }
      photoObjects.push(photoObject);
    });
    $('.gallery-section').html(galleryUL);

    console.log(photoObjects);
  }
  $.getJSON(url, flickrOptions, getImages);
  e.preventDefault();
}

$searchForm.submit(ajaxRequest);

$('body').on('click', '.thumb-li', function (e) {

  e.preventDefault();
  var $details = $('<div id="details"></div>');
  var $titleDiv = $('<div class="details-title"></div>');

  if (photoObjects[$(this).index()].title === "") {
    var $titleH1 = $('<h1>Untitled</h1>');
  } else {
    var $titleH1 = $('<h1>' + getTitle(photoObjects[$(this).index()].title) + '</h1>');
  }

  var $close = $('<i class="ion-close"></i>');

  var $thumbUl = $('<ul class="gallery-list details-list"></ul>');
  var $thumbLi = $('<li class="thumb-li"></li>');
  var $thumbA = $('<a href="#"></a>');
  var $thumbImg = $('<img class="thumb-img" src="' + photoObjects[$(this).index()].src + '"></img>');

  var $infoDiv = $('<div class="info"></div>');
  var $authorDiv = $('<div class="author"></div>');
  var $authorIcon = $('<i class="ion-android-person"></i>');
  var $authorSpan = $('<span>' + getAuthor(photoObjects[$(this).index()].author) + '</span>');
  var $linkImg = $('<a href="' + photoObjects[$(this).index()].link + '"></a>');
  var $linkIcon = $('<i class="ion-link"></i>');

  var $descriptionStr = $(photoObjects[$(this).index()].description);
  var $description = $('<p class="description"></p>');

  //append title, img, infoDiv, description to $details
  $details.append($titleDiv);
  $details.append($thumbUl);
  $details.append($infoDiv);
  $details.append($description);

  //append h1 and close to $titleDive
  $titleDiv.append($titleH1);
  $titleDiv.append($close);

  //append (ul>)li>a>img to $thumbUl
  $thumbUl.append($thumbLi);
  $thumbLi.append($thumbA);
  $thumbA.append($thumbImg);

  //append authorDiv and linkImg to $infoDiv
  //append authorIcon and authorSpan to authorDiv. linkIcon to linkImg
  $infoDiv.append($authorDiv);
  $infoDiv.append($linkImg);
  $authorDiv.append($authorIcon);
  $authorDiv.append($authorSpan);
  $linkImg.append($linkIcon);

  $description.append(getDescription($descriptionStr));

  $('body').append($details);
  //save scrollposition
  scrollPosition = $(window).scrollTop();

  e.preventDefault();
  $details.show();
  $('.form-container').hide();
  $('.container').hide();

});


$('body').on('click', '.ion-close', function(event) {
  $('#details').remove();
  $('.form-container').show();
  $('.container').show();

  //put scroll where left off
  $(window).scrollTop(scrollPosition);
});
