const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Modules extends Model {
  static get tableName(){
    return "modules"
  }
}
module.exports = Modules;