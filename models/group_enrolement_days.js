const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Group_enrolement_days extends Model {
  static get tableName(){
    return "group_enrolement_days"
  }
}
module.exports = Group_enrolement_days;