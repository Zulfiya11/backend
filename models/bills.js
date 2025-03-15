const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Bills extends Model {
  static get tableName(){
    return "bills"
  }
}
module.exports = Bills;