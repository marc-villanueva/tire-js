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

  it('should call the correct mapping url', function() {
    var url = index.url() + '/_mapping';
    clientSpy = jasmine.createSpyObj('client', ['get']);
    spyOn(TireJs.configuration, 'client').andReturn(clientSpy);

    index.mapping();

    expect(clientSpy.get).toHaveBeenCalledWith(url);
  });

  it('should call the correct settings url', function() {
    var url = index.url() + '/_settings';
    clientSpy = jasmine.createSpyObj('client', ['get']);
    spyOn(TireJs.configuration, 'client').andReturn(clientSpy);

    index.settings();

    expect(clientSpy.get).toHaveBeenCalledWith(url);
  });  
});
