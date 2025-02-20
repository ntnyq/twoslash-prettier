---
layout: home
---

<Hero />

::: code-group

<!-- prettier-ignore -->
```ts [ts.ts] prettier-check
// singleQuote: true
console.log("hello world");

// tabWidth: 2
    console.log('hello world')

// semi: false
const name = 'foobar';

// printWidth: 80
foo(reallyLongArg(),omgSoManyParameters(),IShouldRefactorThis(),isThereSeriouslyAnotherOne());

// arrowParens: 'avoid'
const isOdd = (n) => n % 2 === 1

// trailingComma: 'none'
const arr = {
  name: 'foobar',
  age: 123,
}

// quoteProps: 'as-needed'
const foobar = {
  'name': 'foobar'
}

// endOfLine: 'lf'
```

<!-- prettier-ignore -->
```css [css.css] prettier-check
body{
  background-color: red;
}

.text-red {
    color: red;
}

.image {
  background-image: url("/foo.png");
}
```

<!-- prettier-ignore -->
```vue [vue.vue] prettier-check
<script lang="ts" setup>
import { useTemplateRef } from 'vue';

const modelValue = ref('')
const inputRef = useTemplateRef('inputRef'   )

function handleChange () {
  console.log(inputRef.value.value)
}
</script>

<template>
  <ElInput @change="handleChange" v-model.trim="modelValue" ref="inputRef" placeholder="Enter to search" clearable />
</template>
```

<!-- prettier-ignore -->
```json [json.json] prettier-check
{
  "name": "foobar",
  "fruits": [
    "apple","banana","pear","orange","mango","grape","watermelon","peach","pineapple","strawberry"
  ]
}
```

<!-- prettier-ignore -->
```html [html.html] prettier-check
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>Hello world</title>
  </head>
<body></body>
</html>
```

:::
