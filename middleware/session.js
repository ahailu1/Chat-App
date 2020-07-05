
function verifyToken(req, res, next) {
  const getToken = req.headers.authorization;
  if (typeof getToken !== 'undefined' || '') {
    const token = getToken.replace('Bearer', '');
    req.token = token;
    next();
  } else {
    res.status(403);
  }
}
module.exports = verifyToken;
