$(document).ready(function() {

  var scrollLink = $('.scroll');

  // Smooth scrolling
  scrollLink.click(function(e) {
    $('body,html').animate({
      scrollTop: $(this.hash).offset().top
    }, 1000 );
  });

  // Active link switching
  $(window).scroll(function() {
    var scrollbarLocation = $(this).scrollTop();

    scrollLink.each(function() {

      var sectionOffset = $(this.hash).offset().top - 20;

      if ( sectionOffset <= scrollbarLocation ) {
        $(this).parent().addClass('active');
        $(this).parent().siblings().removeClass('active');
      }
    })
  })

  // Auto close navbar on clicking a link in it
  // Ref: https://stackoverflow.com/a/14250000/5614968
  $('.navbar-collapse a').click(function() {
    $(".navbar-collapse").collapse('hide');
  });
})

// Dark mode toggle

const defaultMode = "light-mode"; // if prefer scheme is not available
const body = document.querySelector("body");

const mode = checkSavedMode() ? checkSavedMode() : detectColorMode();
body.classList.add(mode);
const toggle = document.querySelector(".toggle-theme");
toggle.addEventListener("click", toggleClass);

function checkSavedMode() {
  return localStorage.getItem("color-mode");
}
function saveColorMode(value) {
  localStorage.setItem("color-mode", value);
}

function detectColorMode() {
  if ( window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark-mode";
  } else if (window.matchMedia) {
    return "light-mode";
  }
  return defaultMode;
}


function toggleClass() {
  // toggle body class selector
  $('body').toggleClass('light-mode dark-mode')

  body.classList.contains("dark-mode")
    ? saveColorMode("dark-mode")
    : saveColorMode("light-mode");
}



// Navbar search
$(document).ready(function() {
  var searchInput = $('#siteSearch');
  var searchResults = $('#searchResults');
  var searchForm = $('#navbarSearch');

  function searchPage(query) {
    searchResults.empty();

    if (!query) {
      searchResults.prop('hidden', true);
      searchInput.attr('aria-expanded', 'false');
      return;
    }

    var matches = [];

    $('h1, h2, h3, p, li').each(function() {
      var text = $(this).text().trim();

      if (text.toLowerCase().includes(query.toLowerCase())) {
        var section = $(this).closest('[id]');
        var target = section.length ? section : $(this);
        var id = target.attr('id');

        if (!id) {
          id = 'search-result-' + matches.length;
          target.attr('id', id);
        }

        if (!matches.some(function(match) {
          return match.id === id;
        })) {
          matches.push({
            id: id,
            text: text
          });
        }
      }
    });

    if (matches.length === 0) {
      searchResults
        .append($('<div>').addClass('search-result-empty')
        .text('No results found.'));
    } else {
      matches.slice(0, 8).forEach(function(match) {
        var link = $('<a>')
          .addClass('search-result-item')
          .attr('href', '#' + match.id)
          .attr('role', 'option')
          .text(match.text);

        searchResults.append(link);
      });
    }

    searchResults.prop('hidden', false);
    searchInput.attr('aria-expanded', 'true');
  }

  searchInput.on('input', function() {
    searchPage($(this).val().trim());
  });

  searchForm.on('submit', function(event) {
    event.preventDefault();

    var firstResult = searchResults.find('a').first();

    if (firstResult.length) {
      window.location.hash = firstResult.attr('href').substring(1);
      searchResults.prop('hidden', true);
      searchInput.attr('aria-expanded', 'false');
    }
  });

  searchResults.on('click', 'a', function() {
    searchResults.prop('hidden', true);
    searchInput.attr('aria-expanded', 'false');
  });

  $(document).on('click', function(event) {
    if (!$(event.target).closest('#navbarSearch').length) {
      searchResults.prop('hidden', true);
      searchInput.attr('aria-expanded', 'false');
    }
  });
});


document.querySelectorAll(".copy-code-btn").forEach(function (button) {
    const icon = button.querySelector("i");

    button.addEventListener("click", async function () {
        const code = button.closest(".code-container").querySelector("code").innerText;

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(code);
            } else {
                const area = document.createElement("textarea");
                area.value = code;
                area.style.position = "fixed";
                area.style.opacity = "0";
                document.body.appendChild(area);
                area.select();
                document.execCommand("copy");
                document.body.removeChild(area);
            }

            icon.className = "bi bi-check2";
            button.title = "Copied!";
            button.setAttribute("aria-label", "Copied!");

            setTimeout(function () {
                icon.className = "bi bi-copy";
                button.title = "Copy code";
                button.setAttribute("aria-label", "Copy code");
            }, 2000);
        } catch (error) {
            console.error("Unable to copy code:", error);
        }
    });
});