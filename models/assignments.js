const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Assignments extends Model {
  static get tableName(){
    return "assignments"
  }
}
module.exports = Assignments;