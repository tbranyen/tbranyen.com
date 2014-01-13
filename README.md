Tim Branyen
===========

Boston, MA

### About ###

I've open sourced this project to demonstrate using several of my projects
together to accomplish a very specific goal for my personal website.

I started with the idea of content being stored in Git instead of a traditional
database.  This allowed me to keep a paper trail of post updates, which would
encourage me to keep posts up-to-date.  Every file can be referenced by a
specific SHA, cool urls don't change.

I began development of this site in 2011 and have put it through many rewrites.
It is now in a reasonable form fit for consumption by other developers for
reference or reuse.

### What can this framework do for me? ###

I've implemented several specific ideas that may be useful for you:

* Grunt-based workflow taking advantage of LiveReload. 
* All content is stored is in Git, so files may be referenced by revision.
* A custom template syntax that allows code snippets to be referenced and
  automatically highlighted and embedded.
* A performant Node.js Cluster-based server that will spawn to your core count.
* Static output to eliminate pegging the Git repository on every reload.
* Theming and easy configuration to customize on your own.
* Optimization of HTML, CSS, and JavaScript.
* Internationalization support.

### Getting started ###

Ensure you have [Node.js](http://nodejs.org/) and [Git](http://git-scm.org/)
installed.

Clone this repository:

``` bash
# Bring down the source.
git clone https://github.com/tbranyen/tbranyen.com.git my-site

# Enter the directory.
cd my-site
```

Install the dependencies.

``` bash
# Ensure all NPM dependencies are installed locally.
npm install

# Make sure you have Grunt CLI installed globally as well.
sudo npm install -g grunt-cli
```

Run the server.

``` bash
# This will compile all Stylus, run a web server on port 1987, and
# automatically refresh the server when files change.
grunt
```

Open your browser to [http://localhost:1987](http://localhost:1987) to view
the contents.

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

