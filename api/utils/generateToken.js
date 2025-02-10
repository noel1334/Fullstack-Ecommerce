import jwt from 'jsonwebtoken';

const generateToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export default generateToken;
