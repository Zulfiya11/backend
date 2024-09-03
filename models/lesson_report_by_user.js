const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Lesson_report_by_user extends Model {
  static get tableName(){
    return "lesson_report_by_user"
  }
}
module.exports = Lesson_report_by_user;