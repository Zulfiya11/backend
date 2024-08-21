const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Assignment_types extends Model {
  static get tableName(){
    return "assignment_types"
  }
}
module.exports = Assignment_types;