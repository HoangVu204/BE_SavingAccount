const express = require('express');
const router = express.Router();
const authMiddlewares = require("../../middlewares/auth.middleware.js")
const savingType = require('../../controllers/admin/savingType.controller.js')


router.post('/create', savingType.createSavingType);
router.get('/', savingType.getSavingTypes);
router.delete('/:id', savingType.createSavingType);
router.patch('/:id', savingType.updateSavingType);


module.exports = router;