Tim Branyen
===========

San Francisco, CA

### About ###

This project is open source because I enjoy sharing my source code.

I started with the idea of content being stored in Git instead of a traditional
database. Not really novel or unique these days, but I thought it was a cool
idea back in 2011. The content would be fetched and versioned by the commit
SHA. This allows for tracking edits and citing precise versions of the content.
This is opposed to traditional URLs that are fixed on title and date.

### What can this framework do for me? ###

I've implemented several specific ideas that may be useful for you:

* All content is stored is in Git, so files may be referenced by revision.
* A custom template syntax that allows code snippets to be referenced and
  automatically highlighted and embedded.
* A performant production cluster-based server that spawns to your core count.
* Static generation if you don't want to run the above server.
* Grunt-based workflow taking advantage of LiveReload. 
* Theming and easy configuration to customize on your own.
* HTML, CSS, and JavaScript optimizations.

### Getting started ###

Ensure you have [Node.js](http://nodejs.org/) and [Git](http://git-scm.org/)
installed.

Clone this repository:

``` bash
# Bring down the source, with just the latest commit.
git clone --depth=1 https://github.com/tbranyen/tbranyen.com.git my-site

# Enter the directory.
cd my-site
```

Install the dependencies:

``` bash
# Ensure all NPM dependencies are installed.
npm install
```

Run the server:

``` bash
# This will compile all Stylus, run a web server on port 1987, and
# automatically refresh the server when files change.
npm start
```

Open your browser to [http://localhost:1987](http://localhost:1987) to view the
contents.

### Setting up a content repo ###

The website framework has been designed to load an external Git repository of
posts and other content.  *Note this is optional.*

By default this folder is named **content** and resides in the root of the
site.  There are many ways to work with a nested Git repository, including
Git submodules.

To create your own content:

``` bash
# In some folder outside of my-site.
git init site-content

# Enter the newly cloned site.
cd mysite

# Now symlink the content into this project.
ln -s path/to/site-content content
```

You can now create directories and files and reference them within the website.

### Creating a page ###

To create a new page, start with the template:

``` html
{%render layouts/index as content%}
  {{pageVar}}
{%endrender%}
```

Add a JavaScript file, such as myPage.js, to the server/pages directory and add
the following boilerplate:

``` javascript
// This function will be called everytime it's requested.
function my_page(req, res) {
  // Pass in the name of an HTML template inside the templates/ directory.
  res.render("myPage", {
    // Top level properties are sent to the layout.
    title: "My Page!",

    // Inside the layout there is a custom partial named content which is where
    // pages are rendered to, custom data is also passed:
    page: {
      pageVar: "something"
    }
  });
}

// This function will be automatically called in the server/index.js file on
// boot.
module.exports = function(site) {
  site.get("/my-page", my_page);
};
```

### Templates ###

Can be modified within the root templates directory.  They are using the
[Combyne](https://github.com/tbranyen/combyne) template engine.  You can use
this to add custom partials and filters.

### License ###

MIT 2016 Tim Branyen
