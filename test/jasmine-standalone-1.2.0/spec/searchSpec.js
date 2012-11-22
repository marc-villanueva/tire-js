describe('TireJs.klasses.search', function() {
  it('should have a endpoint with single index', function() {
    var search = new TireJs.klasses.search('test');
    expect(search.url()).toBe(TireJs.configuration.url() + '/test/_search');
  });

  it('should have a endpoint with multiple indices', function() {
    var search = new TireJs.klasses.search(['test','test2']);
    expect(search.url()).toBe(TireJs.configuration.url() + '/test,test2/_search');
  });
});