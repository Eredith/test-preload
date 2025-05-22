// Create a new file to store your asset cache
const assetCache = {
  images: {},
  getImage: function(key) {
    return this.images[key] || null;
  },
  addImage: function(key, image) {
    this.images[key] = image;
  }
};

export default assetCache;