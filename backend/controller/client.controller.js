import { Client } from "../model/client.model.js";
import { ClientRegistration } from "../model/client2.model.js";
import { shift_patterns } from "../model/shift_patterns.model.js";
import { Payrate } from "../model/payrate.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { client_needs } from '../model/client_needs.model.js';
import { careFacility } from '../model/care_facility.model.js';
import { Op } from "sequelize";

const registerClient = async(req, res) => {

    try {
        
    const {
      client_id,
      client_organisation,
      parent_entity,
      post_code,
      postal_address,
      address_list,
      vat_number,
      registration_no,
      website,
      monthly_cost,
      subscription,
      monthly_payroll,
      payroll_timesheet,
      no_payroll,
      contact_name,
      contact_position,
      contact_email,
      contact_number,
      lane_code,
      contact_mobile,
      mobile_code,
      finance_name,
      finance_position,
      finance_number,
      finance_mobile_code,
      finance_mobile,
      finance_email,
      finance_entity_address,
      finance_credit_limit,
      billing_name,
      billing_position,
      billing_number,
      billing_mobile_code,
      billing_mobile,
      billing_email,
      billing_entity_address,
      step2_data,
      shift_pattern,
      payrate
    } = req.body

    console.log("Received form data:", req.body);

    let client_logo = req.files?.client_logo ? req.files.client_logo[0].filename : "";
    let uploadFile = req.files?.upload ? req.files.upload[0].filename : "";

   let client = await Client.findOne({ where: { main_email: contact_email } });
   
    
    if (!client) {
       client = await Client.create({
        client_organisation,
        parent_entity,
        post_code,
        place: postal_address,
        register_address: address_list,
        vat_number,
        company_reg: registration_no,
        website,
        client_logo,
        subscription_type: subscription,
        monthly_cost,
        monthly_payroll,
        payroll_timesheet,
        no_payroll,
        upload: uploadFile,
        main_fullName: contact_name,
        main_position: contact_position,
        main_email: contact_email,
        lan_number: contact_number? contact_number.slice(2):"",
        lan_code: lane_code,
        mobile_number: contact_mobile? contact_mobile.slice(2):"",
        mobile_code,
        finance_name: finance_name || "",            
        finance_position: finance_position || "",
        finance_no: finance_number || "",
        finance_mobile_code: finance_mobile_code || "",
        finance_mobile: finance_mobile || "",
        finance_email: finance_email || "",
        finance_entity_address: finance_entity_address || "",
        finance_cradit_limit: finance_credit_limit || 0,
        billing_name,
        billing_position,
        billing_number,
        billing_mobile_code,
        billing_mobile,
        billing_email,
        billing_entity_address,
        created_on: new Date(),
        updated_on: new Date(),
        created_by: req.user?.id || null,
        updated_by: req.user?.id || null
      });
    } else {
        await Client.update({
        client_organisation,
        parent_entity,
        post_code,
        place: postal_address,
        register_address: address_list,
        vat_number,
        company_reg: registration_no,
        website,
        client_logo,
        subscription_type: subscription,
        monthly_cost,
        monthly_payroll,
        payroll_timesheet,
        no_payroll,
        upload: uploadFile,
        main_fullName: contact_name,
        main_position: contact_position,
        main_email: contact_email,
        lan_number: contact_number? contact_number.slice(2):"",
        lan_code: lane_code,
        mobile_number: contact_mobile? contact_mobile.slice(2):"",
        mobile_code,
        finance_name,
        finance_position,
        finance_no: finance_number,
        finance_mobile_code,
        finance_mobile,
        finance_email,
        finance_entity_address,
        finance_cradit_limit: finance_credit_limit,
        billing_name,
        billing_position,
        billing_number,
        billing_mobile_code,
        billing_mobile,
        billing_email,
        billing_entity_address,
        updated_on: new Date()
      }, { where: { id: client_id } });

      client = { id: client_id };
    }

    const insertedIds = [];
    
    if (Array.isArray(step2_data)) {
      for (let i = 0; i < step2_data.length; i++) {
        const item = step2_data[i];
        let needs = Array.isArray(item.client_need?.[i]) ? item.client_need[i].join(",") : item.client_need?.[i] || "";
        const data = {
      client_id: client.id,
      post_code: item.post_code1,
      place: item.place,
      address: item.address,
      address_type: item.type,
      entity_name: item.entity_name,
      care_type: item.care_facility,
      client_need: needs,
      facility_contact_name: item.facility_contact_name || "",
      landline_code: item.facility_lane_code || "",
      mobile_code: item.facility_mobile_code || "",
      landline_no: item.facility_contact_landline_no || "",
      mobile_no: item.facility_contact_mobile_no || "",
      email: item.facility_contact_email || "",
      created_on: new Date(),
      created_by: req.user?.id                                                                                                                                                                 ,
      updated_on: new Date(),
    };

    if (item.data_id) {
      await ClientRegistration.update(data, {
        where: { id: item.data_id, client_id: client.id }
      });
    } else {
      const step2 = await ClientRegistration.create(data);
      insertedIds.push(step2.id);
    }
  }
}
    if (Array.isArray(shift_pattern)) {
  for (const shift of shift_pattern) {
    const data = {
      sr: shift.sr_no,
      shift_pattern: shift.shift_pattern,
      shift_type: shift.shift_type,
      shift_start: shift.shift_start,
      shift_end: shift.shift_end,
      remarks: shift.remarks,
      updated_by: req.user?.id || null,
      updated_on: new Date(),
      created_by: req.user?.id,
    };

    if (shift.shiftid) {
      await shift_patterns.update(data, {
        where: { id: shift.shiftid }
      });
    } else {
      await shift_patterns.create({
        ...data,
        client_id: client.id,
        created_by: req.user?.id || null,
        created_on: new Date()
      });
    }
  }
}
if (Array.isArray(payrate)) {
  for (const rate of payrate) {
    const data = {
      client_id: client.id,
      job_title: rate.job_title,
      regular_day_morning: rate.regular_day_morning || 0,
      regular_day_afternoon: rate.regular_day_afternoon || 0,
      regular_day_night: rate.regular_day_night || 0,
      regular_day_weekend_morning: rate.regular_day_weekend_morning || 0,
      regular_day_weekend_afternoon: rate.regular_day_weekend_afternoon || 0,
      regular_day_weekend_night: rate.regular_day_weekend_night || 0,
      regular_day_sleep_in: rate.regular_day_sleep_in || 0,
      regular_day_waking_night_weekday: rate.regular_day_waking_night_weekday || 0,
      regular_day_waking_night_weekend: rate.regular_day_waking_night_weekend || 0,
      bank_holiday_morning: rate.bank_holiday_morning || 0,
      bank_holiday_afternoon: rate.bank_holiday_afternoon || 0,
      bank_holiday_night: rate.bank_holiday_night || 0,
      bank_holiday_sleep_in: rate.bank_holiday_sleep_in || 0,
      bank_holiday_waking_night: rate.bank_holiday_waking_night || 0,
      status: 1,
      created_by: client_id,
      updated_by: client_id,
      created_on: new Date(),
      updated_on: new Date()
    };

    console.log("Payrate Data:", data);

    if (rate.id) {
      await Payrate.update(data, { where: { id: rate.id, client_id: client.id } });
    } else {
      const payrate = await Payrate.create(data);
      console.log("Created Payrate:", payrate);
    }
  }
}
  return res.status(200).json({
      status: 200,
      success: true,
      message: client_id
        ? "Client details updated successfully"
        : "Client registered successfully",
      client_id: client.id,
      inserted_step2_ids: insertedIds,
    });

    } catch (error) {
      console.error("Error in registerClient:", error);
        return res.status(500).json(new ApiResponse(500, {}, error.message));
    }
}



