window.EXTRACTION_RUN = {
  "run": {
    "model": "gpt-5.6-terra",
    "api": "OpenAI Responses API",
    "format": "strict json_schema validated by Pydantic",
    "started_at": "2026-08-17T18:58:58.422227+00:00",
    "input_file": "data/contacts/fieldcontact_all.csv",
    "selected_fc_numbers": [
      "FC23005770",
      "FC23000674",
      "FC23000891",
      "FC23004607",
      "FC23002788"
    ],
    "completed_at": "2026-08-17T18:59:35.233378+00:00",
    "elapsed_seconds": 36.811
  },
  "results": [
    {
      "fc_number": "FC23005770",
      "input": {
        "narrative_characters": 255,
        "candidate_people_characters": 137
      },
      "elapsed_seconds": 7.407,
      "response_id": "resp_0599abd1a877c155006a8359f2d88087d1b00110c550c08fab",
      "response_model": "gpt-5.6-terra",
      "status": "completed",
      "usage": {
        "input_tokens": 3675,
        "input_tokens_details": {
          "cache_write_tokens": 3672,
          "cached_tokens": 0
        },
        "output_tokens": 842,
        "output_tokens_details": {
          "reasoning_tokens": 0
        },
        "total_tokens": 4517
      },
      "report": {
        "fc_number": "FC23005770",
        "case_note": "Officers observed XXX (Mass Ave associate, prior manslaughter, FA offenses) operating MA REG XXXin the Dot Ave area. XXXpulled into XXXDot Ave where two unknown females exited his vehicle. FIO'd to associate with m/v and area.\n\nHK01F (E. Foley/O. Russell)",
        "stop_attributes": {
          "contact_date": "2023-12-09 22:30:00.0000000",
          "contact_officer": {
            "officer_id": "118323",
            "name": "FOLEY, ERIC"
          },
          "supervisor": {
            "officer_id": "102682",
            "name": "ERIC MERNER"
          },
          "street": "DORCHESTER AVE",
          "city": "DORCHESTER",
          "state": "MA",
          "postal_code": "2124",
          "frisked": null,
          "person_searched": null,
          "vehicle_searched": null,
          "summons_issued": null,
          "stop_duration": null,
          "circumstance": "Encountered",
          "basis": "Intel",
          "key_situations": [
            "Gang"
          ],
          "weather": null,
          "reported_vehicle": {
            "year": "2023",
            "state": "MA",
            "make": null,
            "model": "OTHER: Niro",
            "color": "Silver",
            "style": "4 Door, Sedan",
            "vehicle_type": "Passenger Car/ Automobile"
          }
        },
        "people": [
          {
            "id": "P1",
            "mentions": [
              "XXX",
              "Mass Ave associate",
              "his vehicle"
            ],
            "bpd_person_id": "53364602506",
            "sex": "male",
            "race": "Black",
            "ethnicity": "Not of Hispanic Origin",
            "age": 35,
            "build": "Medium",
            "hair": null,
            "skin_tone": null,
            "clothing": null,
            "license_info": "MA",
            "frisked": false,
            "deceased": false,
            "residences": [],
            "affiliations": [
              "Mass Ave"
            ],
            "prior_offenses": [
              "prior manslaughter",
              "FA offenses"
            ],
            "descriptors": [],
            "outcomes": [
              "other"
            ]
          },
          {
            "id": "P2",
            "mentions": [
              "two unknown females"
            ],
            "bpd_person_id": null,
            "sex": "female",
            "race": null,
            "ethnicity": null,
            "age": null,
            "build": null,
            "hair": null,
            "skin_tone": null,
            "clothing": null,
            "license_info": null,
            "frisked": null,
            "deceased": null,
            "residences": [],
            "affiliations": [],
            "prior_offenses": [],
            "descriptors": [
              "one of two unknown females who exited the vehicle"
            ],
            "outcomes": []
          },
          {
            "id": "P3",
            "mentions": [
              "two unknown females"
            ],
            "bpd_person_id": null,
            "sex": "female",
            "race": null,
            "ethnicity": null,
            "age": null,
            "build": null,
            "hair": null,
            "skin_tone": null,
            "clothing": null,
            "license_info": null,
            "frisked": null,
            "deceased": null,
            "residences": [],
            "affiliations": [],
            "prior_offenses": [],
            "descriptors": [
              "one of two unknown females who exited the vehicle"
            ],
            "outcomes": []
          }
        ],
        "vehicles": [
          {
            "id": "V1",
            "year": "2023",
            "make": null,
            "model": "Niro",
            "color": "Silver",
            "body_style": "4 Door, Sedan",
            "vehicle_type": "Passenger Car/ Automobile",
            "plate_number": "XXX",
            "plate_state": "MA",
            "attributes": [],
            "notes": null
          }
        ],
        "locations": [
          {
            "id": "L1",
            "text": "Dorchester Ave, Dorchester, MA 02124",
            "latitude": 42.3006,
            "longitude": -71.0657,
            "geocoding_confidence": "low"
          }
        ],
        "items": [],
        "person_connections": [
          {
            "person_1_id": "P1",
            "person_2_id": "P2",
            "relationship": "co_incident"
          },
          {
            "person_1_id": "P1",
            "person_2_id": "P3",
            "relationship": "co_incident"
          },
          {
            "person_1_id": "P2",
            "person_2_id": "P3",
            "relationship": "co_incident"
          }
        ],
        "person_vehicle_associations": [
          {
            "person_id": "P1",
            "vehicle_id": "V1",
            "role": "operator"
          },
          {
            "person_id": "P2",
            "vehicle_id": "V1",
            "role": "occupant"
          },
          {
            "person_id": "P3",
            "vehicle_id": "V1",
            "role": "occupant"
          }
        ],
        "person_item_associations": []
      }
    },
    {
      "fc_number": "FC23000674",
      "input": {
        "narrative_characters": 394,
        "candidate_people_characters": 311
      },
      "elapsed_seconds": 6.867,
      "response_id": "resp_09fb7bea9805ff70006a8359fa02a887d184c3134517fad972",
      "response_model": "gpt-5.6-terra",
      "status": "completed",
      "usage": {
        "input_tokens": 3772,
        "input_tokens_details": {
          "cache_write_tokens": 540,
          "cached_tokens": 3229
        },
        "output_tokens": 811,
        "output_tokens_details": {
          "reasoning_tokens": 0
        },
        "total_tokens": 4583
      },
      "report": {
        "fc_number": "FC23000674",
        "case_note": "Officers conducted T. Stop of MA REG: XXXBlack Dodge Charger rental, for VALS (90.7) at XXXGeneva Ave. \n\nOperator identified asXXX XX/XX/XXXXprior 94c Act Bicknell.\n\nPassenger identified as XXX XX/XX/XXXXAct. Glenway prior F/A conviction and 94c.\n\nBoth parties were cordial with Officers throughout the stop. Verbal warning issued, FIOE to associate parties with vehicle. \n\nC102F (Turner/Coyne)",
        "stop_attributes": {
          "contact_date": "2023-02-04 19:01:00.0000000",
          "contact_officer": {
            "officer_id": "153137",
            "name": "TURNER, MATTHEW"
          },
          "supervisor": {
            "officer_id": "102682",
            "name": "ERIC MERNER"
          },
          "street": "COLUMBIA RD",
          "city": "BOSTON",
          "state": "MA",
          "postal_code": "2121",
          "frisked": null,
          "person_searched": null,
          "vehicle_searched": null,
          "summons_issued": null,
          "stop_duration": null,
          "circumstance": "Stopped",
          "basis": "Probable Cause",
          "key_situations": [
            "Body Worn Camera",
            "Gang"
          ],
          "weather": null,
          "reported_vehicle": {
            "year": "2022",
            "state": "MA",
            "make": null,
            "model": "Charger",
            "color": "Black",
            "style": "4 Door, Sedan",
            "vehicle_type": "Passenger Car/ Automobile"
          }
        },
        "people": [
          {
            "id": "P1",
            "mentions": [
              "Operator",
              "XXX XX/XX/XXXX",
              "Act. Bicknell",
              "Both parties"
            ],
            "bpd_person_id": "41469928757",
            "sex": "male",
            "race": "Black",
            "ethnicity": "Unknown",
            "age": 27,
            "build": "Medium",
            "hair": "Short",
            "skin_tone": "Light Brown",
            "clothing": null,
            "license_info": "MA Class D",
            "frisked": false,
            "deceased": false,
            "residences": [],
            "affiliations": [
              "Bicknell"
            ],
            "prior_offenses": [
              "prior 94c"
            ],
            "descriptors": [],
            "outcomes": [
              "warning",
              "released"
            ]
          },
          {
            "id": "P2",
            "mentions": [
              "Passenger",
              "XXX XX/XX/XXXX",
              "Act. Glenway",
              "Both parties"
            ],
            "bpd_person_id": "41469930240",
            "sex": "male",
            "race": "Black",
            "ethnicity": "Not of Hispanic Origin",
            "age": 31,
            "build": "Thin",
            "hair": null,
            "skin_tone": null,
            "clothing": null,
            "license_info": "MA Class D",
            "frisked": false,
            "deceased": false,
            "residences": [],
            "affiliations": [
              "Glenway"
            ],
            "prior_offenses": [
              "prior F/A conviction",
              "94c"
            ],
            "descriptors": [],
            "outcomes": [
              "warning",
              "released"
            ]
          }
        ],
        "vehicles": [
          {
            "id": "V1",
            "year": "2022",
            "make": "Dodge",
            "model": "Charger",
            "color": "Black",
            "body_style": "4 Door, Sedan",
            "vehicle_type": "Passenger Car/ Automobile",
            "plate_number": "XXX",
            "plate_state": "MA",
            "attributes": [
              "rental"
            ],
            "notes": "Black Dodge Charger rental"
          }
        ],
        "locations": [
          {
            "id": "L1",
            "text": "Geneva Ave, Boston, MA 02121",
            "latitude": 42.3055,
            "longitude": -71.0826,
            "geocoding_confidence": "low"
          },
          {
            "id": "L2",
            "text": "Columbia Rd, Boston, MA 02121",
            "latitude": 42.3078,
            "longitude": -71.0806,
            "geocoding_confidence": "low"
          }
        ],
        "items": [],
        "person_connections": [
          {
            "person_1_id": "P1",
            "person_2_id": "P2",
            "relationship": "co_incident"
          }
        ],
        "person_vehicle_associations": [
          {
            "person_id": "P1",
            "vehicle_id": "V1",
            "role": "operator"
          },
          {
            "person_id": "P2",
            "vehicle_id": "V1",
            "role": "passenger"
          }
        ],
        "person_item_associations": []
      }
    },
    {
      "fc_number": "FC23000891",
      "input": {
        "narrative_characters": 558,
        "candidate_people_characters": 179
      },
      "elapsed_seconds": 7.011,
      "response_id": "resp_059a05b2e47bf3c5006a835a00d1a88197b574d6cf36604c12",
      "response_model": "gpt-5.6-terra",
      "status": "completed",
      "usage": {
        "input_tokens": 3739,
        "input_tokens_details": {
          "cache_write_tokens": 507,
          "cached_tokens": 3229
        },
        "output_tokens": 891,
        "output_tokens_details": {
          "reasoning_tokens": 0
        },
        "total_tokens": 4630
      },
      "report": {
        "fc_number": "FC23000891",
        "case_note": "Officer observed MA REG: XXXparked occupied in the public lot across from XXXWarren St.XXX associate XXXwas observed exiting and loitering in the Dudley bus yard area wearing a red/orange backwoods sweatshirt and black fanny pack. He was later advised not to drive the vehicle due to his suspended license status which he acknowledged. He has been seen on a regular basis with this vehicle in the Dudley area. Past FIO's for drug related incidents and constant calls for service for domestics between XXXand his girlfriend XXXwho is the vehicle owner.\n\nB451D",
        "stop_attributes": {
          "contact_date": "2023-02-17 09:06:00.0000000",
          "contact_officer": {
            "officer_id": "140324",
            "name": "HOLMES, KYLE"
          },
          "supervisor": {
            "officer_id": "116141",
            "name": "AMYLEIGH DEVITO"
          },
          "street": "WARREN ST",
          "city": "ROXBURY",
          "state": "MA",
          "postal_code": "2119",
          "frisked": null,
          "person_searched": null,
          "vehicle_searched": null,
          "summons_issued": null,
          "stop_duration": null,
          "circumstance": "Encountered",
          "basis": "Encounter",
          "key_situations": [
            "Gang"
          ],
          "weather": null,
          "reported_vehicle": {
            "year": "2014",
            "state": "MA",
            "make": null,
            "model": "320I",
            "color": "White",
            "style": "4 Door, Sedan",
            "vehicle_type": "Passenger Car/ Automobile"
          }
        },
        "people": [
          {
            "id": "P1",
            "mentions": [
              "XXX associate XXX",
              "He"
            ],
            "bpd_person_id": "42602571308",
            "sex": "male",
            "race": "Black",
            "ethnicity": "Not of Hispanic Origin",
            "age": 28,
            "build": "Thin",
            "hair": "Short",
            "skin_tone": "Dark Brown",
            "clothing": "red/orange backwoods sweatshirt and black fanny pack",
            "license_info": "MA Class D",
            "frisked": false,
            "deceased": false,
            "residences": [],
            "affiliations": [],
            "prior_offenses": [
              "Past FIO's for drug related incidents"
            ],
            "descriptors": [
              "suspended license status",
              "seen on a regular basis with this vehicle in the Dudley area"
            ],
            "outcomes": [
              "warning"
            ]
          },
          {
            "id": "P2",
            "mentions": [
              "his girlfriend XXX",
              "XXXwho is the vehicle owner"
            ],
            "bpd_person_id": null,
            "sex": "female",
            "race": null,
            "ethnicity": null,
            "age": null,
            "build": null,
            "hair": null,
            "skin_tone": null,
            "clothing": null,
            "license_info": null,
            "frisked": null,
            "deceased": null,
            "residences": [],
            "affiliations": [],
            "prior_offenses": [],
            "descriptors": [],
            "outcomes": []
          }
        ],
        "vehicles": [
          {
            "id": "V1",
            "year": "2014",
            "make": null,
            "model": "320I",
            "color": "White",
            "body_style": "4 Door, Sedan",
            "vehicle_type": "Passenger Car/ Automobile",
            "plate_number": "MA REG: XXX",
            "plate_state": "MA",
            "attributes": [
              "parked",
              "occupied"
            ],
            "notes": null
          }
        ],
        "locations": [
          {
            "id": "L1",
            "text": "public lot across from XXX Warren St, Roxbury, MA 02119",
            "latitude": 42.3254,
            "longitude": -71.0837,
            "geocoding_confidence": "low"
          },
          {
            "id": "L2",
            "text": "Dudley bus yard area, Roxbury, MA",
            "latitude": 42.3296,
            "longitude": -71.0838,
            "geocoding_confidence": "medium"
          }
        ],
        "items": [
          {
            "id": "I1",
            "item_type": "clothing_or_equipment",
            "description": "red/orange backwoods sweatshirt",
            "quantity": null
          },
          {
            "id": "I2",
            "item_type": "clothing_or_equipment",
            "description": "black fanny pack",
            "quantity": null
          }
        ],
        "person_connections": [
          {
            "person_1_id": "P1",
            "person_2_id": "P2",
            "relationship": "romantic_partner"
          }
        ],
        "person_vehicle_associations": [
          {
            "person_id": "P1",
            "vehicle_id": "V1",
            "role": "associated"
          },
          {
            "person_id": "P2",
            "vehicle_id": "V1",
            "role": "owner"
          }
        ],
        "person_item_associations": [
          {
            "person_id": "P1",
            "item_id": "I1",
            "relationship": "associated"
          },
          {
            "person_id": "P1",
            "item_id": "I2",
            "relationship": "associated"
          }
        ]
      }
    },
    {
      "fc_number": "FC23004607",
      "input": {
        "narrative_characters": 750,
        "candidate_people_characters": 441
      },
      "elapsed_seconds": 8.526,
      "response_id": "resp_08303ab9b105028d006a835a07d3788196a39cc96301438f50",
      "response_model": "gpt-5.6-terra",
      "status": "completed",
      "usage": {
        "input_tokens": 3916,
        "input_tokens_details": {
          "cache_write_tokens": 684,
          "cached_tokens": 3229
        },
        "output_tokens": 1091,
        "output_tokens_details": {
          "reasoning_tokens": 0
        },
        "total_tokens": 5007
      },
      "report": {
        "fc_number": "FC23004607",
        "case_note": "T/S for VALs (89/9 - Failure to Stop for Stop Sign/Red Light) of MA Reg: XXXat the intersection of Ruthven St & Harold St.\n\nOperator: XXX (DOB: XX/XX/XXXXprior ABDW & 94C. It should be noted, XXXis the father of XXX (Active Everton/Geneva). \n\nFront passenger: XXX (DOB: XX/XX/XXXXprior Armed Robbery, Agg. Assault\n\nRear passengerXXX (DOB: XX/XX/XXXX\n\nOfficers were aware of a BRIC bulletin (23-075) that was disseminated on 09/24/2023 in relation to a Stabbing that occurred at XXXDorchester Ave. Officers observed MA Reg: XXXto match the description of the vehicle in the bulletin. \n\nAll parties cooperative and cordial with Officers throughout.\n\nC-11 Detectives notified. \n\nFIO'd to associate parties with each other and M/V. \n\n-B102F (Luciw/Green)",
        "stop_attributes": {
          "contact_date": "2023-09-27 17:56:00.0000000",
          "contact_officer": {
            "officer_id": "164117",
            "name": "Luciw, Mikayla"
          },
          "supervisor": {
            "officer_id": "96709",
            "name": "RAFAEL RODRIGUEZ"
          },
          "street": "RUTHVEN ST",
          "city": "BOSTON",
          "state": "MA",
          "postal_code": "2121",
          "frisked": null,
          "person_searched": null,
          "vehicle_searched": null,
          "summons_issued": null,
          "stop_duration": null,
          "circumstance": "Stopped",
          "basis": "Probable Cause",
          "key_situations": [
            "Body Worn Camera",
            "Gang"
          ],
          "weather": null,
          "reported_vehicle": {
            "year": "2008",
            "state": "MA",
            "make": null,
            "model": "Suburban/Yukon",
            "color": "Black",
            "style": "4 Door, Sedan",
            "vehicle_type": "Passenger Car/ Automobile"
          }
        },
        "people": [
          {
            "id": "P1",
            "mentions": [
              "Operator: XXX",
              "XXX"
            ],
            "bpd_person_id": "52455027439",
            "sex": "male",
            "race": "Black",
            "ethnicity": "Not of Hispanic Origin",
            "age": 43,
            "build": "Unknown",
            "hair": null,
            "skin_tone": null,
            "clothing": null,
            "license_info": "MA Class D",
            "frisked": false,
            "deceased": false,
            "residences": [],
            "affiliations": [],
            "prior_offenses": [
              "ABDW",
              "94C"
            ],
            "descriptors": [
              "father of XXX (Active Everton/Geneva)"
            ],
            "outcomes": []
          },
          {
            "id": "P2",
            "mentions": [
              "Front passenger: XXX",
              "XXX"
            ],
            "bpd_person_id": "52455007339",
            "sex": "male",
            "race": "Black",
            "ethnicity": "Not of Hispanic Origin",
            "age": 42,
            "build": "Thin",
            "hair": "Dreadlocks",
            "skin_tone": "Medium Brown",
            "clothing": null,
            "license_info": "MA",
            "frisked": false,
            "deceased": false,
            "residences": [],
            "affiliations": [
              "Everton/Geneva"
            ],
            "prior_offenses": [
              "Armed Robbery",
              "Agg. Assault"
            ],
            "descriptors": [
              "active Everton/Geneva",
              "child of P1"
            ],
            "outcomes": []
          },
          {
            "id": "P3",
            "mentions": [
              "Rear passenger XXX",
              "XXX"
            ],
            "bpd_person_id": "52455011423",
            "sex": "male",
            "race": "Black",
            "ethnicity": "Unknown",
            "age": 42,
            "build": null,
            "hair": null,
            "skin_tone": null,
            "clothing": null,
            "license_info": "MA Class D",
            "frisked": false,
            "deceased": false,
            "residences": [],
            "affiliations": [],
            "prior_offenses": [],
            "descriptors": [],
            "outcomes": []
          }
        ],
        "vehicles": [
          {
            "id": "V1",
            "year": "2008",
            "make": null,
            "model": "Suburban/Yukon",
            "color": "Black",
            "body_style": "4 Door, Sedan",
            "vehicle_type": "Passenger Car/ Automobile",
            "plate_number": "XXX",
            "plate_state": "MA",
            "attributes": [
              "matched description of vehicle in BRIC bulletin 23-075"
            ],
            "notes": null
          }
        ],
        "locations": [
          {
            "id": "L1",
            "text": "Intersection of Ruthven St & Harold St, Boston, MA 02121",
            "latitude": 42.3026,
            "longitude": -71.0827,
            "geocoding_confidence": "medium"
          },
          {
            "id": "L2",
            "text": "Dorchester Ave, Boston, MA",
            "latitude": 42.2973,
            "longitude": -71.0617,
            "geocoding_confidence": "low"
          }
        ],
        "items": [],
        "person_connections": [
          {
            "person_1_id": "P1",
            "person_2_id": "P2",
            "relationship": "family_member"
          },
          {
            "person_1_id": "P1",
            "person_2_id": "P3",
            "relationship": "co_incident"
          },
          {
            "person_1_id": "P2",
            "person_2_id": "P3",
            "relationship": "co_incident"
          }
        ],
        "person_vehicle_associations": [
          {
            "person_id": "P1",
            "vehicle_id": "V1",
            "role": "operator"
          },
          {
            "person_id": "P2",
            "vehicle_id": "V1",
            "role": "passenger"
          },
          {
            "person_id": "P3",
            "vehicle_id": "V1",
            "role": "passenger"
          }
        ],
        "person_item_associations": []
      }
    },
    {
      "fc_number": "FC23002788",
      "input": {
        "narrative_characters": 1154,
        "candidate_people_characters": 137
      },
      "elapsed_seconds": 6.993,
      "response_id": "resp_0f9a580d148fb6dd006a835a106930819591468096e9815879",
      "response_model": "gpt-5.6-terra",
      "status": "completed",
      "usage": {
        "input_tokens": 3872,
        "input_tokens_details": {
          "cache_write_tokens": 640,
          "cached_tokens": 3229
        },
        "output_tokens": 848,
        "output_tokens_details": {
          "reasoning_tokens": 0
        },
        "total_tokens": 4720
      },
      "report": {
        "fc_number": "FC23002788",
        "case_note": "About 11:45pm on Wednesday 5/31/23, Officers responded to a shot spotter activation in the area of Delhi St and Crossman St. Upon arrival Officers located what appeared to be heavily tinted vehicle glass on the roadway, and eventually located ballistics. \n\nWhile responding to the scene Officers observed FL REG XXXa 2021 White Chevy Blazer, sitting unoccupied with its running lights on in front of XXXDelhi St. Officers checked the vehicle, confirmed it was unoccupied, and continued to search the area. Officers passed the Blazer again within 30 seconds of leaving it, and observed a party in the front seat.\n\nOfficers stopped, approached the party, Later identified as XXX (Armed Aslt to Kill, Manslaughter Conviction, Multiple 94C and FA convictions), and made contact with the driver. Officers asked for XXXID which he provided, and explained the incident. XXXstated that he was staying at XXXDelhi 3rd Floor and that he was leaving his house. XXXwas not particularly cordial with Officers, but answered some of their questions. \n\nAt the time of the Officers contact with XXXno ballistics had been located. XXXwas returned his ID and left the area.",
        "stop_attributes": {
          "contact_date": "2023-05-31 23:45:00.0000000",
          "contact_officer": {
            "officer_id": "153081",
            "name": "LEWIS, JOHNATHAN"
          },
          "supervisor": {
            "officer_id": "10845",
            "name": "JAMES MOORE"
          },
          "street": "DELHI ST",
          "city": "MATTAPAN",
          "state": "MA",
          "postal_code": "2126",
          "frisked": null,
          "person_searched": null,
          "vehicle_searched": null,
          "summons_issued": null,
          "stop_duration": "32",
          "circumstance": "Encountered",
          "basis": "Intel",
          "key_situations": [
            "Body Worn Camera",
            "Gang",
            "Shots Fired"
          ],
          "weather": null,
          "reported_vehicle": {
            "year": "2021",
            "state": "FL",
            "make": null,
            "model": "Blazer",
            "color": "White",
            "style": null,
            "vehicle_type": "Suv (sport Utility Vehicle)"
          }
        },
        "people": [
          {
            "id": "P1",
            "mentions": [
              "XXX",
              "the party",
              "the driver",
              "he"
            ],
            "bpd_person_id": "50792413713",
            "sex": "male",
            "race": "Black",
            "ethnicity": "Not of Hispanic Origin",
            "age": 34,
            "build": "Stocky",
            "hair": null,
            "skin_tone": null,
            "clothing": null,
            "license_info": "MA",
            "frisked": false,
            "deceased": false,
            "residences": [
              "XXXDelhi 3rd Floor"
            ],
            "affiliations": [],
            "prior_offenses": [
              "Armed Aslt to Kill",
              "Manslaughter Conviction",
              "Multiple 94C and FA convictions"
            ],
            "descriptors": [
              "not particularly cordial with Officers"
            ],
            "outcomes": [
              "released"
            ]
          }
        ],
        "vehicles": [
          {
            "id": "V1",
            "year": "2021",
            "make": "Chevy",
            "model": "Blazer",
            "color": "White",
            "body_style": "SUV",
            "vehicle_type": "Suv (sport Utility Vehicle)",
            "plate_number": "XXX",
            "plate_state": "FL",
            "attributes": [
              "running lights on"
            ],
            "notes": null
          }
        ],
        "locations": [
          {
            "id": "L1",
            "text": "Delhi St and Crossman St, Mattapan, MA 02126",
            "latitude": 42.2789,
            "longitude": -71.0933,
            "geocoding_confidence": "medium"
          },
          {
            "id": "L2",
            "text": "XXX Delhi St, Mattapan, MA 02126",
            "latitude": 42.2786,
            "longitude": -71.0936,
            "geocoding_confidence": "low"
          }
        ],
        "items": [
          {
            "id": "I1",
            "item_type": "other",
            "description": "heavily tinted vehicle glass",
            "quantity": null
          },
          {
            "id": "I2",
            "item_type": "other",
            "description": "ballistics",
            "quantity": null
          }
        ],
        "person_connections": [],
        "person_vehicle_associations": [
          {
            "person_id": "P1",
            "vehicle_id": "V1",
            "role": "operator"
          }
        ],
        "person_item_associations": []
      }
    }
  ],
  "errors": []
};
