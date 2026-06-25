const { PrismaConfig } = require('../src/config');
const bcrypt = require("bcrypt")

async function main(){
    const hashPassword = await bcrypt.hash('Admin@123', 10)

    const createAdmin = await PrismaConfig.user.create({
        data: {
            name:     'Administrator User Account',
            email:    'admin@test.com',
            password: hashPassword,
            address:  '123 Admin Street Address',
            role:     'ADMIN'
        }
    })

    console.log("Admin Email", createAdmin.email)
}

main()
.catch(console.error)
.finally(() => PrismaConfig.$disconnect())

