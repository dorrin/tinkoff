# tinkoff demo test

Создано на основе WebdriverIO
Использован паттерн PageObject
Прикручены отчеты Allure с выводом каждого действия теста

Использование:
Требует Node.js 8+ и selenium standalone

Сначала установить зависимости

`npm install`

В фоне должен быть запущен selenium-standalone 

`selenium-standalone start`

Запустить тест

`npm run test:chrome`

Создать Allure отчет и сразу открыть в браузере

`npm run report`
