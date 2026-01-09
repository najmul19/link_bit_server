function generateShortCode(length = 6) {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < length; i += 1) {
    const index = Math.floor(Math.random() * chars.length);
    code += chars[index];
  }
  return code;
}

module.exports = generateShortCode;
