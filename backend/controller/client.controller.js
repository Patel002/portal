import { Client } from "../model/client.model.js";
import { ClientRegistration } from "../model/client2.model.js";
import { shift_patterns } from "../model/shift_patterns.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// import { Op } from "sequelize";

const registerClient = async(req, res) => {

    try {
        
    const {
      candidate_id,
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
    } = req.body

    let client_logo = req.files?.client_logo ? req.files.client_logo[0].filename : "";
    let uploadFile = req.files?.upload ? req.files.upload[0].filename : "";

    let client;

    if (!candidate_id) {
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
        lan_number: contact_number,
        lan_code: lane_code,
        mobile_number: contact_mobile,
        mobile_code,
        created_on: new Date()
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
        lan_number: contact_number,
        lan_code: lane_code,
        mobile_number: contact_mobile,
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
      }, { where: { id: candidate_id } });

      client = { id: candidate_id };
    }

    const insertedIds = [];
    
    if (Array.isArray(step2_data)) {
      for (let i = 0; i < step2_data.length; i++) {
        const item = step2_data[i];
        let needs = Array.isArray(client_need?.[i]) ? client_need[i].join(",") : client_need?.[i] || "";
        const data = {
      client_id: client.id,
      post_code: item.post_code,
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
      created_by: req.user?.id || null
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
    if (Array.isArray(req.body.shift_pattern)) {
  for (const shift of req.body.shift_pattern) {
    const data = {
      sr: shift.sr_no,
      shift_pattern: shift.shift_pattern,
      shift_type: shift.shift_type,
      shift_start: shift.shift_start,
      shift_end: shift.shift_end,
      remarks: shift.remarks,
      updated_by: req.user?.id || null,
      updated_on: new Date()
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
    } catch (error) {
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

export { registerClient, getParentEntity };