const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Group_lesson_report extends Model {
  static get tableName(){
    return "group_lesson_report"
  }
}
module.exports = Group_lesson_report;