'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

var hasClass = function(element, cls) {
  return element.getAttribute('class').then(function(classes) {
    return classes.split(' ').indexOf(cls) !== -1;
  });
}
describe('ybwx App', function() {

  it('should redirect index.html to index.html#/index', function() {
    browser.get('app/index.html');
    browser.getLocationAbsUrl().then(function(url) {
      expect(url).toEqual('/index');
    });
  });

  describe('register', function() {

    beforeEach(function() {
      browser.get('app/#/register');
    });
    it('verify the vrcode message....', function() {
      var phone = element(by.model('user.phone'));
      var vcode = element(by.model('user.vcode'));
      var password = element(by.model('user.password'));

      phone.sendKeys('13810597328');
      expect(hasClass(element(by.css('.btn-ycode')), 'btn_disabled')).toBe(false);
      // expect(hasClass(element(by.id('submitButton')), 'btn_disabled')).toBe(false);
      phone.clear();
      phone.sendKeys('1381059732899');
      expect(hasClass(element(by.css('.btn-ycode')), 'btn_disabled')).toBe(true);
      phone.clear();
      phone.sendKeys('138105');
      expect(hasClass(element(by.css('.btn-ycode')), 'btn_disabled')).toBe(true);
      phone.clear();
      phone.sendKeys('');
      expect(hasClass(element(by.css('.btn-ycode')), 'btn_disabled')).toBe(true);
      phone.clear();



      phone.sendKeys('13810597328');
      vcode.sendKeys("342234");
      password.sendKeys("xxxx2231");
      expect(hasClass(element(by.id('submitButton')), 'btn_disabled')).toBe(false);

      phone.clear();
      vcode.clear();
      password.clear();


      phone.sendKeys('138105973');
      vcode.sendKeys("342234");
      password.sendKeys("xxxx2231");
      expect(hasClass(element(by.id('submitButton')), 'btn_disabled')).toBe(true);

      phone.clear();
      vcode.clear();
      password.clear();

      phone.sendKeys('13810597328');
      vcode.sendKeys("");
      password.sendKeys("xxxx2231");
      expect(hasClass(element(by.id('submitButton')), 'btn_disabled')).toBe(true);

      phone.clear();
      vcode.clear();
      password.clear();

      phone.sendKeys('13810597328');
      vcode.sendKeys("234242");
      password.sendKeys("");
      expect(hasClass(element(by.id('submitButton')), 'btn_disabled')).toBe(true);

      phone.clear();
      vcode.clear();
      password.clear();

      phone.sendKeys('');
      vcode.sendKeys("234242");
      password.sendKeys("342342");
      expect(hasClass(element(by.id('submitButton')), 'btn_disabled')).toBe(true);

      phone.clear();
      vcode.clear();
      password.clear();


      phone.sendKeys('234234');
      vcode.sendKeys("");
      password.sendKeys("342342");
      expect(hasClass(element(by.id('submitButton')), 'btn_disabled')).toBe(true);

      phone.clear();
      vcode.clear();
      password.clear();


      phone.sendKeys('234234');
      vcode.sendKeys("234234");
      password.sendKeys("");
      expect(hasClass(element(by.id('submitButton')), 'btn_disabled')).toBe(true);


      phone.clear();
      vcode.clear();
      password.clear();


      phone.sendKeys('13810597328');
      vcode.sendKeys("234234");
      password.sendKeys("");
      expect(hasClass(element(by.id('submitButton')), 'btn_disabled')).toBe(true);


      phone.clear();
      vcode.clear();
      password.clear();

      phone.sendKeys('13810597328');
      vcode.sendKeys("");
      password.sendKeys("");
      expect(hasClass(element(by.id('submitButton')), 'btn_disabled')).toBe(true);

      phone.clear();
      vcode.clear();
      password.clear();

      phone.sendKeys('');
      vcode.sendKeys("");
      password.sendKeys("");
      expect(hasClass(element(by.id('submitButton')), 'btn_disabled')).toBe(true);

      phone.clear();
      vcode.clear();
      password.clear();



    });
  });
  /*
    describe('Phone list view', function() {

      beforeEach(function() {
        browser.get('app/index.html#/phones');
      });
      it('should filter the phone list as a user types into the search box', function() {
        var phoneList = element.all(by.repeater('phone in phones'));
        var query = element(by.model('query'));
        expect(phoneList.count()).toBe(20);
        query.sendKeys('nexus');
        expect(phoneList.count()).toBe(1);
        query.clear();
        query.sendKeys('motorola');
        expect(phoneList.count()).toBe(8);
      });
    });
  */

});
/*
describe('PhoneCat App', function() {

  it('should redirect index.html to index.html#/phones', function() {
    browser.get('app/index.html');
    browser.getLocationAbsUrl().then(function(url) {
        expect(url).toEqual('/phones');
      });
  });


  describe('Phone list view', function() {

    beforeEach(function() {
      browser.get('app/index.html#/phones');
    });


    it('should filter the phone list as a user types into the search box', function() {

      var phoneList = element.all(by.repeater('phone in phones'));
      var query = element(by.model('query'));

      expect(phoneList.count()).toBe(20);

      query.sendKeys('nexus');
      expect(phoneList.count()).toBe(1);

      query.clear();
      query.sendKeys('motorola');
      expect(phoneList.count()).toBe(8);
    });


    it('should be possible to control phone order via the drop down select box', function() {

      var phoneNameColumn = element.all(by.repeater('phone in phones').column('phone.name'));
      var query = element(by.model('query'));

      function getNames() {
        return phoneNameColumn.map(function(elm) {
          return elm.getText();
        });
      }

      query.sendKeys('tablet'); //let's narrow the dataset to make the test assertions shorter

      expect(getNames()).toEqual([
        "Motorola XOOM\u2122 with Wi-Fi",
        "MOTOROLA XOOM\u2122"
      ]);

      element(by.model('orderProp')).element(by.css('option[value="name"]')).click();

      expect(getNames()).toEqual([
        "MOTOROLA XOOM\u2122",
        "Motorola XOOM\u2122 with Wi-Fi"
      ]);
    });


    it('should render phone specific links', function() {
      var query = element(by.model('query'));
      query.sendKeys('nexus');
      element.all(by.css('.phones li a')).first().click();
      browser.getLocationAbsUrl().then(function(url) {
        expect(url).toEqual('/phones/nexus-s');
      });
    });
  });


  describe('Phone detail view', function() {

    beforeEach(function() {
      browser.get('app/index.html#/phones/nexus-s');
    });


    it('should display nexus-s page', function() {
      expect(element(by.binding('phone.name')).getText()).toBe('Nexus S');
    });


    it('should display the first phone image as the main phone image', function() {
      expect(element(by.css('img.phone.active')).getAttribute('src')).toMatch(/img\/phones\/nexus-s.0.jpg/);
    });


    it('should swap main image if a thumbnail image is clicked on', function() {
      element(by.css('.phone-thumbs li:nth-child(3) img')).click();
      expect(element(by.css('img.phone.active')).getAttribute('src')).toMatch(/img\/phones\/nexus-s.2.jpg/);

      element(by.css('.phone-thumbs li:nth-child(1) img')).click();
      expect(element(by.css('img.phone.active')).getAttribute('src')).toMatch(/img\/phones\/nexus-s.0.jpg/);
    });
  });
});
*/