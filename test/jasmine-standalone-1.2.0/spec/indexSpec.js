describe('TireJs.klasses.index', function() {
  var index;

  beforeEach(function() {
    index = new TireJs.klasses.index('test');
  });

  it('should have a name', function() {
    expect(index.name()).toBe('test');
  });

  it('should have a url endpoint', function() {
    expect(index.url()).toBe(TireJs.configuration.url() + '/' + index.name());
  });


});
