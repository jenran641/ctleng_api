
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");

const {
  list_noSuper,
  add,
  update,
  del,
} = require('../controllers/user.js')

router.get    ( '/list_noSuper',        list_noSuper );
router.post   ( '/add',                 add );
router.post   ( '/update',              update );
router.delete ( '/:email',                        del );

module.exports = router;
