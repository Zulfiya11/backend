const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Rooms extends Model {
  static get tableName(){
    return "rooms"
  }
}
module.exports = Rooms;