import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);
const adminHash = bcrypt.hashSync('admin123', salt);
const customerHash = bcrypt.hashSync('customer123', salt);
console.log(adminHash.replace(/\$2b\$/, '\$2a\$'));
console.log(customerHash.replace(/\$2b\$/, '\$2a\$'));
