import { z } from 'zod';

const storageKeys = {
  global: {
    appContext: z.object({
      theme: z.enum(['default', 'dark', 'light']).catch('default'),
      lang: z.string().optional(),
      fcmToken: z.string().optional(),
      user: z
        .object({
          name: z.string(),
          employee_id: z.number(),
          employee_code: z.string(),
          old_employee_code: z.string(),
          job_id: z.number(),
          job_name: z.string(),
          group_id: z.number(),
          group_name: z.string(),
          department_id: z.number(),
          department_name: z.string(),
          area_category_id: z.number(),
          area_category_name: z.string(),
          work_location_text: z.string(),
          mobile_phone: z.string(),
          work_email: z.string(),
          onboard_time: z.string(),
          offical_contract_date: z.string(),
          parent: z.array(z.any()),
          child: z.array(
            z.object({
              name: z.string(),
              id: z.number(),
            }),
          ),
          birthday: z.string(),
          identification_id: z.string(),
          area_provide: z.string(),
          date_provide: z.string(),
          private_email: z.string(),
          place_of_birth: z.string(),
          address_now: z.string(),
          bank_account_name: z.string(),
          account_holder: z.string(),
          bank_id: z.number(),
          bank_name: z.string(),
          emergency_contact: z.string(),
          emergency_relation: z.string(),
          marital: z.string(),
          marital_label: z.string(),
          count_children: z.number(),
          children_ids: z.array(
            z.object({
              name: z.string(),
              birthday: z.string(),
              gender: z.string(),
            }),
          ),
          certificate_employee: z.string(),
          study_school: z.string(),
          study_field: z.string(),
          image_url: z.string(),
          emergency_phone: z.string(),
          access_staff_transfer: z.boolean().optional(),
        })
        .optional(),
      factory: z.enum(['somi', 'veston']).optional().catch('somi'),
      permission: z
        .array(
          z.object({
            id: z.number(),
            code: z.string(),
            name: z.string(),
          }),
        )
        .optional(),
      bluetooth: z
        .object({
          isConnected: z.boolean().catch(false),
          device: z.object({
            name: z.string(),
            address: z.string(),
          }),
        })
        .optional(),
      current_company_id: z.number().optional(),
    }),
    deviceId: z.string().catch(''),
    firstLaunchAt: z.number().optional(),
  },
  cache: {},
} as const;

export default storageKeys;
