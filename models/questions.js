const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Questions extends Model {
  static get tableName(){
    return "questions"
  }
}
module.exports = Questions;