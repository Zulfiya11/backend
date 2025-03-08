const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Group_student_assignments extends Model {
  static get tableName(){
    return "group_student_assignments"
  }
}
module.exports = Group_student_assignments;