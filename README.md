## Quick Start
1. Make sure you have these installed
    * [node.js](http://nodejs.org/)
    * [yarn](https://yarnpkg.com/en/)
    * [gulp](http://gulpjs.com/)
    * [sass](http://sass-lang.com/)
    * [browserify](http://browserify.org/)

2. Clone repository `git clone https://github.com/logustra/arsitag-angular-old.git`
3. CD to the folder `cd arsitag-angular-old` 
4. Run `yarn install`
5. Run `yarn build` to start production
6. Run `yarn start` to start development
7. Happy to use :) 

## Architecture Sass
Properly architecting your Sass project is a crucial starting point to having a maintainable, scalable, and well-organized project. Sass makes separating your project into logical “modules” simple with the `@import` directive, which acts differently than the native CSS `@import` directive in that it **includes** `.scss` **or** `.sass` **files before the final CSS output.**

You can [read the documentation on the](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#import) `@import` [directive](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#import) to get a good idea of how you can use it to include partial files.

There are many project architectures that you can employ in your project, and each might have their pros and cons. The important thing is that you **choose one and stick with it**. In this article, The **7-1 Pattern** by Hugo Giraudel will be used. To summarize, there are **seven** folders and **one** `main.scss` file for output:

- `base/` – contains global styles, such as resets, typography, colors, etc.
- `components/` – contains each self-contained component in its own .scss partial
- `layout/` – contains styling for larger layout components; e.g. nav, header, footer, etc.
- `pages/` – contains page-specific styling, if necessary
- `themes/` – contains styling for different themes
- `utils/` – contains global mixins, functions, helper selectors, etc.
- `vendors/` – contains 3rd-party styles, mixins, etc.
- `main.scss` – output file that brings together all of the above parts

Reference : [scotch.io](https://scotch.io/tutorials/aesthetic-sass-1-architecture-and-style-organization)

## Naming convention
* Controllers — [file_name].ctr.js
* Templates — [file_name].tpl.html
* Directives — [file_name].dir.js
* Factories — [file_name].fac.js
* Values — [file_name].val.js
* Services — [file_name].ser.js
* Modules — [app_name].[module_name].js

File Structure Reference : [blog.revillweb.com](https://blog.revillweb.com/angularjs-by-example-project-structure-and-modularity-ace27d0357ea) and [scotch.io](https://scotch.io/tutorials/angularjs-best-practices-directory-structure)
