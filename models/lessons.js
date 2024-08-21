const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Lessons extends Model {
  static get tableName(){
    return "lessons"
  }
}
module.exports = Lessons;