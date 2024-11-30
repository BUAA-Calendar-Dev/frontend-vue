import axios from "axios";

export function getClassList() {
  return axios.post(`${process.env.VUE_APP_ROOT_URL}/api/class/info`);
}

export function getAvailableStudents() {
  return axios.get(`${process.env.VUE_APP_ROOT_URL}/api/student/list`);
}

export function getAvailableTeachers() {
  return axios.get(`${process.env.VUE_APP_ROOT_URL}/api/teacher/list`);
}

export function addStudentsToClass(classId, studentIds) {
  return axios.post(
    `${process.env.VUE_APP_ROOT_URL}/api/class/${classId}/student`,
    { students: studentIds }
  );
}

export function removeStudentsFromClass(classId, studentIds) {
  return axios.post(
    `${process.env.VUE_APP_ROOT_URL}/api/class/${classId}/student/delete`,
    { students: studentIds }
  );
}

export function addTeachersToClass(classId, teacherIds) {
  return axios.post(
    `${process.env.VUE_APP_ROOT_URL}/api/class/${classId}/teacher`,
    { teachers: teacherIds }
  );
}

export function removeTeachersFromClass(classId, teacherIds) {
  return axios.post(
    `${process.env.VUE_APP_ROOT_URL}/api/class/${classId}/teacher/delete`,
    { teachers: teacherIds }
  );
}

export function createClass(classData) {
  return axios.post(
    `${process.env.VUE_APP_ROOT_URL}/api/class/create`,
    classData
  );
}
