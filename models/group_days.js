const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Group_days extends Model {
  static get tableName(){
    return "group_days"
  }
}
module.exports = Group_days;