const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Group_student extends Model {
  static get tableName(){
    return "group_student"
  }
}
module.exports = Group_student;