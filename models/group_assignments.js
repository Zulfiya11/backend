const { Model } = require("objection");
const knex = require("../settings/db");

Model.knex(knex);

class Group_assignments extends Model {
    static get tableName() {
        return "group_assignments";
    }
}
module.exports = Group_assignments;
