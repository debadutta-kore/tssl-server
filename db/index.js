const jwt = require("jsonwebtoken");
const axios = require("axios").default;
const request = axios.create({
  baseURL: "https://bots.kore.ai/api/1.1/public",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    auth: jwt.sign(
      {
        sub: "1234567890",
        appId: process.env.tableClientId,
      },
      process.env.tableClientSecret,
      { algorithm: "HS256" }
    ),
  },
  validateStatus:(status)=> (status < 300)
});


module.exports.addRow = async (from, data)=>{
  return await request.post(`/tables/${from}`, {data});
}

/**
 * @param {string} from 
 * @param {{query:{expressions:Array<{field:string, operand:string, value:string}>,operator:'and'|'or'}, data: object}} data
 * @returns {Promise<import("axios").AxiosResponse>}
 */
module.exports.updateRow = async(from, data) =>{
  return await request.put(`/tables/${from}`, data);
}

/**
 * @param {string} from 
 * @param {{query:{expressions:Array<{field:string, operand:string, value:string}>,operator:'and'|'or'}}} data
 * @returns {Promise<import("axios").AxiosResponse>}
 */
module.exports.deleteRow = async (from, id) => {
  return await request.delete(`/tables/${from}/rows/${id}`);
};

/**
 * @param {string} from 
 * @param {{query: object}} data
 * @returns {Promise<import("axios").AxiosResponse>}
 */
module.exports.getRows = async (from,data)=>{
  return await request.post(`/tables/${from}/rows/query`,data);
}

module.exports.getRowById = async (from,id)=>{
  return await request.get(`/tables/${from}/rows/${id}`);
}

module.exports.updateRowById = async(from, id, data)=>{
  return await request.put(`/tables/${from}/rows/${id}`,{data});
}