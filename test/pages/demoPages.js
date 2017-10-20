"use strict";
var Page = require('./page')
//PageObject
//Размещаем здесь классы, для описания локаторов и наборов действий для логическиx страниц сайта.
//Можно каждый класс выносить в отдельный файл

class MainPage extends Page {

    constructor(br) {
        super(br);
    }

    menu(link)    {return this.br.element(`//ul[@id="mainMenu"]/li[*[a[@href="${link}"]]]`, `верхнее меню: ${link}`)}

};

class PayPage extends Page {

    constructor(br) {
        super(br);
}

    get pay_region()        {return this.br.element(`//span[@class="ui-link payment-page__title_inner"]`, `ссылка "Платежи в"`)}
  	    paymenu(link)       {return this.br.element(`//ul[@class="ui-menu ui-menu_icons"]/li[*[a[@href="${link}"]]]`, `кнопки "платежи": ${link}`)}
    get pay_text()          {return this.br.element(`//div/label/input`,`поле быстрого поиска поставщика услуг`)}
  	    pay_text_list(num)  {return this.br.element(`//div[div[div[label[input]]]]/div[2]/div/div[1]/div/div[${num}]`,`строка ${num} в списке найденного в поле поиска`)}

};

class KommPayPage extends Page {

    constructor(br) {
        super(br);
    }      

    get region_title()        {return this.br.element(`//div[contains(text(),"Коммунальные платежи")]/span[@class="ui-link payment-page__title_inner"]`, `ссылка "Коммунальные платежи в"`)}
        region_item(region)   {return this.br.element(`//div[@class="ui-regions__item"][span[contains(text(),"${region}")]]/span`, `ссылка на регион ${region}`)}
        pay_item_num(num)     {return this.br.element(`ul[class*="ui-menu ui-menu_icons"] > li:nth-child(${num}) span[class*="ui-menu__link"] span`, `кнопка в графическом меню платежей №${num}`)}
        pay_item(item)        {return this.br.element(`span[class*="ui-menu__link"] a[title*="${item}"]`, `кнопка в графическом меню платежей ${item}`)}
    get footer()              {return this.br.element(`a[href="tel:88005557778"]`)}

    check_pay_item_not_exist(item) {
        this.br.waitForExist( `span[class*="ui-menu__link"] a[title*="${item}"]`, 500, true)
    }
};

class ZhkuMoskvaPage  extends Page {

    constructor(br) {
        super(br);
    }

    get oplata_link()         {return this.br.element(`a[href="/zhku-moskva/oplata/"]`, `ссылка "Оплата"`)}
        menu(link)            {return this.br.element(`//ul[@id="mainMenu"]/li[*[a[@href="${link}"]]]`, `верхнее меню: ${link}`)}

};

class ZhkuMoskvaOplataPage extends Page  {

    constructor(br) {
        super(br);
    }

    get pole_kod()        {return this.br.element(`div[class*="ui-form__row_text"] input`, `поле "код плательщика"`)}
    get pole_kod_err()    {return this.br.element(`div[class*="ui-form__row_text"] div[class*="error-message"]`, `всплывашка ошибки поля "код плательщика"`)}
    get pole_date()       {return this.br.element(`div[class*="ui-form__row_date"] input`,`поле "код плательщика"`, `поле "период платежа"`)}
    get pole_date_err()   {return this.br.element(`div[class*="ui-form__row_date"] div[class*="error-message"]`, `всплывашка ошибки поля "период платежа"`)}
    get pole_summ()       {return this.br.element(`div[class*="ui-form__row_combination"] input`, `поле "код плательщика"`,`поле "сумма"`)}
    get pole_summ_err()   {return this.br.element(`div[class*="ui-form__row_combination"] div[class*="error-message"]`,`всплывашка ошибки поля "сумма"`)}
    get button_submit()   {return this.br.element(`button[class*="provider-pay"]`,`кнопка "оплатить"`)}
        menu(link)        {return this.br.element(`//ul[@id="mainMenu"]/li[*[a[@href="${link}"]]]`, `верхнее меню: ${link}`)}

}


module.exports = {
    MainPage,
    PayPage,
    KommPayPage,
    ZhkuMoskvaPage,
    ZhkuMoskvaOplataPage
}

