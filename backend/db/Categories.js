
//Los ID'S de la APP son númericos, mientras que los de mercado libre son alfanuméricos o string.
const categories = [];


let idApp = 0;

class Category {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}


module.exports = {
  categories,
  Category
}

