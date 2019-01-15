const tokenUrl = "https://rco60s22e3.execute-api.eu-west-1.amazonaws.com/DEV/token";
const apiKey = "CovgPVCcHJ60ZGtdGCdMqaCC28qKVW0M1MYm2Qhs";

const submitRequestUrl = "https://rco60s22e3.execute-api.eu-west-1.amazonaws.com/DEV/request";
const stateMachineArn = "arn:aws:states:eu-west-1:715662236651:stateMachine:upsell-startProcess";

function testPureCloudConnection(clientId, clientSecret, environment) {
  console.log(`Testing PureCloud connection... Client Id: ${clientId}, Client Secret: ${clientSecret}, environment: ${environment}`);
  return new Promise(function (resolve, reject) {
    try {
      $.ajax({
        url: tokenUrl,
        method: "POST",
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.setRequestHeader("x-api-key", apiKey);
        },
        data: JSON.stringify({
          clientId: clientId,
          clientSecret: clientSecret,
          env: environment
        }),
      }).done((data) => {
        if (data.hasOwnProperty("errorMessage")) {
          console.error(data);
          reject(JSON.stringify(data.errorMessage));
        } else if (data.hasOwnProperty("token")) {
          resolve(data.token);
        } else {
          console.error("Unknown response:", data);
        }
      }).fail((jqXHR, textStatus, errorThrown) => {
        console.error(jqXHR);
        console.error(textStatus);
        console.error(errorThrown);
        reject(error);
      })
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

function submitRequest(clientId, clientSecret, environment, startDate, duration, emailAddress, taskId) {
  console.log("Submitting Request...");
  return new Promise(function (resolve, reject) {
    try {

      var options = {
        "async": true,
        "crossDomain": true,
        "url": submitRequestUrl,
        "method": "POST",
        "headers": {
          "Content-Type": "application/json",
          "x-api-key": apiKey
        },
        "processData": false,
        "data": `{ \"input\": \"{ \\\"name\\\": \\\"${taskId}\\\", \\\"clientId\\\" : \\\"${clientId}\\\", \\\"clientSecret\\\" : \\\"${clientSecret}\\\",\\\"env\\\" : \\\"${environment}\\\" , \\\"startDate\\\": \\\"${startDate}\\\", \\\"duration\\\": ${duration} }\", \"name\": \"${taskId}\", \"stateMachineArn\": \"${stateMachineArn}\"}`
      }

      console.log(options);

      $.ajax(options).done((response) => {
        console.log(response);
        if (response.hasOwnProperty("errorMessage")) {
          reject(response);
          return;
        }
        resolve(response.token);
      }).fail((jqXHR, textStatus, errorThrown) => {
        console.error(jqXHR);
        console.error(textStatus);
        reject(errorThrown);
      });
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

function getRequestData(taskId) {
  console.log(`Getting Request (${taskId})...`);
  return new Promise(function (resolve, reject) {
    try {

      var options = {
        "async": true,
        "crossDomain": true,
        "url": `${submitRequestUrl}?name=${taskId}`,
        "method": "GET",
        "headers": {
          "Content-Type": "application/json",
          "x-api-key": apiKey
        },
        "processData": false
      }

      console.log(options);

      $.ajax(options).done((response) => {
        console.log(response);
        resolve(response);
      }).fail((jqXHR, textStatus, errorThrown) => {
        console.error(jqXHR);
        console.error(textStatus);
        reject(errorThrown);
      });
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}
