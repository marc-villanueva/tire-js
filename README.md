# TireJs

TireJs is a javascript client for the [ElasticSearch](http://www.elasticsearch.org/)
search engine/database.  It is an incomplete (as of now) port of the Ruby gem [Tire's](https://github.com/karmi/tire) query DSL.  Why a client-side js library for ES?  You Know, for Fun.

_ElasticSearch_ is a scalable, distributed, cloud-ready, highly-available,
full-text search engine and database with
[powerfull aggregation features](http://www.elasticsearch.org/guide/reference/api/search/facets/),
communicating by JSON over RESTful HTTP, based on [Lucene](http://lucene.apache.org/), written in Java.

## Requirements

[jQuery](http://jquery.com/)

## Installation

    <script type="text/javascript" src="jquery.js"></script>
    <script type="text/javascript" src="tire.js"></script>

## Usage

Point TireJs at your elasticsearch server:

    TireJs.configure(function() {
      this.url('http://www.my-es-server.com:9200');
    });

TireJs uses jQuery for AJAX requests and returns jQuery deferred objects so that you can do this (get mapping of an index):

    TireJs.index('my-index').mapping().done(function(mapping) {
      console.log(mapping);
    });

Query using the [querystring](http://www.elasticsearch.org/guide/reference/query-dsl/query-string-query.html) query:

    var search = TireJs.search(indexName);
    search.query(function() {
      this.string('search term', {fields: ['field1', 'field2'], default_operator: 'AND'});
    })
    search.from(0);
    search.size(20);
    search.sort(function() {
      this.by('field1', 'asc');
    })

    console.log(search.toJson());

Query using the [bool](http://www.elasticsearch.org/guide/reference/query-dsl/bool-query.html) query:

    var search = TireJs.search(indexName);
    search.query(function() {
      this.boolean(function() {
        this.must(function() {
          this.term('field1', 'value');
        })
        this.mustNot(function() {
          this.string('search term', {default_field: 'field1', default_operator: 'OR'});
        })
      })
    })

    search.from(0);
    search.size(20);

    console.log(search.toJson());

Add some filters:

    var search = TireJs.search(indexName);
    search.query(function() {
      this.all();
    })
    search.filter('term', {field1: 'value'});
    search.filter('range', {field2: {from: 0, to: 10}});
    search.from(0);
    search.size(20);

    console.log(search.toJson());

Please check out examples.html in the examples folder.

## To Do

Lots - add more tests, implement more Tire functionality, etc

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Added some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## Credits

This script library was based on Karmi's [Tire](https://github.com/karmi/tire) gem.  