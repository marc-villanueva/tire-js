describe('TireJs.klasses.filter', function() {

  it('should return filter as object', function() {
    var filter = new TireJs.klasses.filter('term', {field: 'value'});
    var obj = filter.toObject();
    expect(JSON.stringify(obj)).toBe('{"term":{"field":"value"}}');
  });

});

describe('TireJs.klasses.geoDistanceFilter', function() {

  it('sets distance property', function() {
    var filter = new TireJs.klasses.geoDistanceFilter('field', function() {
      this.distance('25km');
      this.latlon([70,80]);
    })
    var obj = filter.toObject();
    expect(JSON.stringify(obj)).toBe('{"geo_distance":{"distance":"25km","field":[70,80]}}');
  });
  
  it('sets latlong property with array', function() {
    var filter = new TireJs.klasses.geoDistanceFilter('field', function() {
      this.distance('25km');
      this.latlon([70,80]);
    })
    var obj = filter.toObject();
    expect(JSON.stringify(obj)).toBe('{"geo_distance":{"distance":"25km","field":[70,80]}}');
  });

  it('sets latlong property with string', function() {
    var filter = new TireJs.klasses.geoDistanceFilter('field', function() {
      this.distance('25km');
      this.latlon('70,80');
    })
    var obj = filter.toObject();
    expect(JSON.stringify(obj)).toBe('{"geo_distance":{"distance":"25km","field":"70,80"}}');
  });  

    it('sets latlong property with object', function() {
    var filter = new TireJs.klasses.geoDistanceFilter('field', function() {
      this.distance('25km');
      this.latlon({lat: 70, lon: 80});
    })
    var obj = filter.toObject();
    expect(JSON.stringify(obj)).toBe('{"geo_distance":{"distance":"25km","field":{"lat":70,"lon":80}}}');
  });
});

describe('TireJs.klasses.termFilter', function() {

  it('should return filter as object', function() {
    var filter = new TireJs.klasses.termFilter('field', 'value');
    var obj = filter.toObject();
    expect(JSON.stringify(obj)).toBe('{"term":{"field":"value"}}');
  });
  
});

describe('TireJs.klasses.rangeFilter', function() {

  it('sets the from property', function() {
    var filter = new TireJs.klasses.rangeFilter('startDate', function() {
      this.from('2012-10-01');
    });
    var obj = filter.toObject();
    expect(JSON.stringify(obj)).toBe('{"range":{"startDate":{"from":"2012-10-01"}}}');
  });
  
  it('sets the to property', function() {
    var filter = new TireJs.klasses.rangeFilter('startDate', function() {
      this.to('2012-10-01');
    });
    var obj = filter.toObject();
    expect(JSON.stringify(obj)).toBe('{"range":{"startDate":{"to":"2012-10-01"}}}');
  });

  it('sets the include_lower property', function() {
    var filter = new TireJs.klasses.rangeFilter('startDate', function() {
      this.from('2012-10-01');
      this.includeLower(true);
    });
    var obj = filter.toObject();
    expect(JSON.stringify(obj)).toBe('{"range":{"startDate":{"from":"2012-10-01","include_lower":true}}}');
  });

  it('sets the include_upper property', function() {
    var filter = new TireJs.klasses.rangeFilter('startDate', function() {
      this.to('2012-10-01');
      this.includeUpper(true);
    });
    var obj = filter.toObject();
    expect(JSON.stringify(obj)).toBe('{"range":{"startDate":{"to":"2012-10-01","include_upper":true}}}');
  });
});