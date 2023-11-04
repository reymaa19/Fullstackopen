import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
  return axios
    .get(baseUrl)
    .then(response => response.data)
}

const addPerson = (newPerson) => {
  return axios
    .post(baseUrl, newPerson)
    .then(response => response.data)
}

const deletePerson = (id) => {
  axios
    .delete(`${baseUrl}/${id}`)
}

const changeNumber = (changePerson) => {
  return axios
    .put(`${baseUrl}/${changePerson.id}`, changePerson)
    .then(response => response.data)
}

export default { getAll, addPerson, deletePerson, changeNumber }
