const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Options extends Model {
  static get tableName(){
    return "options"
  }
}
module.exports = Options;