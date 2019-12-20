import { handleNetworkError } from './discourse'

const getAirTableResponses = () => (
  fetch(process.env.VUE_APP_AIR_TABLE_FICTON_TABLE, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  }).then(response => 
    response.ok
     ? response.json()
     : handleNetworkError(response)
  )
)

const objectMap = objArray => {
  let entries = []
  Object.values(objArray).forEach(obj => {
    if ( obj.message ) {
      entries.push([obj.settings.columnName, obj.message.value])
      return entries
    }
    Object.entries(obj).forEach( ([ key, value ]) => {
      if ( !['body', 'columnName', 'index', 'settings', 'message', 'consent', 'fields'].includes(key) ) {
        entries.push([key, value.value])
      }
    }
    )
  })
  return Object.fromEntries(entries)
}

const submitAirTableResponse = async ( form ) => (
  fetch(process.env.VUE_APP_AIR_TABLE_RESPONSE_TABLE_POST, {
      method: 'POST',
      headers: { 'Authorization': 'SNry19lQ2zL0Z', 'Content-Type': 'application/json' },
      body: JSON.stringify(objectMap(form)) // body data type must match "Content-Type" header
    }).then(response => 
      { 
        return Promise.resolve(response)
      })
      .catch(error => handleNetworkError(error))
)

export { getAirTableResponses, objectMap as generateAirTableResponse, submitAirTableResponse }