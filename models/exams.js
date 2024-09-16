const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Exams extends Model {
  static get tableName(){
    return "exams"
  }
}
module.exports = Exams;