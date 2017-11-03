# tinkoff demo test

Создано на основе WebdriverIO; использован паттерн PageObject; прикручены отчеты Allure с выводом каждого действия теста (не идеально, но можно даже без описания теста примерно понять его ход).

## установка

Требует Node.js 8+ и selenium standalone

Сначала установить зависимости
`npm install`

В фоне должен быть запущен selenium-standalone 
`selenium-standalone start`

Запустить тест
`npm run test:chrome`

Создать Allure отчет и сразу открыть в браузере
`npm run report`

## структура

* **pages/** – директория с описаниями логический страниц (объявлены нужные элементы и действия на страницах).
* **specs/** – директория с тест-сьютами, непосредственно сами тестовые сценарии
  * **specs/** – директория с тест-сьютами, непосредственно сами тестовые сценарии
* **utils/** - директория со вспомогательными модулями
* **файлы \*.conf.js** - конфигурация для запуска, можно настроить под нужный браузер, прикрутить разные репорты и т.д.
