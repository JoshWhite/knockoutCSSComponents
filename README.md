# KnockoutCSSComponents
A knockout binding to allow component specific CSS stylings


Example of use:

```
<style>
 	/* this will affect all elements with .title */
	.title {
		font-size: 200%;
	}
</style>

<h1 class="title">Non Component Title</h1>

<div data-bind="cssComponent: true">
	<style type="text/template">
		/* this rule will only affect elements with .title inside this component */
	  	.title {
			text-decoration: underline;
		}
  	</style>

  <h2 class="title">Component Title</h2>

</div>

```
