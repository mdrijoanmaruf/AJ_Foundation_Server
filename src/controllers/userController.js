const mongoose = require('mongoose');

// Get users collection
const getUsersCollection = () => {
  return mongoose.connection.collection('users');
};

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res, next) => {
  try {
    const usersCollection = getUsersCollection();
    const users = await usersCollection.find({}).toArray();
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Public
const getUser = async (req, res, next) => {
  try {
    const usersCollection = getUsersCollection();
    const user = await usersCollection.findOne({ 
      _id: new mongoose.Types.ObjectId(req.params.id) 
    });
    
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Public
const createUser = async (req, res, next) => {
  try {
    const usersCollection = getUsersCollection();
    const { name, email, password } = req.body;
    
    // Check if user exists
    const userExists = await usersCollection.findOne({ email });
    
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }
    
    const newUser = {
      name,
      email,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await usersCollection.insertOne(newUser);
    const user = await usersCollection.findOne({ _id: result.insertedId });
    
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Public
const updateUser = async (req, res, next) => {
  try {
    const usersCollection = getUsersCollection();
    const updateData = {
      ...req.body,
      updatedAt: new Date(),
    };
    
    const result = await usersCollection.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(req.params.id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      res.status(404);
      throw new Error('User not found');
    }
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Public
const deleteUser = async (req, res, next) => {
  try {
    const usersCollection = getUsersCollection();
    const result = await usersCollection.deleteOne({ 
      _id: new mongoose.Types.ObjectId(req.params.id) 
    });
    
    if (result.deletedCount === 0) {
      res.status(404);
      throw new Error('User not found');
    }
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
