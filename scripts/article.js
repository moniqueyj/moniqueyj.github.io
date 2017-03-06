(function (module) {
function Material (opts) {
  Object.keys(opts).forEach(function(e, index, keys) {
    this[e] = opts[e];
  },this);
}

Material.all = [];

Material.prototype.toHtml = function() {
  var template = Handlebars.compile($('#article-template').text());
  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
  this.body = marked(this.body);
  return template(this);
}
Material.loadAll = function(rawData) {
  rawData.sort(function(a,b) {
    return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
});
Material.all = rawData.map(function(ele){
  return new Material(ele);
});
};
Material.fetchAll = function() {
$.ajax('/data/studystuff.json', {
  dataType:"json",
  method: "GET",
  success: function(data, status){
  Material.loadAll(data);
  console.log('hi');
  localStorage.rawData = JSON.stringify(data);
  materialView.initIndexPage();
},
 error: function( xhr,status,err) {
  console.log(status);
  console.log('bummer!');
  console.log(err);
 }

});
};

Material.numWordsAll = function() {
  return Material.all.map(function(article) {
    return Material.body.match(/\b\w+/g).length;
  // Get the total number of words in this article
  })
  .reduce(function(a, b) {
    return a+b;// Sum up all the values in the collection
  });
};

// TODO: Chain together a `map` and a `reduce` call to produce an array of unique author names.
Material.allAuthors = function() {
  return material.all.map(function(article) {
    return material.author;
  })// Don't forget to read the docs on map and reduce!
  .reduce (function(names, name) {
    if (names.indexof(name)=== -1) {
      names.push(name);
    }
    return names;
  }, []);
};

Material.numWordsByAuthor = function() {
  return Material.allAuthors().map(function(author) {
    return {
      name: author,
      numWords: Material.all.filter(function(a) {
        return a.author === author;
      })
      .map(function(a){
        return a.body.match(/\b\w+/g).length
      })
      .reduce(function(a,b) {
       return a + b;
      })
    }
    })
  };
  // TODO: Transform each author string into an object with 2 properties: One for
  // the author's name, and one for the total number of words across all articles written by the specified author.
  // someKey: someValOrFunctionCall().map(...).reduce(...), ...
Material.stats = function () {
  return {
    numArticles: Article.all.length,
    numWords: Article.numWords(),
    Authors: Article.allAuthors(),
  };
}
 module.Material = Material;
})(window);
