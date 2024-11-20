﻿## Установка ПО для фронта
Для фронта нужно установить Node.js при этом будет установлен также и менеджер пакетов npm.
Нужна 22я версия Node.js x64.
Например, при установке node-v22.11.0-x64 будут установлены node.js версии 22.11.0 и npm версии 10.9.0.
Для просмотра установленных версий нужно выполнить в cmd или в PowerShell следующие команды:
```
node -v
npm -v
```
Результат ввода команд показан на рисунке:

# Установка пакетов для фронта
Для установки пакетов фронта нужно перейти в папке с файлом package.json запустить PowerShell:

После этого в PowerShell нужно выполнить команду:
```
npm i
```
В результате будет создана папка node_modules, содержащая нужные пакеты.
Обычно эта папка содержит сотни тысяч файлов и занимает очень много места, поэтому в любой непонятной ситуации её проще удалить целиком

## Сборка фронта один раз
Сборку фронта, если не предполагается редактирование фронта, можно выполнить один раз с помощью команды в PowerShell или cmd:
```
npm run build
```
В этом случае сборка будет выполнена один раз.

## Запуск сервера для автоматической сборки фронта
Можно также запустить режим автоматического пересобирания фронта при внесении изменений в код. Для этого в PowerShell или cmd нужно выполнить команду:
```
npm run dev
```

Для остановки фронта (если была использована команда npm run dev) нужно либо просто закрыть соответствующее окно PowerShell, либо в английской раскладке в этом окне нажать Ctrl+C.