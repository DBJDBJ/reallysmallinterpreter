- [jQuery One-liners](#jquery-one-liners)
  - [Elements \& Styling](#elements--styling)
  - [DOM Traversal \& Selection](#dom-traversal--selection)
  - [Events \& Interaction](#events--interaction)
  - [AJAX \& Content](#ajax--content)
  - [Dump / Inspect](#dump--inspect)

# jQuery One-liners

## Elements & Styling

**Toggle a class**
```js
$('#myButton').click(() => $('#box').toggleClass('active'));
```

**Change multiple CSS rules**
```js
$('.text').css({ 'color': 'red', 'font-size': '16px', 'background': '#fff' });
```

**Smoothly reveal/hide**
```js
$('#toggleDiv').slideToggle('slow');
```

**Fade out and delete**
```js
$('.alert').fadeOut(300, function() { $(this).remove(); });
```

---

## DOM Traversal & Selection

**Find closest matching parent**
```js
$(this).closest('.container').addClass('highlight');
```

**Select all sibling items**
```js
$(this).siblings().removeClass('selected');
```

**Check if element exists**
```js
if ($('#myElement').length) { /* code here */ }
```

**Clear all form fields**
```js
$('form#myForm')[0].reset();
```

---

## Events & Interaction

**Simple click toggle**
```js
$('#menu-btn').on('click', () => $('#menu').toggle());
```

**Disable button on click**
```js
$('button').click(function() { $(this).prop('disabled', true); });
```

**Scroll smoothly to top**
```js
$('html, body').animate({ scrollTop: 0 }, 'slow');
```

**Delegate events dynamically**
```js
$('#list').on('click', 'li', function() { $(this).toggleClass('done'); });
```

---

## AJAX & Content

**Load HTML into a container**
```js
$('#result').load('snippet.html #targetContent');
```

**Fetch and parse JSON API**
```js
$.getJSON('api/data', data => console.log(data));
```

**Update element text safely**
```js
$('.username').text(newUserName);
```

---

## Dump / Inspect

**Dump any object readably (real newlines and tabs)**
```js
JSON.stringify($("body").html(), null, "\t").replace(/\\n/g, "\n").replace(/\\t/g, "\t")
```

