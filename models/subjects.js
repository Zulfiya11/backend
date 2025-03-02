const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Subjects extends Model {
  static get tableName(){
    return "subjects";
  }
}
module.exports = Subjects;