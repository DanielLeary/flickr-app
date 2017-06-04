
var flickerAPI = " https://api.flickr.com/services/rest/?jsoncallback=?";
var flickrOpt = {
	method: "flickr.interestingness.getList",
	api_key: "e209cf560e4e5dce9ee23331b47fc924",
	extras: "tags,url_m,description,owner_name",
	per_page: "20",
	page: "1",
	format: "json"
};
 
window.onload = function(){

	var vue = new Vue({
		el: '#app',
		data: {
			photos: {},
			loading: false,
			loadingMessage: "Loading photos...",
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
			getWidth: function(photo){
				return photo.width_m + "px";
			},
			link: function(photo){
				return "https:\/\/www.flickr.com\/photos\/"+photo.owner+"\/"+photo.id;
			},
			tags: function(photo){
				if(photo.tags == ""){
					return "none"
				} else {
					return photo.tagsDisplay.replace(/ /g, ", ");
				}
			},
			toggle: function(photo){
				if (photo.description.toggle == "more"){
					photo.description.content = photo.description._content;
					photo.description.toggle = "less";
				} else {
					photo.description.content = photo.description.short_content;
					photo.description.toggle = "more";
				}
			},
			tagToggle: function(photo){
				if (photo.tagToggle == "more"){
					photo.tagsDisplay = photo.tags;
					photo.tagToggle = "less";
				} else {
					photo.tagsDisplay = photo.tagsShort;
					photo.tagToggle = "more";
				}
			},
			load: function(page){
				var self = this;
				flickrOpt.page = page;
				self.loading = true;

				// Loads the page we're looking for
				$.getJSON( flickerAPI, flickrOpt)
				.done(function( data ) {
					if(data.stat=="fail"){
						self.loadingMessage = "Error - try reloading";
						console.log(loadingMessage);
						console.log("API call failed")
					} else{
						formatDescr(data.photos.photo);
						formatTags(data.photos.photo);
						dedup(data.photos.photo);
						if($.isEmptyObject(self.photos)){
							self.photos = data.photos;
							console.log("First data load:", data);
						} else {
							self.photos.photo = self.photos.photo.concat(data.photos.photo);
							self.photos.page = data.photos.page;
						}
						console.log("Photos:", self.photos);
						self.loading = false;
					}

				});
			}
		},
		computed: {
			filteredPhotos: function(){
				if(!$.isEmptyObject(this.photos)){
					var searchTerm = this.searchTerm.toLowerCase();
					return this.photos.photo.filter(function (photo) {
						var res = photo.tags.toLowerCase().search(searchTerm);
						return res != -1;
					})
				}
			}
		},
	});

	vue.load(1);

	// infinite scroll
	$(window).scroll(function(){
		if  ($(window).scrollTop() == $(document).height() - $(window).height()){
			// run our call for pagination
			vue.load(++vue.photos.page);
		}
	});

}

// Allow each description to be toggled to shortened display or full
function formatDescr(photo){
	for(i=0;i<photo.length;++i){
		if(photo[i].description._content.length > 140){
			photo[i].description.short_content = photo[i].description._content.slice(0,140);
			photo[i].description.toggle = "more";
		} else {
			photo[i].description.short_content = photo[i].description._content;
			photo[i].description.toggle = "none";
		}
		photo[i].description.content = photo[i].description.short_content;

	}
}

function formatTags(photo){
	for(i=0;i<photo.length;++i){
		if(photo[i].tags.length > 80){
			photo[i].tagsShort = photo[i].tags.slice(0,80);
			photo[i].tagToggle = "more";
		} else {
			photo[i].tagsShort = photo[i].tags;
			photo[i].tagToggle = "none";
		}
		photo[i].tagsDisplay = photo[i].tagsShort;

	}
}

function dedup(arr){
	return deduped = arr.filter(function (element, i, arr) {
		var elem1 = findFirstElemWithId(element.id, arr);
		return arr.indexOf(elem1) === i;
	});
}
function findFirstElemWithId(id, arr){
	for (i=0; i<arr.length; ++i){
		if (arr[i].id == id){
			return arr[i];
		}
	}
}
