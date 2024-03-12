### B24 Tweaks

Скрипт для разработчиков и аналитиков Б24

#### Установка:
- установить расширение [TamperMonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- нажать кнопку "добавить скрипт" в меню по кнопке расширения

  ![image](https://github.com/boriskrg/b24-tweaks/assets/45704726/4a0952c8-6e7c-4062-9270-6a58c6bb0fcc)

- скопировать [последнюю версию скрипта](https://raw.githubusercontent.com/boriskrg/b24-tweaks/master/b24-tweaks.js) в редактор кода 
- сохранить (Ctrl+S)

#### Использование:
- скрипт по умолчанию подключается на всех страницах, которые вы посещаете
  - это можно поменять в настройках TamperMonkey во  [вкладке settings](https://www.tampermonkey.net/documentation.php?locale=en#meta:include) скрипта
- скрипт ожидает появления body и объекта BX на странице до таймаута. объект BX есть только на B24 сайтах
- если он находит все что нужно, подключаются фичи выбранные в настройках скрипта
- настройки скрипта можно открыть по клавише F2
- все что делает скрипт видит только человек, который установил себе этот скрипт
- скрипт может что-то сломать на странице, но только у того, кто установил этот скрипт
  - если вы нашли ошибку, можете создать [issue](https://github.com/boriskrg/b24-tweaks/issues/new)

#### Возможности:
- добавлены коды полей в карточке crm, и мб где-то еще где юзаются UF поля

  ![code-details](https://github.com/boriskrg/b24-tweaks/assets/45704726/7b8ec220-e731-4a38-9f56-b03d273faa82)

- добавлены коды полей в заголовках таблиц (гридах). выделение кликом

  ![code-grid-head](https://github.com/boriskrg/b24-tweaks/assets/45704726/a6e9eb8e-8a9d-49b7-b579-2dbe74526840)

- добавлены коды полей в выборе колонок грида

  ![code-grid-selector](https://github.com/boriskrg/b24-tweaks/assets/45704726/057ca9d4-96b2-4c4c-a75e-5d725e0d2006)

- добавлены коды полей в выборе полей в карточках CRM

![code-selector-old](https://github.com/boriskrg/b24-tweaks/assets/45704726/1389156c-bcf6-4696-ba2c-acd0ee8c2061)
![code-selector-new](https://github.com/boriskrg/b24-tweaks/assets/45704726/72d3e00f-3371-4187-996e-fb4cb95d51c4)

- добавлен моноширный шрифт в PHP коде в БП

![bp-php-monospace](https://github.com/boriskrg/b24-tweaks/assets/45704726/cd8b3f4b-5af3-43df-ae2f-4a88d8553f92)

- разворачивание некоторых селектов в БП, чтобы по ним можно было искать

![bp-select-after](https://github.com/boriskrg/b24-tweaks/assets/45704726/ffd8c113-a389-4fe3-9768-af3a52400870)
  
- добавлена кнопка reload для сайд панелей в левом верхнем углу

![sidepanel-reload](https://github.com/boriskrg/b24-tweaks/assets/45704726/61e599d4-ff5e-45d0-ae8c-cc556c718e4e)
