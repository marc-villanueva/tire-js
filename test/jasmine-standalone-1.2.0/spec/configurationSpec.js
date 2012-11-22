describe('TireJs.configuration', function() {
  it('returns default url', function() {
    expect(TireJs.configuration.url()).toBe('http://localhost:9200');
  });
  
  it('allows setting and retrieving url', function() {
    TireJs.configuration.url('http://www.example.com');
    expect(TireJs.configuration.url()).toBe('http://www.example.com');
  });

  it('strips trailing slash from the url', function() {
    TireJs.configuration.url('http://www.example.com/');
    expect(TireJs.configuration.url()).toBe('http://www.example.com');
  });

  it('returns a default client', function() {
    var client= TireJs.configuration.client();
    expect(typeof client).toBe('object');
  });

  it('resets a specific property', function() {
    TireJs.configuration.url('http://www.example.com');
    expect(TireJs.configuration.url()).toBe('http://www.example.com');
    TireJs.configuration.reset('url');
    expect(TireJs.configuration.url()).toBe('http://localhost:9200');
  });

  it('resets all properties', function() {
    TireJs.configuration.url('http://www.example.com');
    expect(TireJs.configuration.url()).toBe('http://www.example.com');

    TireJs.configuration.client('test');
    expect(TireJs.configuration.client()).toBe('test');

    TireJs.configuration.reset();
    expect(typeof TireJs.configuration.client()).toBe('object');
    expect(TireJs.configuration.url()).toBe('http://localhost:9200');
  });
});