const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Group_lessons extends Model {
  static get tableName(){
    return "group_lessons"
  }
}
module.exports = Group_lessons;