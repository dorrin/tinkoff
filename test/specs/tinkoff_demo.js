const {MainPage, PayPage, KommPayPage, ZhkuMoskvaPage, ZhkuMoskvaOplataPage} = require('../pages/demoPages');

//Подключаем страницы, browser - агент Webdriver
const MainPage1 = new MainPage(browser);
const PayPage1 = new PayPage(browser);
const KommPayPage1 = new KommPayPage(browser);
const ZhkuMoskvaPage1 = new ZhkuMoskvaPage(browser);
const ZhkuMoskvaOplataPage1 = new ZhkuMoskvaOplataPage(browser);


suite('/TINKOFF DEMO/', () => {

const url = "http://tinkoff.ru";
const testString = "ЖКУ-Москва";

   suiteSetup ('Preconditions (suite setup)', () => {
   });

//Перед каждым тестов
   setup ( () => {
      browser.url(url)
   });

//После каждого теста
   teardown ( () => {
      browser.deleteCookie()
   });


   test('Поставщик услуг ЖКУ-Москва, спец сценарий', () => {
      MainPage1.menu('/payments/').click();
      PayPage1.pay_region.waitForVisible();
      PayPage1.paymenu('/payments/categories/kommunalnie-platezhi/').click();

//Ждем, что подргузится регион, прежде, чем идти дальше
      KommPayPage1.region_title.waitForVisible();
      KommPayPage1.region_title.click();
      KommPayPage1.region_item('г. Москва').click();
      KommPayPage1.pay_item_num(1).waitForVisible();
      expect(KommPayPage1.pay_item_num(1).getText()).to.equal(testString);
      KommPayPage1.pay_item_num(1).click();

      ZhkuMoskvaPage1.oplata_link.waitForVisible();
      testTitle = browser.getUrl();
      ZhkuMoskvaPage1.oplata_link.click();

      ZhkuMoskvaOplataPage1.button_submit.click();
      expect(ZhkuMoskvaOplataPage1.pole_kod_err.getText()).to.equal("Поле обязательное");
      expect(ZhkuMoskvaOplataPage1.pole_date_err.getText()).to.equal("Поле обязательное");
      expect(ZhkuMoskvaOplataPage1.pole_summ_err.getText()).to.equal("Поле обязательное");
      
//Значения для полей выбраны как заведомо обязанные вызывать ошибку
      ZhkuMoskvaOplataPage1.pole_kod.setValue(0);
      ZhkuMoskvaOplataPage1.pole_date.setValue(0);
      ZhkuMoskvaOplataPage1.pole_summ.setValue(9);
      ZhkuMoskvaOplataPage1.button_submit.click();
      expect(ZhkuMoskvaOplataPage1.pole_kod_err.getText()).to.equal("Поле неправильно заполнено");
      expect(ZhkuMoskvaOplataPage1.pole_date_err.getText()).to.equal("Поле заполнено некорректно");
      expect(ZhkuMoskvaOplataPage1.pole_summ_err.getText()).to.equal("Минимальная сумма перевода - 10 ₽");

      ZhkuMoskvaOplataPage1.pole_kod.setValue(111);
      ZhkuMoskvaOplataPage1.pole_date.setValue(999);
      ZhkuMoskvaOplataPage1.pole_summ.setValue(15001);
      ZhkuMoskvaOplataPage1.button_submit.click();
      expect(ZhkuMoskvaOplataPage1.pole_kod_err.getText()).to.equal("Поле неправильно заполнено");
      expect(ZhkuMoskvaOplataPage1.pole_date_err.getText()).to.equal("Поле заполнено некорректно");
      expect(ZhkuMoskvaOplataPage1.pole_summ_err.getText()).to.equal("Максимальная сумма перевода - 15 000 ₽");

      ZhkuMoskvaOplataPage1.menu('/payments/').click();
      PayPage1.pay_text.setValue(testString);
      expect(PayPage1.pay_text_list(1).getText()).to.include(testString);
      PayPage1.pay_text_list(1).click();

      ZhkuMoskvaPage1.oplata_link.waitForVisible();
      expect(browser.getUrl()).to.equal(testTitle);

      ZhkuMoskvaPage1.menu('/payments/').click();
      PayPage1.pay_region.waitForVisible();
      PayPage1.paymenu('/payments/categories/kommunalnie-platezhi/').click();
      KommPayPage1.region_title.waitForVisible();
      KommPayPage1.region_title.click();
      KommPayPage1.region_item('г. Санкт-Петербург').click();

//Цикл для скроллинга страницы, для отображения всех элементов.
//Pause - костыль, можно без него, например подсчитывая количество подгруженных в DOM дочерних элементов списка иконок
      let y = 0;
      while (y != KommPayPage1.footer.getLocation("y")) {
         y = KommPayPage1.footer.getLocation("y");
         browser.scroll(0, y);
         browser.pause(2000);
      }

      KommPayPage1.check_pay_item_not_exist(testString)
});


});
