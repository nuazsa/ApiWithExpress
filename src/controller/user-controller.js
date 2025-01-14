import userService from '../service/user-service.js';
import jwt from 'jsonwebtoken';

const register = async (req, res, next) => {
  try {
    await userService.register(req.body);

    res.status(201).json({
      error: false,
      message: "User created"
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await userService.login(req.body);
    
    const token = jwt.sign({ 
      id: user.user_id, 
      name: user.name,
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      error: false,
      message: "Success",
      loginResult: {
        userId: user.user_id,
        name: user.name,
        token: token
      },
    });
  } catch (e) {
    next(e);
  }
}

export default {
  register,
  login,
};