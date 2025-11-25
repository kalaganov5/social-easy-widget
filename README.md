Использование на сайте
```
const ewcConfig = {
  'id': '34_314159265358980', // маска: userId_subscriptionId
  'social': 'whatsapp', // instagram, facebook, whatsapp, vk, messenger, telegram, x, linkedin
  'user': '99500000000', // имя пользователя в соц сети
  'text-cta': 'Нужна помощь?', // текст длина 20 - 25 символов
  'text-offer': 'Пишите в WhatsApp', // текст длина 20 - 25 символов
  // Опционально
  'delay': '0', // задержка показа виджета
  'background-color': '#444857', // фоновый цвет для подложки
  'isAnimationDisabled': false, // задержка показа виджета true - выключить || false по умолчанию
}
```

Еще пример
```
<div id="net-easy-widget" data-new="{
    'social':'whatsapp',
    'user':'000000?text=Здравствуйте!%20Меня интересует%20{{page_title}}',
    'background-color':'',
    'text-cta':'Есть вопросы?',
    'text-offer':'Пишите в WhatsApp',
    'style':'',
    'delay':'5',
    'isAnimationDisabled' :''
    }"></div>

<script src="https://cdn.jsdelivr.net/gh/kalaganov5/social-easy-widget@main/dist/main.js"></script>
```

```
<script id="net-easy-widget" type="module" data-new="{
    'social':'custom',
    'user':'https://example.com/support',
    'background-color':'#2B2D42',
    'text-cta':'Нужна подсказка?',
    'text-offer':'Свяжитесь с нами',
    'delay':'2',
    'isAnimationDisabled':'true',
    'custom-icon':'<img src=\'https://lexquill.com/wp-content/uploads/2023/04/danilov-andrey.jpg\' alt=\'Support\' width=\'48\' height=\'48\' />'
    }" src="/main.js"></script>

```