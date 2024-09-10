const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Group_attendance extends Model {
  static get tableName(){
    return "group_attendance"
  }
}
module.exports = Group_attendance;