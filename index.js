var photos;

function jsonFlickrFeed(data) {
	console.log(data);
	photos = data.items;
	return data;
}

window.onload = function(){
	console.log(photos);

	var vue = new Vue({
		el: '#app',
		data: {
			photos: photos,
			searchTerm: ""
		},
		methods: {
			title: function(photo){
				if(photo.title=="" || photo.title==" "){
					return "Untitled";
				} else {
					return photo.title;
				}
			},
			author: function(photo){
				return photo.author.split("\"")[1];
			},
			getWidth: function(photo){
				return photo.description.split("width=\"")[1].split("\"")[0];
			},
			tags: function(photo){
				if(photo.tags == ""){
					return "none"
				} else {
					return photo.tags.replace(/ /g, ", ");
				}
			}
		},
		computed: {
			filteredPhotos: function(){
				var searchTerm = this.searchTerm.toLowerCase();
				return this.photos.filter(function (photo) {
					var res = photo.tags.toLowerCase().search(searchTerm);
					return res != -1;
				})
			}
		},
	});
}
