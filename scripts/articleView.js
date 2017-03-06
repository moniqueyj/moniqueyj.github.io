(function(module){
var materialView = {};

materialView.populateFilters = function() {
  $('article').each(function() {
    if (!$(this).hasClass('template')) {
      var val = $(this).find('address a').text();
      var optionTag = '<option value="' + val + '">' + val + '</option>';
      $('#author-filter').append(optionTag);

      val = $(this).attr('data-category');
      optionTag = '<option value="' + val + '">' + val + '</option>';
      if ($('#category-filter option[value="' + val + '"]').length === 0) {
        $('#category-filter').append(optionTag);
      }
    }
  });
};

materialView.handleAuthorFilter = function() {
  $('#author-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $('article[data-author="' + $(this).val() + '"]').fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#category-filter').val('');
  });
};

materialView.handleCategoryFilter = function() {
  $('#category-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $('article[data-category="' + $(this).val() + '"]').fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#author-filter').val('');
  });
};

materialView.handleMainNav = function() {
  $('.main-nav').on('click', '.tab', function(e) {
    $('.tab-content').hide();
    $('#' + $(this).data('content')).fadeIn();
  });

  $('.main-nav .tab:first').click(); // Let's now trigger a click on the first .tab element, to set up the page.
};

materialView.setTeasers = function() {
  $('.article-body *:nth-of-type(n+2)').hide(); // Hide elements beyond the first 2 in any artcile body.

  $('#articles').on('click', 'a.read-on', function(e) {
    e.preventDefault();
    $(this).parent().find('*').fadeIn();
    $(this).hide();
  });
};

materialView.initNewArticlePage = function() {
  $('.tab-content').show();
  $('#export-field').hide();
  $('#article-json').on('focus', function(){
    this.select();
  });

  $('#new-form').on('change', 'input, textarea', materialView.create);
};

materialView.create = function() {
  var material;
  $('#articles').empty();

  // Instantiate an article based on what's in the form fields:
  material = new Material({
    title: $('#article-title').val(),
    author: $('#article-author').val(),
    authorUrl: $('#article-author-url').val(),
    category: $('#article-category').val(),
    body: $('#article-body').val(),
    publishedOn: $('#article-published:checked').length ? util.today() : null
  });

  // Use the Handblebars template to put this new article into the DOM:
  $('#articles').append(material.toHtml());

  // Activate the highlighting of any code blocks:
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });

  // Export the new article as JSON, so it's ready to copy/paste into blogArticles.js:
  $('#export-field').show();
  $('#article-json').val(JSON.stringify(article) + ',');
};


materialView.initIndexPage = function() {
  Material.all.forEach(function(a){
    $('#articles').append(a.toHtml())
  });

  materialView.populateFilters();
  materialView.handleCategoryFilter();
  materialView.handleAuthorFilter();
  materialView.handleMainNav();
  materialView.setTeasers();
};
materialView.initAdminPage = function() {
  var template = Handlebars.compile($('#author-template').text());
  Material.numWordsByAuthor().forEach(function(stat) {
      $('.author-stats').append(template(stat));
      })
      $('#blog-stats .articles').text(Material.all.length);
      $('#blog-stats .words').text(Material.numWordsAll());
    };

    module.materialView = materialView;
  })(window);
