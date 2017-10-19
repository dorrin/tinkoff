"use strict";

//Для Allure reporter, описание команд.

var step_name = function(command) {


var info = {
  //browser
  element: 'Выбран элемент: '+ command.args[0] + ' (' + command.args[1] + ')',
  waitForEnabled: 'Ожидаем, что элемент ' + (command.args[0] ? 'не доступен' : 'доступен' ),
  waitForExist: 'Ожидаем, что элемент' + (command.args[0] ? 'а нету' : ' имеется' ),
  waitForVisible: 'Ожидаем, что элемент ' + (command.args[0] ? 'не виден' : 'виден' ),
  setValue: 'Устанавливаем значение на '+ command.args[0],
  click: 'Кликаем на элемент',
  getUrl: 'Получаем значение URL',
  getText: 'Получаем текстовое значение',
  url: 'Переходим на url: '+ command.args[0],
  refresh: 'Обновляем страницу',
  deleteCookie: 'Чистим куки',
  pause:'Ждем ' + command.args[0] + ' мс',
  isExisting:'Проверка, есть ли элемент',
  scroll: 'Скроллим вниз',
  getLocation: 'Получаем координаты'
}

return info[command.command]

}

module.exports = step_name