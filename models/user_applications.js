const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class User_applications extends Model {
  static get tableName(){
    return "user_applications"
  }
}
module.exports = User_applications;