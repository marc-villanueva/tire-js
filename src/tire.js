//----------------------------
// Main DSL for TireJs
//
// 
//----------------------------
TireJs = function() {
  return {
    klasses: {},

    configure: function(block) {
      block.call(TireJs.configuration);
    },

    stats: function(indices, options) {
      return new TireJs.klasses.stats(indices, options);  
    },

    status: function(indices, options) {
      return new TireJs.klasses.status(indices, options);
    },

    segments: function(indices) {
      return new TireJs.klasses.segments(indices);
    },

    indices: function() {
      var dfd = new $.Deferred();
      var indexes = [];

      var stats = TireJs.stats();
      stats.results().done(function(data) {
        var idx = data._all.indices;
        for(i in idx) {
          if(idx.hasOwnProperty(i)) {
            indexes.push(new TireJs.klasses.index(i));
          }
        }

        dfd.resolve(indexes);
      });

      return dfd;
    },

    index: function(name, block) {
      return new TireJs.klasses.index(name, block);
    },

    search: function(indices, options, block) {
      return new TireJs.klasses.search(indices, options, block);
    }
  }
}();

//--------------------------------------------------------
// Stats class
//
// http://www.elasticsearch.org/guide/reference/api/admin-indices-stats.html
//
// Constructors:
//
// var stats = new TireJs.klasses.stats();
// var stats = new TireJs.klasses.stats('myindex', 'refresh=true');
// var stats = new TireJs.klasses.stats(['myindex', 'myindex2'], ['refresh=true', 'flush=true']);
//
// Parameters:
//
// indices
//  - nil -> stats for all indices in the cluster
//  - string -> name of single index
//  - array -> array of index names
//
//  options
//  - nil -> return default stats
//  - string -> single key/value param option
//  - array -> array of key/value param options
//--------------------------------------------------------
TireJs.klasses.stats = function(indices, options) {
  this._indices = [];
  if(arguments[0])
    this._indices = $.isArray(indices) ? indices : [indices];

  this._options = [];
  if(arguments[1])
    this._options = $.isArray(options) ? options : [options];
}
TireJs.klasses.stats.prototype = {
  url: function() {
    var idx = this._indices.length > 0 ? '/' + this._indices.join(',') : '';
    var params = this._options.length > 0 ? '?' + this._options.join('&') : '';
    return TireJs.configuration.url() + idx + '/_stats' + params;
  },
  results: function() {
    var client = TireJs.configuration.client();
    return client.get(this.url());
  }
}

//--------------------------------------------------------
// Status class
//
// http://www.elasticsearch.org/guide/reference/api/admin-indices-status.html
//
// Constructors:
//
// var stats = new TireJs.klasses.status();
// var stats = new TireJs.klasses.status('myindex', 'recovery=true');
// var stats = new TireJs.klasses.status(['myindex', 'myindex2'], ['recovery=true', 'snapshot=true']);
//
// Parameters:
//
// indices
//  - nil -> status for all indices in the cluster
//  - string -> name of single index
//  - array -> array of index names
//
//  options
//  - nil -> return default status
//  - string -> single key/value param option
//  - array -> array of key/value param options
//--------------------------------------------------------
TireJs.klasses.status = function(indices, options) {
 this._indices = [];
  if(arguments[0])
    this._indices = $.isArray(indices) ? indices : [indices];

  this._options = [];
  if(arguments[1])
    this._options = $.isArray(options) ? options : [options];
}
TireJs.klasses.status.prototype = {
  url: function() {
    var idx = this._indices.length > 0 ? '/' + this._indices.join(',') : '';
    var params = this._options.length > 0 ? '?' + this._options.join('&') : '';
    return TireJs.configuration.url() + idx + '/_status' + params;
  },
  results: function() {
    var client = TireJs.configuration.client();
    return client.get(this.url());
  } 
}

//--------------------------------------------------------
// Segments class
//
// http://www.elasticsearch.org/guide/reference/api/admin-indices-segments.html
//
// Constructors:
//
// var stats = new TireJs.klasses.segments();
// var stats = new TireJs.klasses.segments('myindex');
// var stats = new TireJs.klasses.segments(['myindex', 'myindex2']);
//
// Parameters:
//
// indices
//  - nil -> segments for all indices in the cluster
//  - string -> name of single index
//  - array -> array of index names
//--------------------------------------------------------
TireJs.klasses.segments = function(indices) {
 this._indices = [];
  if(arguments[0])
    this._indices = $.isArray(indices) ? indices : [indices];
}
TireJs.klasses.segments.prototype = {
  url: function() {
    var idx = this._indices.length > 0 ? '/' + this._indices.join(',') : '';
    return TireJs.configuration.url() + idx + '/_segments';
  },
  results: function() {
    var client = TireJs.configuration.client();
    return client.get(this.url());
  } 
}

