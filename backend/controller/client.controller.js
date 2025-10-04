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
      post_code1,
      place,
      address,
      type,
      entity_name,
      care_facility,
      client_need,
      facility_type_contact_name,
      facility_contact_landline_no,
      facility_contact_mobile_no,
      facility_contact_email,
      facility_lane_code,
      facility_mobile_code,
      shiftid,
      sr_1,
      shift_pattern_1,
      shift_type_1,
      shift_start_1,
      shift_end_1,
      remarks_1
    } = req.body

    let clientLogo = req.files?.client_logo ? req.files.client_logo[0].filename : "";
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
        client_logo: clientLogo,
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
        client_logo: clientLogo,
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
    
    if (Array.isArray(post_code1)) {
      for (let i = 0; i < post_code1.length; i++) {
        let needs = Array.isArray(client_need?.[i]) ? client_need[i].join(",") : client_need?.[i] || "";
        const data = {
          client_id: client.id,
          post_code: post_code1[i],
          place: place[i],
          address: address[i],
          address_type: type[i],
          entity_name: entity_name[i],
          care_type: care_facility[i],
          client_need: needs,
          facility_contact_name: facility_type_contact_name?.[i] || "",
          landline_code: facility_lane_code?.[i] || "",
          mobile_code: facility_mobile_code?.[i] || "",
          landline_no: facility_contact_landline_no?.[i] || "",
          mobile_no: facility_contact_mobile_no?.[i] || "",
          email: facility_contact_email?.[i] || "",
          created_on: new Date(),
          created_by: req.user?.id || null
        };

        let step2;
        if (req.body.data_id?.[i]) {
          await ClientRegistration.update(data, {
            where: { id: req.body.data_id[i], client_id: client.id }
          });
        } else {
          step2 = await ClientRegistration.create(data);
          insertedIds.push(step2.id);
        }
      }
    }
    if (Array.isArray(shift_pattern_1)) {
      for (let j = 0; j < shift_pattern_1.length; j++) {
        await shift_patterns.update({
          sr: sr_1[j],
          shift_pattern: shift_pattern_1[j],
          shift_type: shift_type_1[j],
          shift_start: shift_start_1[j],
          shift_end: shift_end_1[j],
          remarks: remarks_1[j],
          updated_by: req.user?.id || null,
          updated_on: new Date()
        }, { where: { id: shiftid[j] } });
      }
    }

    return res.json({
      message: "Successfully Inserted/Updated",
      insertedId: client.id,
      finance_entity_address,
      billing_entity_address,
      insertedIds
    });

        
    } catch (error) {
    console.error(err);
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