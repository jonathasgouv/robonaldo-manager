const options = {
  dontScrollPosts: true
};

// Override nav.setLoc, this is called on every page change
if (nav) {
  nav.setLoc = (function () {
    var cached_function = nav.setLoc;

    return function () {

      var result = cached_function.apply(this, arguments);

      handleRouteChange();

      return result;
    };
  })();
}

var overrideBoardUpdates = function () {
  if (typeof Board !== 'undefined'
    && typeof Board.checkedUpdates !== 'undefined'
    && !window.boardOverrided
  ) {
    window.boardOverrided = true;

    Board.checkedUpdates = (function () {
      var cached_function = Board.checkedUpdates;

      return function () {

        var result = cached_function.apply(this, arguments);

        if (arguments && arguments.length >= 1) {
          handleBoardUpdate(arguments[1]);
        }

        return result;
      };
    })();
  }

  if (typeof Pagination !== 'undefined'
    && typeof Pagination.loaded !== 'undefined'
    && !window.paginationOverrided
  ) {
    window.paginationOverrided = true;

    Pagination.loaded = (function () {
      var cached_function = Pagination.loaded;

      return function () {

        var result = cached_function.apply(this, arguments);

        handleBoardUpdate();

        return result;
      };
    })();
  }

  if (typeof Board !== 'undefined'
    && typeof Board.editPost !== 'undefined'
    && !window.editPostOverrided
  ) {
    window.editPostOverrided = true;

    Board.editPost = (function () {
      var cached_function = Board.editPost;

      return function () {

        var result = cached_function.apply(this, arguments);

        return result;
      };
    })();
  }

  if (typeof Board !== 'undefined'
    && typeof Board.cancelEditPost !== 'undefined'
    && !window.cancelEditPostOverrided
  ) {
    window.cancelEditPostOverrided = true;

    Board.cancelEditPost = (function () {
      var cached_function = Board.cancelEditPost;

      return function () {

        var result = cached_function.apply(this, arguments);

        handleBoardUpdate();

        return result;
      };
    })();
  }
};
overrideBoardUpdates();


var discussionBoardRoute = function () {
  // Update the "Discussion Board" to reload on click
  var $discussionBoard = document.querySelector('.ui_crumb:last-child');
  var $createTopic = document.querySelector('[onclick="return Board.goCreate(this, event)"]');

  if ($discussionBoard) {
    var $link = document.createElement('a');
    $link.setAttribute('class', 'ui_crumb');
    $link.textContent = $discussionBoard.firstChild.textContent;
    $link.setAttribute('href', document.location.pathname);
    $link.setAttribute('onclick', 'return nav.go(this, event);');

    if ($discussionBoard.childNodes.length >= 1) {
      var $spanEl = document.createElement('span');
      $spanEl.setAttribute('class', 'ui_crumb_count');

      var $span = $discussionBoard.childNodes[1];

      $spanEl.textContent = $span.textContent;
      $link.appendChild($spanEl);
    }

    $discussionBoard.parentNode.replaceChild($link, $discussionBoard);
  }

  if ($createTopic) {
    $createTopic.addEventListener('click', function () {
      const currentUrlWithoutQuery = document.location.origin + document.location.pathname;
      const newUrl = currentUrlWithoutQuery + '?act=create';
      window.location.href = newUrl;
    });
  }
};

var boardTopicRoute = function () {
  // Update the "Discussion Board" crumb to reload the page on returning
  var $allCrumbs = document.querySelectorAll('.ui_crumb');

  if ($allCrumbs && $allCrumbs.length >= 2) {
    var $discussionBoard = $allCrumbs[1];

    if ($discussionBoard) {
      $discussionBoard.setAttribute('onclick', 'return nav.go(this, event);');
    }
  }
};

var handleRouteChange = function () {

  // See NOTE above
  overrideBoardUpdates();

  var currentLocation = document.location.pathname;
  var currentQueryString = document.location.search;

  if (/board/.test(currentLocation)
    && !/\?act=search/.test(currentQueryString)
    && !/\?act=create/.test(currentQueryString)
  ) {
    discussionBoardRoute();
  } else if (/topic/.test(currentLocation)) {
    boardTopicRoute();
  }
};

var handleBoardUpdate = function (e) {
  if (options.dontScrollPosts) {
    return 1;
  }

  if (!e || !e.events || typeof e.events.forEach !== 'function') {
    return 1;
  }

  e.events.forEach(function (event) {
    var ev = event.split('<!>');
    var evType = ev[1];

    // new post event
    if (evType === 'new_post') {
      // comment area is focused
      if (document.querySelector('.submit_post_field') === document.activeElement) {
        // scroll to last post
        document.querySelector('.bp_post:last-child').scrollIntoView();
      }
    }
  });
};

handleRouteChange();
