# flickr-app

You can load the single page app locally by simply dragging index.html into your browser window.

## Live demo
Try the [live demo](https://flickr-leary.netlify.com/) hosted by Netlify.

## Design

The app uses ajax JSONP to load images from flickr interestingness endpoint. It uses the [vue.js](https://vuejs.org/) framework to manage the frontend. It has the following features:
- **Infinite scroll** - reloads next page over the network and deduplicates results as pages may have overlapping items over time.
- **Tag filtering** - instant search filtering over tags of loaded images.
- **Description + tag collapse** - expand and collapse long descriptions or tag lists so it doesn’t clutter the UI view. This was achieved by adding alternative formatting properties to each photo object when the data is loaded.
	- An alternative approach could be to use jQuery to modify the html description element, leaving the models unchanged, however I felt that handling within vue.js was preferable for cleaner, simpler code that can’t break vue.js data bindings.
