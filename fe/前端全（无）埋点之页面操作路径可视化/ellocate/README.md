ellocate.js
===========

A jQuery plugin for generating element locators. Ellocate generates both CSS selectors and XPath expressions.

## Usage

```javascript

$('#foo').ellocate();

//Returns: { xpath: "//html[1]/body[1]/div[@id='foo']", css: "html > body > div#foo" }
```
