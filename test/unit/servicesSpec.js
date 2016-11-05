'use strict';

describe('service', function() {

  // load modules
  beforeEach(module('ybwxServices'));

  // Test service availability
  it('check the existence of Phone factory', inject(function(PhoneVerCode) {
      expect(PhoneVerCode).toBeDefined();
    }));
});