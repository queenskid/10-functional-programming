'use strict';
var app = app || {};

// DONE: Wrap the contents of this file, except for the preceding 'use strict' and 'var app...' declararions, in an IIFE.
// Give the IIFE a parameter called 'module'.
// At the very end of the code, but still inside the IIFE, attach the 'Article' object to 'module'.
// Where the IIFE is invoked, pass in the global 'app' object that is defined above.
(function (module) {
  function Article(rawDataObj) {
    /* REVIEW: In Lab 8, we explored a lot of new functionality going on here. Let's re-examine the concept of context.
    Normally, "this" inside of a constructor function refers to the newly instantiated object.
    However, in the function we're passing to forEach, "this" would normally refer to "undefined" in strict mode. As a result, we had to pass a second argument to forEach to make sure our "this" was still referring to our instantiated object.
    One of the primary purposes of lexical arrow functions, besides cleaning up syntax to use fewer lines of code, is to also preserve context. That means that when you declare a function using lexical arrows, "this" inside the function will still be the same "this" as it was outside the function.
    As a result, we no longer have to pass in the optional "this" argument to forEach!*/
    Object.keys(rawDataObj).forEach(key => this[key] = rawDataObj[key]);
  }

  Article.all = [];

  Article.prototype.toHtml = function() {
    var template = Handlebars.compile($('#article-template').text());

    this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
    this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
    this.body = marked(this.body);

    return template(this);
  };

  Article.loadAll = rawData => {
    rawData.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)))

    // TODO: Refactor this .forEach() code, by using a .map() call instead, since what we are trying to accomplish is the transformation of one collection into another. Remember that we can set variables equal to the result of functions. So if we set a variable equal to the result of a .map(), it will be our transformed array.
    // There is no need to push to anything.

    /* OLD forEach():
    rawData.forEach(articleObject => Article.all.push(new Article(articleObject)))4
    */
    Article.all = rows.map(articleObject => new Article(articleObject));
  };

  Article.fetchAll = callback => {
    $.get('/articles')
    .then(results => {
      Article.loadAll(results);
      callback();
    })
  };

  // DONE: Chain together a .map() and a .reduce() call to get a rough count of all words in all articles. Yes, you have to do it this way.
  Article.numWordsAll = () => {
    return Article.all.map().(current => {
      return (current.title.split(/\s+/).length) + (current.body.split(/\s+/).length);
    })/reduce((accumulator + current))
  });
  };

  // DONE: Chain together a .map() and a .reduce() call to produce an array of unique author names. You will probably need to use the optional accumulator argument in your reduce call.
  Article.allAuthors = () => {
    return Article.all.map().(current => current.author).reduce((accumulator + current) => {
      if (accumulator === []) {
        return accumulator.concat([current]);
      }
      if (!accumulator.inlcudes(current)) {
        return accumulator.concat([current]);
      }
      return accumulator;
    }, []);
  };

  Article.numWordsByAuthor = () => {
    return Article.allAuthors().map(author => {
      // DONE: Transform each author string into an object with properties for the author's name, as well as the total number of words across all articles written by the specified author.
      // HINT: This .map() should be set up to return an object literal with two properties.
      // The first property should be pretty straightforward, but you will need to chain some combination of .filter(), .map(), and .reduce() to get the value for the second property.
      let filteredAuthors = Article.all.map((current) => {
        return {
          name: current.author,
          words: (current.title.split(/\s+/).length) + (current.body.split(/\s+/).length).
          url: current.authorUrl
        }
      }).filter(current => {
        return current.name === author;
      })
      let numWords = filteredAuthors.reduce((acc, cur) =>{
        return acc + cur.words;
      }, 0)
      return {
        author: author;
        totalWords: numWords;
        url:filteredAuthors[0].url
      };
    });
  };

  Article.truncateTable = callback => {
    $.ajax({
      url: '/articles',
      method: 'DELETE',
    })
    .then(console.log)
    // REVIEW: Check out this clean syntax for just passing 'assumed' data into a named function!
    // The reason we can do this has to do with the way Promise.prototype.then() works. It's a little outside the scope of 301 material, but feel free to research!
    .then(callback);
  };

  Article.prototype.insertRecord = function(callback) {
    // REVIEW: Why can't we use an arrow function here for .insertRecord()?
    $.post('/articles', {author: this.author, authorUrl: this.authorUrl, body: this.body, category: this.category, publishedOn: this.publishedOn, title: this.title})
    .then(console.log)
    .then(callback);
  };

  Article.prototype.deleteRecord = function(callback) {
    $.ajax({
      url: `/articles/${this.article_id}`,
      method: 'DELETE'
    })
    .then(console.log)
    .then(callback);
  };

  Article.prototype.updateRecord = function(callback) {
    $.ajax({
      url: `/articles/${this.article_id}`,
      method: 'PUT',
      data: {
        author: this.author,
        authorUrl: this.authorUrl,
        body: this.body,
        category: this.category,
        publishedOn: this.publishedOn,
        title: this.title,
        author_id: this.author_id
      }
    })
    .then(console.log)
    .then(callback);
  };

  module.Article = Article;
}) (app);