//----------------------------
// JqueryClient class
//
// concrete implementation of a client class
//----------------------------
TireJs.klasses.jqueryClient = function() {
}

TireJs.klasses.jqueryClient.prototype = {
  get: function(url) {
    return $.get(url);
  },
  post: function(url, data) {
    return $.post(url, data);
  }
}

//----------------------------
// Configuration class
//
//
//----------------------------
TireJs.configuration = function() {
  var url, client;

  return {
    url: function(value) {
      if(typeof value == 'undefined') {
        url = url ? url : 'http://localhost:9200';
        return url;
      } else {
        if(value[value.length - 1] == '/') {
          value = value.substr(0, value.length - 1);
        }
        url = value;
      }
    },
    client: function(value) {
      if(typeof value == 'undefined') {
        client = client ? client : new TireJs.klasses.jqueryClient();
        return client;
      } else
        client = value;
    },
    reset: function(prop) {
      if(typeof prop == 'undefined') {
        client = null;
        url = null;
      } else {
        eval(prop + ' = null;');
      }
    }
  }
}();

//----------------------------
// Index class
//
// represents an index in ElasticSearch
//
//----------------------------
TireJs.klasses.index = function(name, block) {
  this._name = name;
  if(typeof block == 'function')
    block.call(this);
}

TireJs.klasses.index.prototype = {
  url: function() {
    return TireJs.configuration.url() + '/' + this._name;
  },
  name: function() {
    return this._name;
  },
  mapping: function() {
   return TireJs.configuration.client().get(this.url() + '/_mapping');
  },
  settings: function() {
    return TireJs.configuration.client().get(this.url() + '/_settings');
  }
}

