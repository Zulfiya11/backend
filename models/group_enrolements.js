const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Group_enrolements extends Model {
  static get tableName(){
    return "group_enrolements"
  }
}
module.exports = Group_enrolements;