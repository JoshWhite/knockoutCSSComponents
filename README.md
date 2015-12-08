# KnockoutCSSComponents
A knockout binding to allow component specific CSS stylings


Example of use:

```
<h1 class="title">Non Component Title</h1>

<div data-bind="component: true" data-component-style="
  .title {
    background: blue;
  }
">

  <h2 class="title">Component Title</h2>

</div>

```
