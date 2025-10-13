import jwt from 'jsonwebtoken';
 import { Employee } from '../model/employee.model.js';
 import { LoginLogs } from '../model/login_logs.model.js';
//  import { Roles } from '../model/role.model.js';
import crypto from 'crypto';
 const login = async (req, res) => {

    try {

      const {
      password,
      email
      } = req.body

      console.log(req.body)

      if(!password || !email){
        return res.status(401).json({
          message: 'All Fields Are Required'
        })
      }

      const hashedPassword = crypto
      .createHash("sha1")
      .update(password)
      .digest("hex");

      // console.log(hashedPassword)

      const user = await Employee.findOne({
         where: { em_email: email, em_password: hashedPassword }
      });

      console.log("Found user:", user ? user.toJSON() : null);

    if(!user){
      return res.status(401).json({
        message: 'Invalid Credentails'
      })
    };


  //  const isMatch = await bcrypt.compare(password, user.em_password);
  //   if (!isMatch) {
  //     return res.status(401).json({ message: "Invalid credentials" });
  //   }

  //   console.log(isMatch)

    const token = jwt.sign({
      id: user.em_id,
      roleId: user.role_id,
      role: user.em_role,
      email: user.em_email
    },"this is recruite portal json web token secret key",{
      expiresIn: "10h"
    })

    await LoginLogs.create({
      emp_id: user.em_id,
      user_id: user.id,
      emp_role: user.em_role,
      action: "Successfully Login",
      login_date: new Date(),
      ip_address: req.ip,
    })
    

    return res.status(200)
           .json({
            message: "Login Successfully",
            token
           })

    } catch (error) {
      console.log(error);
        return res.status(500).json({
            message: "Error while login"
        })
    }
 }

 export {
   login
 }