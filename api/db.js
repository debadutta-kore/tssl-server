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
});

/**
 *
 * @param {{sessionId: string, user: string, admin: string}} data
 * @returns {Promise<import("axios").AxiosResponse>}
 */
module.exports.saveSession = async (data) => {
  return await request.post("/tables/userSession", {data});
};
/**
 *
 * @param {{query:{expressions:Array<{field:string, operand:string, value:string}>,operator:'and'|'or', data: object}}} data
 * @returns {Promise<import("axios").AxiosResponse>}
 */
module.exports.updateSession = async (data) => {
  return await request.put("/tables/userSession", data);
};
/**
 *
 * @param {{query:{expressions:Array<{field:string, operand:string, value:string}>,operator:'and'|'or'}}} data
 * @returns {Promise<import("axios").AxiosResponse>}
 */
module.exports.deleteSession = async (id) => {
  return await request.delete(`/tables/userSession/rows/${id}`);
};
/**
 * @param {{query: object}} data
 * @returns {Promise<import("axios").AxiosResponse>}
 */
module.exports.getSession = async (data) => {
  return await request.post("/tables/userSession/rows/query", data);
};

/**
 *
 * @param {{query: object}} data
 * @returns
 */
module.exports.getUser = async (data) => {
  return await request.post("/tables/user/rows/query", data);
};
/**
 *
 * @param {{email: string, password: string}} data
 */
module.exports.addUser = async (data) => {
  return await request.post("/tables/user", {data});
};

/**
 * 
 * @param {string} id 
 * @returns 
 */
module.exports.deleteUser = async (id) => {
  return await request.delete(`/tables/user/rows/${id}`);
};

/**
 *
 * @param {{query:{expressions:Array<{field:string, operand:string, value:string}>,operator:'and'|'or', data: object}}} data
 * @returns {Promise<import("axios").AxiosResponse>}
 */
module.exports.updateUser = async (data) => {
  return await request.put("/tables/user", data);
};

/**
 * 
 * @param {{userId: string, usecaseId: string, enable: number}} data 
 * @returns {Promise<import("axios").AxiosResponse>}
*/

module.exports.addUsecase = async (data) => {
  return await request.post("/tables/userUsecase", {data});
};

/**
 *
 * @param {{query:{expressions:Array<{field:string, operand:string, value:string}>,operator:'and'|'or', data: object}}} data
 * @returns {Promise<import("axios").AxiosResponse>}
 */
module.exports.updateUsecase = async (data) => {
  return await request.put("/tables/userUsecase", data);
};

/**
 * @param {{query: object}} data
 * @returns {Promise<import("axios").AxiosResponse>}
 */
module.exports.getUsecase = async (data) => {
  return await request.post("/tables/userUsecase/rows/query", data);
};

/**
 * 
 * @param {string} id 
 * @returns 
 */
module.exports.deleteUsecase = async (id) => {
  return await request.delete(`/tables/userUsecase/rows/${id}`);
};
