function scrollToTop() {
  var position = document.body.scrollTop || document.documentElement.scrollTop;
  if (position) {
    window.scrollTo(0, 0);
  }
}

function goToDestination(url) {
  window.open(url, "_blank");
}

//Variable

var listTouch = [];
var touchEndPoint = [];
var touchStartPoint = [];
var lastCall = 0;
var mobile = false;
var isScrollLastChart = false;

//end Variable

//Document ready
$(document).ready(function () {
  var chartWrapper = $("#lua-chon");
  var quyenLoiWrapper = $("#quyen-loi");
  var huongDanWrapper = $("#huong-dan");
  var taiSaoWrapper = $("#tai-sao");
  const headerHeight = $('.header-wrapper').first().height();

  $("body").tooltip({ selector: "[data-toggle=tooltip]" });

  // magnificPopup
  $(".popup-youtube, .popup-vimeo, .popup-gmaps").magnificPopup({
    type: "iframe",
    mainClass: "mfp-fade",
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false,
  });

  // Carousel

  function renderPhoneCarousel() {
    $(".phone-slide").owlCarousel({
      mouseDrag: false,
      touchDrag: false,
      pullDrag: false,
      freeDrag: false,
      loop: false,
      nav: false,
      items: 1,
      dots: true,
      autoplay: false,
      animateIn: "animate__animated animate__fadeIn",
      animateOut: "animate__animated animate__fadeOut",
      startPosition: 0,
    });
    $(".phone-slide").on("changed.owl.carousel", function (event) {
      var listItems = event.item.count;
      var indexItem = event.item.index;
      var listArrow = $(".slider-nav-wrapper span");
      if (indexItem === 0) {
        $(listArrow).first().removeClass("clickable");
        $(listArrow).last().addClass("clickable");
      } else if (indexItem === listItems - 1) {
        $(listArrow).first().addClass("clickable");
        $(listArrow).last().removeClass("clickable");
      } else {
        $(listArrow).first().addClass("clickable");
        $(listArrow).last().addClass("clickable");
      }
      handleActiveItem(indexItem);
    });
  }

  function renderChartCarousel() {
    $(".chart-carousel").owlCarousel({
      slideTransition: "fade",
      mouseDrag: false,
      touchDrag: false,
      pullDrag: false,
      freeDrag: false,
      loop: false,
      margin: 0,
      nav: false,
      items: 1,
      dots: false,
      autoplay: false,
      startPosition: 0,
      animateOut: "animate__animated animate__fadeOutUp",
      animateIn: "animate__animated animate__fadeInUp",
    });

    $(".chart-carousel").on("changed.owl.carousel", function (event) {
      var indexItem = event.item.index;
      handleChartActiveItem(indexItem);
    });

    handleScrollChart();
  }

  function handleScrollChart() {
    // Mobile
    if (mobile) {
      // Cho phep chuyen slide bang cach vuot len vuot xuong
      document
        .getElementsByClassName("chart-carousel")[0]
        .addEventListener("touchstart", handleTouchStart, false);
      document
        .getElementsByClassName("chart-carousel")[0]
        .addEventListener("touchmove", handleTouchMove, false);
      document
        .getElementsByClassName("chart-carousel")[0]
        .addEventListener("touchend", handleTouchEnd, false);

      $(".chart-carousel").ready(
        scrollThrottle(function (e) {
          handleWhenScrollToLastChart(e, true);
        }, 1000)
      );
    } else {
      /* Chart trên PC */
      $(".chart-carousel").on(
        "wheel",
        ".owl-stage",
        scrollThrottle(function (e) {
          if (e.originalEvent.deltaY < 0) {
            $(".chart-carousel").trigger("prev.owl.carousel");
            handleWhenScrollToLastChart(e, false);
          } else {
            $(".chart-carousel").trigger("next.owl");
            handleWhenScrollToLastChart(e, false);
          }
          e.preventDefault();
        }, 1000)
      );
    }
  }

  function handleTouchStart(evt) {
    listTouch = [];
    var x = evt.touches[0].clientX;
    var y = evt.touches[0].clientY;
    touchStartPoint = [x, y];
  }
  function handleTouchMove(evt) {
    var x = evt.touches[0].clientX;
    var y = evt.touches[0].clientY;
    listTouch.push([x, y]);
  }
  function handleTouchEnd(evt) {
    var x = evt.changedTouches[0].clientX;
    var y = evt.changedTouches[0].clientY;
    touchEndPoint = [x, y];
    checkSwipeDirection();
  }

  function checkSwipeDirection() {
    if (
      -50 < touchEndPoint[0] - touchStartPoint[0] < 50 &&
      touchEndPoint[1] - touchStartPoint[1] < -100
    ) {
      $(".chart-carousel").trigger("next.owl.carousel");
    } else if (
      -50 < touchEndPoint[0] - touchStartPoint[0] < 50 &&
      touchEndPoint[1] - touchStartPoint[1] > 100
    ) {
      $(".chart-carousel").trigger("prev.owl.carousel");
    }
  }

  function handleChartActiveItem(target) {
    var listItems = $("#lua-chon .dots-wrapper .dot-item");
    $(listItems).each(function (index, item) {
      if (index === target) {
        $(item).addClass("active");
      } else {
        $(item).removeClass("active");
      }
    });
  }

  function handleClickToChangeChartItem() {
    var listItem = $(".dots-wrapper .dot-item");
    $(listItem).each(function (index, item) {
      $(item).click(function () {
        $(".chart-carousel").trigger("to.owl.carousel", [index, 1]);
      });
    });
  }

  function handleClickToChangePhoneItem() {
    var listItem = $(".slider-nav-wrapper span");
    $(listItem)
      .first()
      .click(function () {
        if ($(this).hasClass("clickable")) {
          $(".phone-slide").trigger("prev.owl.carousel");
        }
      });
    $(listItem)
      .last()
      .click(function () {
        if ($(this).hasClass("clickable")) {
          $(".phone-slide").trigger("next.owl.carousel");
        }
      });
  }
  //for phone carousel
  function handleActiveItem(target) {
    var listItems = $("#huong-dan .slider-nav-wrapper a");
    $(listItems).each(function (index, item) {
      if (index === target) {
        $(item).addClass("active");
      } else {
        $(item).removeClass("active");
      }
    });
  }

  function scrollThrottle(func, interval) {
    return function () {
      var now = Date.now();
      if (lastCall + interval < now) {
        lastCall = now;
        return func.apply(this, arguments);
      }
    };
  }

  function handleWhenScrollToLastChart(e, isMobile) {
    $(".chart-carousel").on("changed.owl.carousel", function (e) {
      var items = e.item.count; // Number of items
      var item = e.item.index; // Position of the current item
      var size = e.page.size; // Number of items per page
      // last slide
      if (items - item === size) {
        isScrollLastChart = true;
        setTimeout(function () {
          $(".session-wrapper").removeClass("d-none");
          $("footer").removeClass("d-none");
        }, 1500);
      }
    });
  }

  function checkMobile() {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      mobile = true;
    } else {
      mobile = false;
    }
  }

  function isScrolledIntoView(elem) {
    var pageTop = $(window).scrollTop();
    var pageBottom = pageTop + $(window).height();
    // var elementTop = $(elem).offset().top - headerHeight + 5;
    var elementTop = $(elem).offset().top;
    var elementBottom = elementTop + $(elem).height();

    if ($(elem).height() < $(window).height()) {
      return pageTop <= elementTop && pageBottom >= elementBottom;
    } else {
      return elementTop <= pageBottom && elementBottom >= pageTop;
    }
  }

  function handleToogleCollapseNavMobile() {
    $(".navbar-collapse a").click(function () {
      setTimeout(function(){
        $(".navbar-collapse").collapse("hide");
      },700);
      // $(".navbar-collapse").collapse("hide");
    });
  }
  //for header
  function handleActiveClass(target) {
    var listNavItem = $("#header nav .nav-item");
    $(listNavItem).each(function (index, item) {
      if (index === target) {
        $(item).find("a").first().addClass("active");
      } else {
        $(item).find("a").first().removeClass("active");
      }
    });
  }

  function handleClickNavItem() {
    var listNavItem = $("#header nav .nav-item");

    // $(listNavItem).each(function (index, item) {
    //   $(item).click(function () {
    //     switch (index) {
    //       case 0:
    //         setTimeout(function(){window.scrollTo(0,$(chartWrapper).position().top - headerHeight)},200);
    //         return;
    //       case 1:
    //         setTimeout(function(){window.scrollTo(0,$(quyenLoiWrapper).position().top - headerHeight)},200);
    //         return;
    //       case 2:
    //         setTimeout(function(){window.scrollTo(0,$(huongDanWrapper).position().top - headerHeight)},200);
    //         return;
    //       case 3:
    //         setTimeout(function(){window.scrollTo(0,$(taiSaoWrapper).position().top - headerHeight)},200);
    //         return;
    //       default:
    //         setTimeout(function(){window.scrollTo(0,0)},200);
    //     }
    //   });
    // });
  }

  checkMobile();
  renderPhoneCarousel();
  renderChartCarousel();
  handleToogleCollapseNavMobile();
  handleClickToChangeChartItem();
  handleClickToChangePhoneItem();
  handleClickNavItem();
  //Track window scroll

  document.getElementById("lua-chon").onwheel = function (event) {
    if (!isScrollLastChart && isScrolledIntoView(chartWrapper)) {
      var now = Date.now();
      if (lastCall + 1000 < now) {
        lastCall = now;
        if (event.deltaY < 0) {
          $(".chart-carousel").trigger("prev.owl.carousel");
          handleWhenScrollToLastChart(event, false);
        } else {
          $(".chart-carousel").trigger("next.owl");
          handleWhenScrollToLastChart(event, false);
        }
        event.preventDefault();
      }
    }
  };
  window.onscroll = function () {
    //handleShowButtonScrollTop
    var mybutton = document.getElementById("scroll-top");
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      mybutton.style.opacity = 1;
    } else {
      mybutton.style.opacity = 0;
    }

    //handleNavActiveItemWhenScroll
    if (isScrolledIntoView(chartWrapper)) {
      handleActiveClass(0);
      return;
    }
    if (isScrolledIntoView(quyenLoiWrapper)) {
      handleActiveClass(1);
      return;
    }
    if (isScrolledIntoView(huongDanWrapper)) {
      handleActiveClass(2);
      return;
    }
    if (isScrolledIntoView(taiSaoWrapper)) {
      handleActiveClass(3);
      return;
    }

    //Track when scroll mouse if chart is not scroll to last
    if (!isScrollLastChart) {
      scrollThrottle(function (e) {
        if (e.originalEvent.deltaY < 0) {
          $(".chart-carousel").trigger("prev.owl.carousel");
          handleWhenScrollToLastChart(e, false);
        } else {
          $(".chart-carousel").trigger("next.owl");
          handleWhenScrollToLastChart(e, false);
        }
        e.preventDefault();
      }, 1000);
    }
  };
});
