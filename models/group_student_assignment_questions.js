const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Group_student_assignment_questions extends Model {
  static get tableName(){
    return "group_student_assignment_questions"
  }
}
module.exports = Group_student_assignment_questions;