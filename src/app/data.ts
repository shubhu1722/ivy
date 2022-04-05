
export var data = [
   {
      type: "title",
      data: { name : 'SA 5506-X with FirePOWER services 8GE AC DES'},
      subProcess: [
         {
            type: "title",
            data: {
               name: "Receiving"
            },
            subProcessTasks: [
               {
                  type: "text-input",
                  data: {
                      id : "00001",
                      label : "Serial Number",
                      required : true,
                  }
               },
               {
                  type: "text-input",
                  data: {
                      id : "00001",
                      label : "Serial Number",
                      required : true,
                  }
               },
               {
                  type: "select",
                  data: {
                      id : "00001",
                      label : "Box Status",
                      required : true,
                      responses : [
                        "NON UPS (correct packed laptop in non UPS box)",
                        "UPS – OK (correct packed laptop in UPS box)",
                        "UPS - OPEN BOX (opened UPS box)",
                     ]
                  }
               }
            ]
         }
      ]
   }
]