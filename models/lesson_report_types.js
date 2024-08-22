const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Lesson_report_types extends Model {
  static get tableName(){
    return "lesson_report_types"
  }
}
module.exports = Lesson_report_types;