const getParentEntity = async(req, res) => {
    try {
        const parentEntity = await Client.findAll({
            where: {
                status: "1",
            },
            attributes: ["client_organisation"]
        })

      return res.status(200).json(new ApiResponse(200, parentEntity, "Parent Entity Fetched Successfully"));
    } catch (error) {
     return res.status(500).json(new ApiResponse(500, {}, error.message));
    }
}

 const getAllClientInfo = async(req, res) => {
  try {
    const clients = await Client.findAll({
      where: { 
        status: "1",
        deleted: { [Op.ne]: "Y" }
       },
      attributes:[
        "id",
        "client_organisation",
        "parent_entity",
        "post_code",
        "place",
        "register_address",
        "main_fullName",
        "mobile_number",
        "main_email",
        "main_position",
        "vat_number",
        "company_reg",
      ]
    })
      
    return res.status(200).json(new ApiResponse(200, clients, "clients Fetched Successfully"))
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, {}, error.message));
  }
 }

  const getClientInfoById = async(req, res) => {

    const { id } = req.query;

    console.log("id", id)
  try {
    const clients = await Client.findAll({
      where: { 
        id: id,
        deleted: { [Op.ne]: "Y" }
       },
    })

    console.log("clients", clients)
      
    return res.status(200).json(new ApiResponse(200, clients, "clients Fetched Successfully"))
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, {}, error.message));
  }
 }