//----------------------------
// Search class
//
//
//----------------------------
TireJs.klasses.search = function(indices, options, block) {
  var idx = new Array(indices);
  this._path = ['/', idx.join(','), '_search'].join('/').replace(/\/\//g, '/');
  this._filters = [];
  this._options = options ? options : {};
  
  if(typeof block == 'function')
    block.call(this);
}
TireJs.klasses.search.prototype = {
  url: function() {
    return TireJs.configuration.url() + this._path;
  },
  query: function(block) {
    this._query = new TireJs.klasses.query(block);
  },
  sort: function(block) {
    this._sort = new TireJs.klasses.sort(block);
  },
  facet: function() {
    // TODO - add faceting
  },
  filter: function() {
    if(arguments.length == 1) 
      this._filters.push(arguments[0]);
    else
      this._filters.push(new TireJs.klasses.filter(arguments[0], arguments[1]));
  },
  from: function(value) {
    this._from = value;
  },
  size: function(value) {
    this._size = value;
  },
  results: function() {
    var client = TireJs.configuration.client();    
    return client.post(this.url(), this.toJson());
  }, 
  toJson: function() {
    return JSON.stringify(this.toObject());
  },
  toObject: function() {
    var obj = {};
    if(this._query) obj.query = this._query.toObject();
    if(this._filters.length == 1) {
      obj.filter = this._filters[0].toObject();
    }
    if(this._filters.length > 1) {
      var filters = [];
      for(var i = 0; i < this._filters.length; i++) {
        filters.push(this._filters[i].toObject());
      }

      obj.filter = {and: filters };
    }
    if(this._from != null) obj.from = this._from;
    if(this._size != null) obj.size = this._size;
    if(this._sort != null) obj.sort = this._sort.toObject();
    return obj;
  },
  toCurl: function() {
    return "curl -XGET '" + this.url() + "' -d '" + this.toJson() + "'";
  }
}

//----------------------------
// Query class
//
//
//----------------------------
TireJs.klasses.query = function(block) {
  this._value = {};

  if(typeof block == 'function')
    block.call(this);
}
TireJs.klasses.query.prototype = {
  all: function() {
    this._value = {match_all: {}};
  },
  term: function(field, value, options) {
    var query = {};
    query[field] = {term: value}; 
    $.extend(query[field], options);
    this._value = {term: query};
  },
  string: function(value, options) {
    var qs = {query: value};
    $.extend(qs, options);
    this._value = {query_string: qs};
  },
  boolean: function(options, block) {
    var bool = new TireJs.klasses.booleanQuery(options, block);
    this._value['bool'] = bool.toObject();
  },
  toObject: function() {
    return this._value; 
  }
}

//----------------------------
// BooleanQuery class
//
//
//----------------------------
TireJs.klasses.booleanQuery = function(block, options) {
  this._options = options;
  this._value = {};

  if(typeof block == 'function')
    block.call(this);
}
TireJs.klasses.booleanQuery.prototype = {
  must: function(block) {
    if(typeof this._value['must'] == 'undefined')
      this._value['must'] = [];

    var query = new TireJs.klasses.query(block);
    this._value['must'].push(query.toObject());
  },
  mustNot: function(block) {
    if(typeof this._value['must_not'] == 'undefined')
      this._value['must_not'] = [];

    var query = new TireJs.klasses.query(block);
    this._value['must_not'].push(query.toObject());
  },
  should: function(block) {
    if(typeof this._value['should'] == 'undefined')
      this._value['should'] = [];

    var query = new TireJs.klasses.query(block);
    this._value['should'].push(query.toObject());
  },
  toObject: function() {
    $.extend(this._value, this._options);
    return this._value;  
  }
}

//----------------------------
// Filter class
//
// Generic filter class that you can
// use to build any type of ES filter.
// You can use the specific filter classes
// if you don't want to deal with building 
// the objects yourself.
//----------------------------
TireJs.klasses.filter = function(type, options) {
  this._value = {};
  this._value[type] = options;
}
TireJs.klasses.filter.prototype = {
  toObject: function() {
    return this._value;
  }
}

//----------------------------
// Exists filter class
//
// Constructs the exists ES filter
// http://www.elasticsearch.org/guide/reference/query-dsl/exists-filter.html
//----------------------------
TireJs.klasses.existsFilter = function(field, value) {
  this._field = field;
  this._value = value;
}
TireJs.klasses.existsFilter.prototype = {
  toObject: function() {
    return JSON.parse('{"exists": {"' + this._field + '": "' + this._value + '"}}');
  }
}

//----------------------------
// Term filter class
//
// Constructs the term ES filter
// http://www.elasticsearch.org/guide/reference/query-dsl/term-filter.html
//----------------------------
TireJs.klasses.termFilter = function(field, value) {
  this._field = field;
  this._value = value;
}
TireJs.klasses.termFilter.prototype = {
  toObject: function() {
    return JSON.parse('{"term": {"' + this._field + '": "' + this._value + '"}}');
  }
}

//----------------------------
// Range filter class
//
// Constructs the range ES filter
// http://www.elasticsearch.org/guide/reference/query-dsl/range-filter.html
//----------------------------
TireJs.klasses.rangeFilter = function(field, block) {
  this._value = JSON.parse('{"range": {"' + field + '":{}}}');
  this._rangeOptions = this._value['range'][field];

  if(typeof block == 'function')
    block.call(this); 
}
TireJs.klasses.rangeFilter.prototype = {
  from: function(value) {
    this._rangeOptions['from'] = value;
  },
  to: function(value) {
    this._rangeOptions['to'] = value;
  },
  includeLower: function(value) {
    this._rangeOptions['include_lower'] = value;
  },
  includeUpper: function(value) {
    this._rangeOptions['include_upper'] = value;
  },
  toObject: function() {
    return this._value;
  }
}

//----------------------------
// Geo Distance filter class
//
// Constructs the geo_distance ES filter
// http://www.elasticsearch.org/guide/reference/query-dsl/geo-distance-filter.html
//----------------------------
TireJs.klasses.geoDistanceFilter = function(field, block) {
  this._field = field;
  this._value = JSON.parse('{"geo_distance": {"distance": "50mi", "' + field + '": ""}}');

  if(typeof block == 'function')
    block.call(this); 
}
TireJs.klasses.geoDistanceFilter.prototype = {
  distance: function(value) {
    this._value['geo_distance']['distance'] = value;
  },
  latlon: function(value) {
    this._value['geo_distance'][this._field] = value;
  },
  toObject: function() {
    return this._value;
  }
}

//----------------------------
// Sort class
//
// creates ES query sort 
//----------------------------
TireJs.klasses.sort = function(block) {
  this._value = [];

  if(typeof block == 'function')
    block.call(this);
}
TireJs.klasses.sort.prototype = {
  by: function(name, direction) {
    var s = name;
    if(direction) {
      s = {};
      s[name] = direction;
    } 
    
    this._value.push(s);
  },
  toObject: function() {   
    return this._value;
  }
}
