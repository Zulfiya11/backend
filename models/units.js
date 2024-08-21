const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Units extends Model {
  static get tableName(){
    return "units"
  }
}
module.exports = Units;