const getAllServicesInfo = async(req, res) => {
  try {
    const { client_id } = req.query;

    // Fetch all client needs to map later
    const allClientNeeds = await client_needs.findAll();
    
    // Fetch services
    const services = await ClientRegistration.findAll({
      where: { 
        client_id: client_id,
        deleted: { [Op.ne]: "Y" }
      },
      include: [
        {
          model: careFacility,
          as: "careType",
          attributes: ["id", "facility_name"]
        },
      ]
    });

    const result = services.map(service => {
    const serviceJSON = service.toJSON();

    let clientNeedsArray = [];
    if (serviceJSON.client_need) {
      const ids = serviceJSON.client_need.split(','); 
      clientNeedsArray = ids
        .map(id => {
          const need = allClientNeeds.find(n => n.id == id);
          return need ? { id, name: need.name } : null;
        })
        .filter(Boolean); 
    }

      return {
        ...serviceJSON,
        care_type: serviceJSON.careType ? serviceJSON.careType.id : null, 
        careType: serviceJSON.careType,
        clientNeeds: clientNeedsArray
      };
    });

    return res.status(200).json({
      status: 200,
      data: result,
      message: "Services Fetched Successfully"
    });

  } catch (error) {
    return res.status(500).json({ status: 500, data: {}, message: error.message });
  }
};

 const deleteFromList = async(req, res) => {
  try {
    console.log('This is delete application')
    const { id } = req.query;

    const record = await Client.findByPk(id);

    // console.log('delete records', record)

    if(!record){
      return res.status(404).json(new ApiResponse(404, {}, "Record not found"));
    }

    record.	deleted = 'Y';
    record.deleted_by = req.user?.id;

    console.log("request id", req.user?.id);
    console.log("request id", new Date());

    record.deleted_on = new Date();

    await record.save();

    return res.status(200).json(new ApiResponse(200, record, " Client id deleted successfully"));

    
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, {}, error.message));
  }
 }


 const updateClientDetails = async (req, res) => {
  try {
    const { client_id } = req.query;
    const payload = req.body;

    if (!client_id) {
      return res.status(400).json(new ApiResponse(400, {}, "Client ID is required in query parameters."));
    }
    
    if (Object.keys(payload).length === 0) {
        return res.status(400).json(new ApiResponse(400, {}, "Request body cannot be empty for an update."));
    }
    
    const client = await Client.findByPk(client_id);
    
    if (!client) {
      return res.status(404).json(new ApiResponse(404, {}, "Client not found"));
    }

    Object.assign(client, payload);

    client.updated_by = req.user?.id || null; 
    client.updated_on = new Date(); 

    const updatedClient = await client.save();

    return res.status(200).json(new ApiResponse(200, updatedClient, "Client profile updated successfully"));

  } catch (err) {
    console.error("Error updating client profile:", err);
    return res.status(500).json(new ApiResponse(500, {}, err.message));
  }
};

