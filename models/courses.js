const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Courses extends Model {
  static get tableName(){
    return "courses"
  }
}
module.exports = Courses;