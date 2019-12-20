import generatePassword from 'secure-random-string'
import parameterize from 'parameterize'

const createUser = async (form, authKey, messages) => (
  fetch(`${process.env.VUE_APP_DISCOURSE_USER_URL}?${Object.entries({
    accepted_gtc: true,
    accepted_privacy_policy: true,
    edgeryders_research_consent: true,
    requested_api_keys: [process.env.VUE_APP_DISCOURSE_DOMAIN],
    auth_key: authKey,
    email: formField(form, 'email'),
    username: await generateUsername(form),
    password: generatePassword({ length: 15 })
  }).map(pair => pair.map(encodeURIComponent).join('=')).join('&')}`)
    .then(handleResponse(messages), handleNetworkError(messages))
)

const createTopic = (form, apiKey, messages) => (
  fetch(process.env.VUE_APP_DISCOURSE_TOPIC_URL, {
    method: 'post',
    headers: { 'Api-Key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: `BBU application - response by ${formField(form, 'pseudonym')}`,
      raw: generateBabelResponse(form),
      category: process.env.VUE_APP_DISCOURSE_CATEGORY
    })
  }).then(handleResponse(messages), handleNetworkError(messages))
)

const handleResponse = messages => (
  response => (
    response.ok
      ? response.json()
      : response.json().then(({ errors }) => (
        Promise.reject(Object.keys(errors).map(key => (
          messages[key] || messages.default
        )))
      )
    )
  )
)

const handleNetworkError = messages => (
  () => Promise.reject([messages.networkError])
)

const formField = (form, field) => (
  Object.values(form).map(f => (f[field] || {}).value).filter(value => value).join('')
)

const generateUsername = async form => {
  try {
    let res = await fetch('https://' + process.env.VUE_APP_DISCOURSE_DOMAIN + '/u/' + formField(form, 'pseudonym'), {
    method: 'get',
    headers: {'Content-Type': 'application/json' },
    })
    let name = res.ok
      ? `${parameterize(formField(form, 'pseudonym'), 20, '_')}_${Math.ceil(Math.random() * 100)}` 
      : formField(form, 'pseudonym')
    return name
  } 
  catch {
    return `${parameterize(formField(form, 'pseudonym'), 20, '_')}_${Math.ceil(Math.random() * 100)}`
  }
}

const formValueByColumnName = ( form, column ) => (
  Object.values(form).find(element => element.settings.columnName === column)
)

const generateBabelResponse = form => (
  [
    "## Unpromted contribution",
    formValueByColumnName(form, "unpromptedtest")
      ? formValueByColumnName(form, "unpromptedtest").message.value
      : 'None',
    "## Prompted contribution",
    "### Prompt",
    form.prompt.prompt.value,
    "  ",
    "### Response",
    formValueByColumnName(form, "promptedtest")
      ? formValueByColumnName(form, "promptedtest").message.value
      : 'None',
  ].join('\n\n')
)

const generateResponse = form => (
  Object.values(form).map(({ body, message, prompt, settings: { omitBody, omitFields, omit }, ...fields }) => (
    [
      (omitBody ? '' : `**${body}**`),
      (!omit && message ? `${message.value}` : ''),
      Object.entries(fields)
            .filter(([, { settings: { omit } }]) => !omit)
            .map(([field, { value }]) => [(omitFields ? '' : `**${field}:** `), value].join(''))
            .join('\n'),
      (prompt ? `${prompt.value}` : '')
    ]
  )).flat().join('\n\n')
)

export default (form, messages) => (
    createUser(form, process.env.VUE_APP_DISCOURSE_AUTH_KEY, messages).then(json => (
    createTopic(form, json.api_keys[0].key, messages)
  ))
)

export { handleResponse, handleNetworkError, generateResponse, generateBabelResponse }
