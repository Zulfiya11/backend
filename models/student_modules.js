const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Student_modules extends Model {
  static get tableName(){
    return "student_modules"
  }
}
module.exports = Student_modules;