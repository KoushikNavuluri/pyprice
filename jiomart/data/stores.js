/**
 * JioMart Quick Fulfillment Stores & Dark Store Registry
 * Hyperlocal fulfillment centers delivering in 10-30 minutes across Indian metros.
 */

export const JIOMART_STORES = [
  {
    uid: 3442,
    code: "T6HZ",
    display_name: "Groceries-T6HZ",
    department_name: "Groceries",
    seller_id: 1,
    priority: 1,
    address: {
      address1: "Ground Floor, Fort Commercial Complex",
      address2: "Fort, Colaba",
      city: "MUMBAI",
      state: "MAHARASHTRA",
      pincode: "400001",
      country: "India",
      country_code: "IN",
      latitude: 18.931613,
      longitude: 72.832486
    },
    timings: {
      open: true,
      opening: { hour: 6, minute: 0 },
      closing: { hour: 23, minute: 0 }
    },
    is_accepting_order: true,
    promisetime: "11",
    delivery_promise: {
      eta_mins: 11,
      min: "2026-11-10T12:18:39Z",
      max: "2026-11-10T12:18:39Z",
      message: "Delivery in 11 mins",
      model_resp: true,
      show_eta: true,
      secondary_message: "Quick Commerce Guaranteed"
    },
    meta: {
      zone: "west",
      polygon_id: "T6HZ_QC_5475bdd9",
      mbv_config: [
        { department: "Groceries", min_basket_value: 99 }
      ],
      dynamic_delivery: {
        m1: 11,
        lower_threshold: 6,
        upper_threshold: 60,
        weather_id: 5,
        weather_message: "Hazy sunshine"
      }
    }
  },
  {
    uid: 14121,
    code: "TXXH",
    display_name: "Electronics-GNG-TXXH",
    department_name: "Electronics",
    seller_id: 1,
    priority: 1,
    address: {
      address1: "Opera House Commercial Hub",
      address2: "Grant Road",
      city: "MUMBAI",
      state: "MAHARASHTRA",
      pincode: "400007",
      country: "India",
      country_code: "IN",
      latitude: 18.9567,
      longitude: 72.8149
    },
    timings: {
      open: true,
      opening: { hour: 11, minute: 0 },
      closing: { hour: 20, minute: 0 }
    },
    is_accepting_order: true,
    promisetime: "120",
    delivery_promise: {
      eta_mins: 120,
      min: "2026-11-10T13:07:39Z",
      max: "2026-11-10T14:07:39Z",
      message: "Delivery in 1 to 2 hrs",
      model_resp: false,
      show_eta: null
    },
    meta: {
      zone: "west",
      polygon_id: "TXXH_QC_9c9d7207",
      mbv_config: [
        { department: "Electronics", min_basket_value: 499 }
      ]
    }
  },
  {
    uid: 3134,
    code: "8636",
    display_name: "Electronics-GNG-8636",
    department_name: "Electronics",
    seller_id: 1,
    priority: 1,
    address: {
      address1: "Prabhadevi Quick Hub",
      address2: "Worli Link Road",
      city: "MUMBAI",
      state: "MAHARASHTRA",
      pincode: "400025",
      country: "India",
      country_code: "IN",
      latitude: 19.0128,
      longitude: 72.828
    },
    timings: {
      open: true,
      opening: { hour: 11, minute: 0 },
      closing: { hour: 20, minute: 0 }
    },
    is_accepting_order: true,
    promisetime: "120",
    delivery_promise: {
      eta_mins: 120,
      min: "2026-11-10T13:07:39Z",
      max: "2026-11-10T14:07:39Z",
      message: "Delivery in 1 to 2 hrs",
      model_resp: false,
      show_eta: null
    },
    meta: {
      zone: "west",
      polygon_id: "8636_QC_0339271a",
      mbv_config: [
        { department: "Electronics", min_basket_value: 499 }
      ]
    }
  },
  {
    uid: 5120,
    code: "BLR-T49A",
    display_name: "Groceries-BLR-HSR",
    department_name: "Groceries",
    seller_id: 1,
    priority: 1,
    address: {
      address1: "27th Main, Sector 1",
      address2: "HSR Layout",
      city: "BENGALURU",
      state: "KARNATAKA",
      pincode: "560102",
      country: "India",
      country_code: "IN",
      latitude: 12.9121,
      longitude: 77.6446
    },
    timings: {
      open: true,
      opening: { hour: 6, minute: 0 },
      closing: { hour: 23, minute: 30 }
    },
    is_accepting_order: true,
    promisetime: "11",
    delivery_promise: {
      eta_mins: 11,
      message: "Delivery in 11 mins",
      model_resp: true,
      show_eta: true
    },
    meta: {
      zone: "south",
      polygon_id: "BLR_HSR_QC_8787e9",
      mbv_config: [
        { department: "Groceries", min_basket_value: 99 }
      ]
    }
  },
  {
    uid: 5122,
    code: "DEL-T11A",
    display_name: "Groceries-DEL-CP",
    department_name: "Groceries",
    seller_id: 1,
    priority: 1,
    address: {
      address1: "Inner Circle, Connaught Place",
      address2: "Barakhamba",
      city: "DELHI",
      state: "DELHI",
      pincode: "110001",
      country: "India",
      country_code: "IN",
      latitude: 28.6304,
      longitude: 77.2177
    },
    timings: {
      open: true,
      opening: { hour: 6, minute: 0 },
      closing: { hour: 23, minute: 0 }
    },
    is_accepting_order: true,
    promisetime: "15",
    delivery_promise: {
      eta_mins: 15,
      message: "Delivery in 15 mins",
      model_resp: true,
      show_eta: true
    },
    meta: {
      zone: "north",
      polygon_id: "DEL_CP_QC_11a8b2",
      mbv_config: [
        { department: "Groceries", min_basket_value: 99 }
      ]
    }
  },
  {
    uid: 5124,
    code: "GGN-T22B",
    display_name: "Groceries-GGN-CyberCity",
    department_name: "Groceries",
    seller_id: 1,
    priority: 1,
    address: {
      address1: "DLF Phase 2",
      address2: "Cyber City",
      city: "GURUGRAM",
      state: "HARYANA",
      pincode: "122002",
      country: "India",
      country_code: "IN",
      latitude: 28.4906,
      longitude: 77.0903
    },
    timings: {
      open: true,
      opening: { hour: 6, minute: 0 },
      closing: { hour: 23, minute: 0 }
    },
    is_accepting_order: true,
    promisetime: "12",
    delivery_promise: {
      eta_mins: 12,
      message: "Delivery in 12 mins",
      model_resp: true,
      show_eta: true
    },
    meta: {
      zone: "north",
      polygon_id: "GGN_CYBER_QC_22b9c1",
      mbv_config: [
        { department: "Groceries", min_basket_value: 99 }
      ]
    }
  }
];
