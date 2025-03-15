const router = require('express').Router()
const leadsController = require('../controller/leadsController')



router.post('/create', leadsController.createLead)

router.get("/all", leadsController.getAllLeads);

router.post("/answer/:id", leadsController.answerLead);




module.exports = router




