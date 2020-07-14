import express from 'express'
import bodyParser from 'body-parser'
import axios from 'axios'
const app = express()

app
  .use(bodyParser.json())
  .post('/webhooks', async (req, res, next) => {
    res.sendStatus(200)
    const {
      data: { admins }
    } = await axios.get('https://api.intercom.io/admins', {
      headers: {
        Authorization: `Bearer dG9rOjgwNWVkMTU2XzJhZDdfNGQ2ZF85ZDZkXzEwNDg1OGQ2Mjc5YzoxOjA=`
      }
    })
    console.log(req.body.data, admins[0])
    await axios
      .post(
        `https://api.intercom.io/conversations/last/reply`,
        {
          message_type: 'comment',
          type: 'admin',
          body: '<button>hello guys </button>',
          intercom_user_id: req.body.data.item.user.id,
          admin_id: admins[0]?.id
        },
        {
          headers: {
            Authorization: `Bearer dG9rOjgwNWVkMTU2XzJhZDdfNGQ2ZF85ZDZkXzEwNDg1OGQ2Mjc5YzoxOjA=`
          }
        }
      )
      .catch(e => console.log(e.response.data))
  })
  .get('/intercom', async (req, res, next) => {
    res.sendStatus(200)
    console.log(req.query)
    const { data } = await axios.post(
      'https://api.intercom.io/auth/eagle/token',
      {
        code: req.query.code,
        client_id: 'e743e285-9851-4f26-b626-f95b96b841d8',
        client_secret: '7e9b2aa5-5b79-4473-83af-3d7859d222d4'
      }
    )
  })
  .listen(4000, () => console.log('lsitenning on port http://localhost:4000'))
