const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Lessons_report_types extends Model {
  static get tableName(){
    return "lesson_report_types"
  }
}
module.exports = Lessons_report_types;