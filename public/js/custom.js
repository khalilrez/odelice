const navItems = [
    { label: 'Home', href: 'index.html', active: true },
    { label: 'Menu', href: 'menu.html', active: false },
    { label: 'About', href: 'about.html', active: false },
    { label: 'Book Table', href: 'book.html', active: false }
  ];
  


// isotope js
$(window).on('load', function () {
    $('.filters_menu li').click(function () {
        $('.filters_menu li').removeClass('active');
        $(this).addClass('active');

        var data = $(this).attr('data-filter');
        $grid.isotope({
            filter: data
        })
    });

    var $grid = $(".grid").isotope({
        itemSelector: ".all",
        percentPosition: false,
        masonry: {
            columnWidth: ".all"
        }
    })
});

// nice select
$(document).ready(function() {
    $('select').niceSelect();
    
  });


// client section owl carousel
$(".client_owl-carousel").owlCarousel({
    loop: true,
    margin: 0,
    dots: false,
    nav: true,
    navText: [],
    autoplay: true,
    autoplayHoverPause: true,
    navText: [
        '<i class="fa fa-angle-left" aria-hidden="true"></i>',
        '<i class="fa fa-angle-right" aria-hidden="true"></i>'
    ],
    responsive: {
        0: {
            items: 1
        },
        768: {
            items: 2
        },
        1000: {
            items: 2
        }
    }
});


function increaseCount(a, b) {
    var input = b.previousElementSibling;
    var value = parseInt(input.value, 10);
    value = isNaN(value) ? 0 : value;
    value++;
    input.value = value;
  }
  
  function decreaseCount(a, b) {
    var input = b.nextElementSibling;
    var value = parseInt(input.value, 10);
    if (value > 1) {
      value = isNaN(value) ? 0 : value;
      value--;
      input.value = value;
    }
  }
  

  $('.owl-carousel').owlCarousel({
    items:1,
    loop:true,
    margin:30,
    stagePadding:30,
    smartSpeed:450,
    autoplay:true,
    autoplayTimeout:2500,
    autoplayHoverPause:true

});


// $(window).on('load', function () {
//     console.log("in")
//     $(".fadeIn-instant").fadeIn();
// });

$(document).ready(function() {
    
    /* Every time the window is scrolled ... */
    $(window).scroll( function(){
    
        /* Check the location of each desired element */
        $('.fade-in-onscroll').each( function(i){
            
            var bottom_of_object = $(this).offset().top + $(this).outerHeight();
            var bottom_of_window = $(window).scrollTop() + $(window).height();
            
            /* If the object is completely visible in the window, fade it it */
            if( bottom_of_window > bottom_of_object * 0.85 ){
                $(this).animate({'opacity':'1'},500); 
            }
            
        }); 
    
    });
    
});