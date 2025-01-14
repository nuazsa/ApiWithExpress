import dbPool from '../config/database.js';
import bcryptjs from 'bcryptjs';
import ResponseError from '../utils/response-error.js';
import {validate} from '../validation/validation.js';
import {registerUserValidation, loginUserValidation} from '../validation/user-validation.js';

const register = async (request) => {
  try {
    const {name, email, password} = validate(registerUserValidation, request);

    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    const passwordHash = await bcryptjs.hash(password, 10);

    const [result] = await dbPool.execute(query, [name, email, passwordHash]);
    return result;   
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY") throw new ResponseError(409, "Email already in use");
    throw (e);
  }
}

const login = async (request) => {
  try {
    const {email, password} = validate(loginUserValidation, request);

    const query = 'SELECT user_id, name, password FROM users WHERE email = ? LIMIT 1';
    const [result] = await dbPool.execute(query, [email]);
  
    if (!result.length) throw new ResponseError(401, "Invalid email or password");
  
    const user = result[0];
    const passwordMatch = await bcryptjs.compare(password, user.password);
  
    if (!passwordMatch) throw new ResponseError(401, "Invalid email or password");
  
    return user;
  } catch (e) {
    throw (e);
  }
}

export default {
  register,
  login
}