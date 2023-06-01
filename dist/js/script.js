$(document).ready(function () {
  $(".simplebar").each(function () {
    new SimpleBar(this, { autoHide: false });
  });

  $(".navbar-nav").on("click", ".nav-link", function () {
    if (!(window.innerWidth >= 992)) {
      setTimeout(() => {
        $("#navbar-toggler").click();
      }, 150);
    }
  });

  setTimeout(() => {
    $("#preloader").slideUp(function () {
      $(this).remove();
    });
  }, 1500);

  $(".countdown").each((i, element) => {
    const YEAR = $(element).data("year") || 0;
    const MONTH = $(element).data("month") || 0;
    const DAY = $(element).data("day") || 0;
    const HOUR = $(element).data("hour") || 0;
    const MINUTE = $(element).data("minute") || 0;
    const SECOND = $(element).data("second") || 0;

    $(element).countdown(`${YEAR}/${MONTH}/${DAY} ${HOUR}:${MINUTE}:${SECOND}`, (event) => {
      const plural = (time, text) => (event.strftime(time) == "1" || event.strftime(time) == "-1" ? text : text + "s");
      $(element).html(event.strftime("%D " + plural("%D", "day") + " %H:%M:%S"));
    });
  });

  $('[data-toggle="collapse"]').click(function () {
    $(this).find("i.timeline-accordion-icon").toggleClass("fa-rotate-90");
  });

  const initCarousel = (carouselEl) => {
    if (carouselEl.getAttribute("data-initialized") === "true") return; // Exit if already initialized
    carouselEl.setAttribute("data-initialized", "true");

    let cardWidth = $(".carousel-item", carouselEl).width();
    let scrollPosition = 0;
    let numOfCards = $(".carousel-item", carouselEl).length;
    let numOfVisibleCards = Math.floor($(".carousel-inner", carouselEl).width() / cardWidth);
    let numOfScrollableCards = numOfCards - numOfVisibleCards;

    const SCROLL_SPEED = 1500;

    $(".carousel-control-next", carouselEl).click(() => {
      if (scrollPosition < cardWidth * numOfScrollableCards) {
        scrollPosition += cardWidth;
        $(".carousel-inner", carouselEl).animate({ scrollLeft: scrollPosition }, SCROLL_SPEED);
      } else {
        scrollPosition = 0;
        $(".carousel-inner", carouselEl).animate({ scrollLeft: scrollPosition }, SCROLL_SPEED);
      }
    });

    $(".carousel-control-prev", carouselEl).click(() => {
      if (scrollPosition > 0) {
        scrollPosition -= cardWidth;
        $(".carousel-inner", carouselEl).animate({ scrollLeft: scrollPosition }, SCROLL_SPEED);
      } else {
        scrollPosition = cardWidth * numOfScrollableCards;
        $(".carousel-inner", carouselEl).animate({ scrollLeft: scrollPosition }, SCROLL_SPEED);
      }
    });

    // Auto-scroll function
    let autoScrollInterval;
    const startAutoScroll = () =>
      (autoScrollInterval = setInterval(() => $(".carousel-control-next", carouselEl).click(), 3000));
    const stopAutoScroll = () => clearInterval(autoScrollInterval);

    // Start auto-scrolling if window width >= 768px
    const handleWindowSize = () => {
      if (window.innerWidth >= 768) {
        startAutoScroll();
        $(carouselEl).removeClass("slide");
      } else {
        stopAutoScroll();
        $(carouselEl).addClass("slide");
      }
    };

    handleWindowSize();

    $(window).on("resize", () => handleWindowSize());

    // Stop autoscroll if hover
    $(carouselEl).hover(
      () => stopAutoScroll(),
      () => startAutoScroll()
    );

    $("#mediaModal").hover(
      () => stopAutoScroll(),
      () => startAutoScroll()
    );
  };

  $(".carousel:visible").each((i, el) => initCarousel(el));

  $("[data-bs-toggle='pill']").on("shown.bs.tab", (event) => {
    $(event.target.getAttribute("data-bs-target") + " .carousel").each((i, el) => initCarousel(el));
  });

  const modalCloseButton =
    '<button type="button" class="modal-btn btn btn-light rounded position-fixed" style="top:1rem;right:2rem;"data-bs-dismiss="modal"><i class="fa fa-times"></i></button>';

  $('[data-bs-toggle="modal"][data-bs-target="#mediaModal"]').click(function () {
    var mediaType = $(this).data("modal-type");

    switch (mediaType) {
      case "image":
        var mediaSrc = $(this).data("media");
        $("#mediaModal .modal-content").html(modalCloseButton + '<img class="rounded" src="' + mediaSrc + '">');
        break;

      case "image-list":
        var mediaUrl = $(this).data("baseurl");
        var mediaSrc = $(this).data("list");
        var mediaImg = modalCloseButton;
        mediaSrc.forEach((element, index, arr) => {
          mediaImg += `<img class="rounded-${index == 0 ? "top" : index == arr.length-1 ? "bottom" : "0"}" src="${
            mediaUrl + element.trim()
          }">`;
        });
        $("#mediaModal .modal-content").html(mediaImg);

        break;

      case "video":
        let videoPoster = $(this).prev("img").attr("src");
        var mediaSrc = $(this).data("media");
        $("#mediaModal .modal-content").html(
          modalCloseButton +
            '<div class="ratio ratio-16x9"><video class="rounded" poster="' +
            videoPoster +
            '"controls> <source src="' +
            mediaSrc +
            '"></video></div>'
        );
        break;

      case "info":
        var modalContent = $(this).data("info-id");
        var modalTitle = $(this).find(".title").text();
        $("#mediaModal .modal-content").html(
          '<div class="modal-header"><h5 class="modal-title font-weight-bold">' +
            modalTitle +
            '</h5><button type="button" class="close" data-dismiss="modal"><span>&times;</span></button></div><div class="modal-body">' +
            $(modalContent).html() +
            "</div></div>"
        );

        break;

      case "embed":
        var mediaSrc = $(this).data("media");
        $("#mediaModal .modal-content").html(
          modalCloseButton +
            '<div class="ratio ratio-16x9"><iframe class="rounded" src="' +
            mediaSrc +
            '" allowfullscreen loading="lazy"></iframe></div>'
        );
        break;

      default:
        $("#mediaModal .modal-content").html("");
        break;
    }
  });

  $("#mediaModal").on("hidden.bs.modal", () => $("#mediaModal .modal-content").html(""));
});

const scrollToTop = () => {
  const $navbar = $("#navbar");
  const $bgImg = $(".bg-img");
  const $scrollToTop = $(".scroll-to-top");

  if ($(document).scrollTop() > 100) {
    $bgImg.addClass("scrolled");
    $scrollToTop.fadeIn(300);
  } else {
    $navbar.addClass("m-4 rounded");
    $bgImg.removeClass("scrolled");
    $scrollToTop.fadeOut(300);
  }
  if ($(document).scrollTop() > 23) {
    $navbar.removeClass("m-4 rounded");
  } else {
    $navbar.addClass("m-4 rounded");
  }
};

$(window).on("load", () => {
  // new WOW().init();

  scrollToTop();
});

$(document).on("scroll", () => scrollToTop());
