## closet方法的实现

```
/**
 * 检查目标元素是否有特定选择器
 * @param {dom} el 
 * @param {string} selector 
 */
function matches (el, selector) {
  if (!selector || !el || el.nodeType !== 1) {
    return false
  }
  let matchesSelector = el.matches 
    || el.webkitMatchesSelector 
    || el.mozMatchesSelector 
    || el.msMatchesSelector

  if (matchesSelector) {
    return matchesSelector.call(el, selector)
  }

  let nodes = (el.parentNode || el.document).querySelectorAll(selector)
  let i = -1;
  while (nodes[++i] && nodes[i] != el)
  return !!nodes[i]
}

```

```

/**
 * 从元素本身开始，逐级向上级元素匹配，并返回最先匹配selector的元素。
 * 
 * @param {dom} el 
 * @param {string} selector 
 */
function closest(el, selector) {
  while (el) {
    if (matches(el, selector)) {
        break
    }
    el = el.parentElement
  }
  return el
}

```