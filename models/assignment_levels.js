const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Assignment_levels extends Model {
  static get tableName(){
    return "assignment_levels"
  }
}
module.exports = Assignment_levels;