const updateClientService = async (req, res) => {
    try {
    const { client_id} = req.query;
    const { service_entries } = req.body;

    if (!client_id) {
      return res.status(400).json(new ApiResponse(400, {}, "Client ID is required."));
    }

    if (!Array.isArray(service_entries) || service_entries.length === 0) {
      return res.status(400).json(new ApiResponse(400, {}, "Service entries array is required."));
    }

    const client = await Client.findByPk(client_id);
    if (!client) {
      return res.status(404).json(new ApiResponse(404, {}, "Client not found."));
    }

    const updated = [];

    for (const entry of service_entries) {
      if (!entry.id) {
        return res.status(400).json(new ApiResponse(400, {}, "Each service entry must include an 'id' to update."));
      }

      const existing = await ClientRegistration.findOne({
        where: {
          id: entry.id,
          client_id,
          deleted: "N"
        }
      });

      if (!existing) {
        return res.status(404).json(new ApiResponse(404, {}, `Service entry with ID ${entry.id} not found.`));
      }

      const clientNeed = Array.isArray(entry.client_need)
        ? entry.client_need.join(",")
        : entry.client_need || "";

      const data = {
        post_code: entry.post_code,
        place: entry.place,
        address: entry.address,
        address_type: entry.type,
        entity_name: entry.entity_name,
        care_type: entry.care_facility,
        client_need: clientNeed,
        facility_contact_name: entry.facility_contact_name || "",
        landline_code: entry.facility_lane_code || "",
        landline_no: entry.facility_contact_landline_no || "",
        mobile_code: entry.facility_mobile_code || "",
        mobile_no: entry.facility_contact_mobile_no || "",
        email: entry.facility_contact_email || "",
        updated_by: req.user?.id || null,
        updated_on: new Date()
      };

      await ClientRegistration.update(data, {
        where: { id: entry.id }
      });

      updated.push({ id: entry.id, status: "updated" });
    }

    return res.status(200).json(new ApiResponse(200, updated, "Client service entries updated successfully."));
    
  } catch (err) {
    console.error("Error updating client service:", err);
    return res.status(500).json(new ApiResponse(500, {}, err.message));
  }
};

const updateClientShiftPattern = async (req, res) => {
    try {
    const { client_id, shift_pattern_entries } = req.body;

    if (!client_id) {
      return res.status(400).json(new ApiResponse(400, {}, "Client ID is required."));
    }

    if (!Array.isArray(shift_pattern_entries) || shift_pattern_entries.length === 0) {
      return res.status(400).json(new ApiResponse(400, {}, "Shift pattern entries array is required."));
    }

    const client = await Client.findByPk(client_id);
    if (!client) {
      return res.status(404).json(new ApiResponse(404, {}, "Client not found."));
    }

    let updated = [];
    console.log('updated',updated)

    for (const entry of shift_pattern_entries) {
      if (!entry.id) {
        return res.status(400).json(new ApiResponse(400, {}, "Each shift pattern entry must include an 'id' to update."));
      }

      const existing = await shift_patterns.findOne({
        where: {
          id: entry.id,
          client_id,
          deleted: "N"
        },
        logging: true
      });

      // console.log("existing", existing)

      if (!existing) {
        return res.status(404).json(new ApiResponse(404, {}, `Shift pattern entry with ID ${entry.id} not found.`));
      }

      const data = {
        sr: entry.sr,
        shift_pattern: entry.shift_pattern,
        shift_type: entry.shift_type, 
        shift_start: entry.shift_start, 
        shift_end: entry.shift_end,     
        remarks: entry.remarks || "",
        updated_by: req.user?.id || null,
        updated_on: new Date()
      };

      // console.log('data', data)

      const newUpdate =  await shift_patterns.update(data, {
        where: { 
          id: entry.id,
          client_id: client_id
         },
         logging: true
      });

      // console.log("new entry", entry)
      // console.log('new update', newUpdate);

      updated.push({ id: entry.id, status: "updated" });
    
    }

    return res.status(200).json(new ApiResponse(200, updated, "Shift pattern entries updated successfully."));
    
  } catch (err) {
    console.error("Error updating shift pattern:", err);
    return res.status(500).json(new ApiResponse(500, {}, err.message));
  }
};



export { 
  registerClient, 
  getParentEntity, 
  getAllClientInfo, 
  deleteFromList, 
  updateClientDetails, 
  getClientInfoById,
  getAllServicesInfo,
  updateClientService,
  updateClientShiftPattern
};