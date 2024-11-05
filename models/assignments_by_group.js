const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Assignments_by_group extends Model {
    static get tableName() {
        return "assignments_by_group";
    }
}
module.exports = Assignments_by_group;
