const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Groups extends Model {
  static get tableName(){
    return "groups"
  }
}
module.exports = Groups;