const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Group_enrolement_by_student extends Model {
  static get tableName(){
    return "group_enrolement_by_student"
  }
}
module.exports = Group_enrolement_by_student;