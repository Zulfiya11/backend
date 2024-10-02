const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Assignments_by_groupstudent extends Model {
  static get tableName(){
    return "assignments_by_groupstudent"
  }
}
module.exports = Assignments_by_groupstudent;