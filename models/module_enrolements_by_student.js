const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Module_enrolement_by_student extends Model {
  static get tableName(){
    return "module_enrolement_by_student"
  }
}
module.exports = Module_enrolement_by_student;