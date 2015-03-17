$(document).ready(function() {
  var anchor = window.location.hash;
  var root = $('html, body');
  var qabel = $('#qabel')[0];
  var footer = $('footer');

  var section_padding = 220 - 1;
  var section_offset = 58;

  // fixing some heights for fancyness
  root.css('minHeight', $(window).height());
  $(qabel).css('minHeight', $(window).height() - footer.height());
  $('#register, #surveillance').css('minHeight', $(window).height() - footer.height() - section_padding);

  $(window).resize(function() {
    root.css('minHeight', $(window).height());
    $(qabel).css('minHeight', $(window).height() - footer.height());
    $('#register, #surveillance').css('minHeight', $(window).height() - footer.height() - section_padding);
  });

  // resizing of top menu when scrolling down

  var logo = $('#logo-main');
  var logo_img = $('#logo-main img');
  var alpha = $('#alpha');
  var nav_main = $('#nav-main');
  var nav_main_ul = $('#nav-main ul');
  var header = $('header');
  var cebit = $('#cebit');
  var main = $('main.qabel')

  $(window).scroll(function(){
    var duration = 120;

    if ( $(this).scrollTop() > 0) {
      if (! $('header').hasClass('minimized')) {
        logo.animate({height: '40px'}, duration);

        alpha.css({transform: 'rotate(0deg)', position: 'relative', top: '-2px', left: '10px'});

        logo_img.attr('src', 'https://qabel.de/img/logo_small.png');
        logo_img.animate({height: '40px'}, duration);

        nav_main.animate({padding: '6px 0'}, duration);
        nav_main_ul.animate({bottom: '10px'}, duration);

        header.addClass('minimized');

        cebit.attr('hidden', 'true');
      }
    } else {
      logo.animate({height: '160px'}, duration);

      logo_img.attr('src', 'https://qabel.de/img/logo.png');
      logo_img.animate({height: '160px'}, duration);

      alpha.css({transform: 'rotate(-30deg)', position: 'absolute', top: '18px', left: '-10px'});

      nav_main.animate({padding: '16px 0'}, duration);
      nav_main_ul.animate({bottom: '26px'}, duration);

      header.removeClass('minimized');

      cebit.removeAttr('hidden');

    }

  });

  // smooooooth scrolling on menu selection

  $('a').click(function(event){
    if($(this).attr('href').substr(0, 1) == '#') {
      var subAccordionElem = $('li[data-name="'+$(this).attr('href')+'"]');

      if(subAccordionElem.length > 0) {
        subAccordionElem.css('display', 'list-item');

        $('#faq ul').accordion( 'option', 'active', $('#faq div > ul > li').index(subAccordionElem) );
        return false;
      }

      if($(this).attr('href') == '#twitter') {
        $('#twitter').load('twitter.html', function( response, status, xhr ) {
          if(status == 'error') {
            $('#twitter').html('Error loading the Twitter Widget, please try again.<a href="#twitter">test</a>');
          }
        });
      } else {
        if($(this).attr('href') == '#go' || $(this).attr('href') == '#legal' || $(this).attr('href') == '#surveillance') {
          section_offset_fixed = section_offset + section_padding*-1;
        } else {
          section_offset_fixed = section_offset;
        }

        root.animate({
              scrollTop: $( $(this).attr('href') ).offset().top - section_offset_fixed
          }, 500);
      }

        return false;
    }
  });

  $('#faq > div > ul').accordion({
    active: false,
    collapsible: true,
    header: 'h3',
    heightStyle: 'content',
    activate: function( event, ui ) {
      if(ui.newHeader.parent().attr('data-name') !== '#why') {
        $('li[data-name="#why"]').css('display', 'none');
      }

      if(ui.newHeader.parent().attr('data-name') !== '#areyousure') {
        $('li[data-name="#areyousure"]').css('display', 'none');
      }

      if(ui.newHeader.parent().attr('data-name') !== '#whynotios') {
        $('li[data-name="#whynotios"]').css('display', 'none');
      }

      if(typeof ui.newHeader.offset() !== 'undefined') {
        var offset = ui.newHeader.offset().top - 80;

        root.animate({
              scrollTop: offset
          }, 500);
      }
    }
  });

  $('#blog-section').accordion({
    active: false,
    collapsible: true,
    header: '.blog-more',
    heightStyle: 'content',
    activate: function( event, ui ) {
      if(ui.oldHeader.text() == 'less') {
        ui.oldHeader.text('more');
      } else {
        ui.oldHeader.text('Mehr');
      }
      if(ui.newHeader.text() == 'more') {
        ui.newHeader.text('less');
      } else {
        ui.newHeader.text('Weniger');
      }

      if(typeof ui.newHeader.parent().offset() !== 'undefined') {
        var offset = ui.newHeader.parent().offset().top - 40;

        root.animate({
              scrollTop: offset
          }, 500);
      }
    }
  });

  var anchorExists = document.getElementById(anchor.substr(1, anchor.length-1));

  if(anchor.substr(0, 1) == '#' && anchorExists != null) {
    if(anchor == '#whatisqabel' || ( anchor.substr(1,4) == 'blog' && anchor.substr(6,1) != '4') ) {
      if(anchor == '#whatisqabel') {
        anchor = 'li[data-name="'+anchor+'"]';

        waitForWidget('#faq ul', 'accordion', function() {
          $('#faq ul').accordion( 'option', 'active', $('#faq div > ul > li').index($(anchor)) );
        });
      }

      if(anchor.substr(1,4) == 'blog' && anchor.substr(6,1) != '4') {
        waitForWidget('#blog-section', 'accordion', function() {
          $('#blog-section').accordion( 'option', 'active', $('#blog-section div[id]').index($(anchor)));
        });
      }
    } else {
      root.animate({
        scrollTop: $( anchor ).offset().top - section_offset
      }, 500);
    }
  }

  if(!(/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera)){
      var s = skrollr.init({
      forceHeight: false,
      smoothScrolling: false
    });

    s.refresh($('.parallax'));
  }

  $('.slides').bxSlider({
    auto: true,
    autoHover: true,
    controls: false,
    pause: 7000
  });

});

function waitForWidget(selector, widget, callback) {
  while(!$(selector).data('ui-'+widget)) {
    setTimeout(waitForWidget(selector, widget, callback), 1);
  }
  callback();
}