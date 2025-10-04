import { Roles } from "../model/role.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createRoles = async(req, res) => {

    const{ roleName } = req.body;
    try {
     
        const checkRoleExisted = await Roles.findOne({
            where: { rolename: roleName }
        })

        if(checkRoleExisted){
          return res.status(500).json(new ApiResponse(500,{},'role already existed'))
        }

       const role =  await Roles.create({
            rolename: roleName,
            status: "1"
        })

        return res.status(200).json(new ApiResponse(200,role,'role created successfully'))
    } catch (error) {
        console.log(error);
      return res.status(500).json(new ApiResponse(500,{},error?.message))
    }
}

const updateRoles =  async(req, res) => {

    const {id} = req.query;
    const { roleName } = req.body;

    try {
     const role = await Roles.findByPk(id);
    if (!role) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Role not found"));
    }

    role.rolename = roleName;
    await role.save();

    return res
      .status(200)
      .json(new ApiResponse(200, role, "Role updated successfully"));

    } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, error.message || "Internal server error while updating roles"));
    }
}


 const getRole = async(req, res) => {
        try {
            const roles = await Roles.findAll();

            if(roles.length === 0) {
                return res.status(400).json({message: "No roles found"});
            }

            return res.status(200).json({message: "Roles fetched successfully", roles});

        } catch (error) {
            return res.status(500).json({
                message: "error while getting roles from database"
            })
        }
    }


export { 
    createRoles,
    updateRoles,
    getRole
}