Tim Branyen
===========

Boston, MA

### About ###

This project was released because I enjoy writing open source.

I started with the idea of content being stored in Git instead of a traditional
database.  My content is available as I authored it.  It's even available for
you to change and update.  I wanted to replace the timestamp with a SHA.

Development of this site began in 2011 and has been put through many rewrites.
It is now in a reasonable form for reference or reuse.

### What can this framework do for me? ###

I've implemented several specific ideas that may be useful for you:

* All content is stored is in Git, so files may be referenced by revision.
* A custom template syntax that allows code snippets to be referenced and
  automatically highlighted and embedded.
* A performant production cluster-based server that spawns to your core count.
* Static generation if you don't want to run the above server.
* Grunt-based workflow taking advantage of LiveReload. 
* Theming and easy configuration to customize on your own.
* Optimization of HTML, CSS, and JavaScript.
* Internationalization support.

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
# Ensure all NPM dependencies are installed locally.
npm install

# Make sure you have Grunt CLI installed globally as well.
sudo npm install -g grunt-cli
```

Run the server:

``` bash
# This will compile all Stylus, run a web server on port 1987, and
# automatically refresh the server when files change.
grunt
```

Open your browser to [http://localhost:1987](http://localhost:1987) to view
the contents.

Building:

``` bash
# This will generate static assets and optimize all styles and scripts.
grunt build
```

### Creating a page ###

Creating a page is very simple.  Add a JavaScript file to the server/pages
directory and add the following boilerplate:

``` javascript
// Function to assist with creating pages.
const createPage = require("../util/createPage");

// This function will be called everytime it's requested.
function my_page(req, res) {
  // Pass in the name of an HTML template inside the templates/layouts folder.
  createPage("index", "myPage").then(function(layout, myPage) {
    // Place your page within the layout.
    layout.registerPartial("content", String(myPage));

    // Send the page back to the client.
    res.send(layout.render({
      // A title to be used in the markup.  Any variables you set here will be
      // available within your template.
      title: "My Page!"
    });
  });
}

// Function that will be automatically called in the server/index.js file on
// boot.
module.exports = function(site) {
  site.get("/my-page", my_page);
};
```

### Templates ###

Can be modified within the root templates directory.  They are using the
[Combyne](https://github.com/tbranyen/combyne) template engine.  You can use
this to add custom partials and filters.

You can modify the data that is passed to the templates from the corresponding
server/pages file.

### Setting up content ###

The website framework has been designed to load an external Git repository of
posts and other content.

By default this folder is named `content` and resides in the root of the site.

To create your own content:

``` bash
# Assuming your structure looks like this.
```

### Technical details ###

### Stack ###

