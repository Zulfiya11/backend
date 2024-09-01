const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Days extends Model {
  static get tableName(){
    return "days"
  }
}
module.exports = Days;