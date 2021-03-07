import axios from "axios";

const AXIOS = axios.create({
  //baseURL: `//localhost:8080/api`,
  baseURL: `//vps101.ap.be/api`,
  timeout: 5000,
  headers: {
    //"Access-Control-Allow-Origin": "http://localhost:8080",
    "Access-Control-Allow-Origin": "http://vps101.ap.be",
  },
});

export default {
  //#region EXTERNAL
  getExternals() {
    return AXIOS.get("/external");
  },
  deleteExternalById(id) {
    return AXIOS.delete("/external/" + id);
  },
  saveNewExternal(firstname, lastname, email, companyname) {
    return AXIOS.post("/external", {
      firstname: firstname,
      lastname: lastname,
      email: email,
      companyname: companyname,
    });
  },
  sendMailToExternal(body, recipient, emailsubject, carboncopies) {
    return AXIOS.post("/external/email", {
      body: body,
      recipient: recipient,
      subject: emailsubject,
      carboncopies: carboncopies,
    });
  },
  //#endregion

  //#region User and Role
  getUsers() {
    return AXIOS.get("/users");
  },
  getUser(id) {
    return AXIOS.get("/users/" + id);
  },
  saveNewUser(id, fn, ln, em, spEm) {
    return AXIOS.post("/user", {
      id: id,
      firstname: fn,
      lastname: ln,
      email: em,
      spEmail: spEm,
      role: "Employee",
    });
  },
  updateRole(id, role) {
    return AXIOS.put(`/user`, {
      id: id,
      role: role,
    });
  },

  assignDefect(userid, defectid) {
    AXIOS.post("/user/assigndefect/" + userid + "/" + defectid);
  },
  assignDefectExternal(userid, defectid) {
    AXIOS.post("/external/" + userid + "/assign/defect/" + defectid);
  },

  assignTask(userid, taskid) {
    AXIOS.post("/user/assigntask/" + userid + "/" + taskid);
  },
  assignTaskExternal(userid, taskid) {
    AXIOS.post("/external/" + userid + "/assign/task/" + taskid);
  },

  //used in profile page
  getAssignedDefects(userid) {
    let defectarray = [];
    let arrayresponse = [];
    AXIOS.get("/user/defects/" + userid).then((response) => {
      arrayresponse = response.data;
      //element = defectid
      arrayresponse.forEach((element) => {
        AXIOS.get("/defects/" + element).then((response) => {
          defectarray.push(response.data);
        });
      });
    });
    return defectarray;
  },

  getAssignedTasks(userid) {
    let taskarray = [];
    let arrayresponse = [];
    AXIOS.get("/user/tasks/" + userid).then((response) => {
      arrayresponse = response.data;
      //element = taskid
      arrayresponse.forEach((element) => {
        AXIOS.get("/task/" + element).then((response) => {
          taskarray.push(response.data);
        });
      });
    });
    return taskarray;
  },

  getRoles() {
    return AXIOS.get("/roles");
  },

  getAdminRoles() {
    return AXIOS.get("/user/role/admin");
  },
  //#endregion

  //#region Defect
  getAllDefects() {
    return AXIOS.get(`/defects`);
  },
  getProcessedDefects() {
    return AXIOS.get("/defects/processed");
  },
  getDefectsByStatus(status) {
    return AXIOS.get("/defectsstatus/" + status);
  },
  getDefectsNotOpen() {
    return AXIOS.get("/defectsnotopen");
  },
  getDefectsArchived() {
    return AXIOS.get("/defects/archived");
  },
  getDefect(id) {
    return AXIOS.get("/defects/" + id);
  },
  saveNewDefect(
    name,
    description,
    campuslocation,
    locationroom,
    nearby,
    category,
    photoid,
    creatorid
  ) {
    return AXIOS.post("/defect", {
      name: name,
      description: description,
      campuslocation: campuslocation,
      locationroom: locationroom,
      nearby: nearby,
      category: category,
      photoid: photoid,
      creatorid: creatorid,
    });
  },
  updateDefect(
    name,
    description,
    campuslocation,
    locationroom,
    nearby,
    category,
    photoid,
    id,
    creatorid
  ) {
    return AXIOS.put("/defect/" + id, {
      name: name,
      description: description,
      campuslocation: campuslocation,
      locationroom: locationroom,
      nearby: nearby,
      category: category,
      photoid: photoid,
      creatorid: creatorid,
    });
  },
  deleteDefectById(id) {
    return AXIOS.delete("/defect/" + id);
  },
  //#endregion

  //#region Task
  deleteTaskById(id) {
    return AXIOS.delete("/task/" + id);
  },
  getAllTasks() {
    return AXIOS.get(`/tasks`);
  },
  getProcessedTasks() {
    return AXIOS.get("/tasks/processed");
  },
  getTask(id) {
    return AXIOS.get("/task/" + id);
  },
  saveNewTask(
    name,
    description,
    campuslocation,
    locationroom,
    nearby,
    category,
    creatorid
  ) {
    return AXIOS.post("/task", {
      name: name,
      description: description,
      campuslocation: campuslocation,
      locationroom: locationroom,
      nearby: nearby,
      category: category,
      creatorid: creatorid,
    });
  },
  updateTask(
    name,
    description,
    campuslocation,
    locationroom,
    nearby,
    category,
    id,
    creatorid
  ) {
    return AXIOS.put("/task/" + id, {
      name: name,
      description: description,
      campuslocation: campuslocation,
      locationroom: locationroom,
      nearby: nearby,
      category: category,
      creatorid: creatorid,
    });
  },

  upvoteDefect(id, isUpvote) {
    return AXIOS.put("/defect/" + id + "/upvote/" + isUpvote);
  },

  getTasksArchived() {
    return AXIOS.get(`/tasks/archived`);
  },

  getAllUpvotedDefectOfUser(id) {
    return AXIOS.get("/users/" + id + "/upvoted");
  },
  addUpvoteToUser(id, defectId) {
    return AXIOS.put("/users/" + id + "/upvoted/" + defectId);
  },
  removeUpvoteInUser(id, defectId) {
    return AXIOS.delete("/users/" + id + "/upvoted/" + defectId);
  },
  //#endregion

  //#region Photo
  postPhoto(image) {
    const fd = new FormData();
    fd.append("title", image.name);
    fd.append("image", image);
    return AXIOS.post("/photo", fd);
  },
  getPhoto(id) {
    return AXIOS.get("/photo/" + id);
  },
  deletePhotoById(id) {
    return AXIOS.delete("/photo/" + id);
  },
  //#endregion

  //#region Comment
  postComment(defectid, text, creatorid) {
    return AXIOS.post("/comment", {
      defectid: defectid,
      text: text,
      creatorid: creatorid,
    });
  },
  getCommentsForDefect(id) {
    return AXIOS.get("/commentsfordefect/" + id);
  },
  deleteComment(defectid) {
    return AXIOS.delete("/comments/" + defectid);
  },
  //#endregion

  //#region Status changed
  getStatusForDefect(id) {
    return AXIOS.get("/defect/status/" + id);
  },
  getStatusForTask(id) {
    return AXIOS.get("/task/" + id + "/status");
  },
  updateStatusOfDefect(status, id) {
    return AXIOS.put("/defect/status/" + id, {
      status: status,
    });
  },
  updateStatusOfTask(status, id) {
    return AXIOS.put("/task/" + id + "/status", {
      status: status,
    });
  },
  //#endregion

  //#region Location
  getCampusLocations() {
    return AXIOS.get("/locations");
  },
  getLocationByCampusname(campusname) {
    return AXIOS.get("/location/" + campusname);
  },
  addNewCampus(campusname, streetname) {
    return AXIOS.post("/location", {
      campusname,
      streetname,
    });
  },
  addNewRoom(roomnumber, campusid) {
    return AXIOS.post("addroom/" + campusid, {
      roomnumber,
    });
  },
  deleteRoomFromCampus(roomnumber, campusid) {
    return AXIOS.delete("/location/" + campusid + "/room/" + roomnumber);
  },

  //#endregion

  //#region EmailTemplate
  getEmailTemplates() {
    return AXIOS.get("/emailtemplates");
  },
  getEmailTemplate(id) {
    return AXIOS.get("/emailtemplate/" + id);
  },
  updateEmailTemplate(id, text) {
    return AXIOS.put("/emailtemplate/" + id, {
      text: text,
    });
  },
  //#endregion

  //#region Category
  getCategoryList() {
    return AXIOS.get("/categories");
  },
  deleteCategoryById(primcatid, categoryid) {
    return AXIOS.delete("category/" + primcatid + "/" + categoryid);
  },
  addNewCategory(name, primcatid) {
    return AXIOS.post("/category/" + primcatid, {
      name: name,
    });
  },
  //#endregion

  //#region Notifications
  getNotifications(id) {
    return AXIOS.get("/user/" + id + "/notifications");
  },
  deleteNotification(id, index) {
    return AXIOS.delete("/user/" + id + "/notification/" + index);
  },
  deleteNotifications(id) {
    return AXIOS.delete("/user/" + id + "/notifications");
  },
  updateNotificationToRead(id) {
    return AXIOS.put("/user/" + id + "/notification");
  },
  subscribeToDefect(userId, defectId) {
    return AXIOS.put("/defect/" + defectId + "/subscribe/" + userId);
  },
  unsubscribeToDefect(userId, defectId) {
    return AXIOS.put("/defect/" + defectId + "/unsubscribe/" + userId);
  },
  //#endregion

  //#region Department
  getAllDepartments() {
    return AXIOS.get("/departments");
  },
  addContactToDepartment(
    name,
    contactfunction,
    telephonenumber,
    mobilenumber,
    emailadress,
    departmentid
  ) {
    return AXIOS.post("/department/contact/" + departmentid, {
      name,
      contactfunction,
      telephonenumber,
      mobilenumber,
      emailadress,
    });
  },
  deleteDepartmentContact(depid, contname) {
    return AXIOS.delete("/department/" + depid + "/contact/" + contname);
  },
  updateContactInDepartment(
    name,
    contactfunction,
    telephonenumber,
    mobilenumber,
    emailadress,
    departmentid,
    contactid
  ) {
    return AXIOS.put("/department/" + departmentid + "/" + contactid, {
      name,
      contactfunction,
      telephonenumber,
      mobilenumber,
      emailadress,
    });
  },
  getDepartmentById(departmentid) {
    return AXIOS.get("/department/" + departmentid);
  },
  //#endregion
};
