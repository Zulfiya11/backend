const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Question_levels extends Model {
  static get tableName(){
    return "question_levels"
  }
}
module.exports = Question_levels;