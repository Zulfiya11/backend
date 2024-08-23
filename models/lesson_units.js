const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Lesson_unit extends Model {
  static get tableName(){
    return "lesson_units"
  }
}
module.exports = Lesson_unit;