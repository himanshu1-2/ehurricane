const express =  require('express');
const {
authUser,
registerUser,
logoutUser,
getUserProfile,
updateUserProfile,
getUsers,
deleteUser,
getUserById,
updateUser,
} =  require('../controllers/userController.js');
const { protect, admin } =  require('../middleware/authMiddleware.js');

const router = express.Router();

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

 module.exports=router;
