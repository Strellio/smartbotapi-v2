import express from 'express'
import bodyParser from 'body-parser'
import axios from 'axios'
const app = express()

app
  .use(bodyParser.json())
  .post('/hubspot', (req, res, next) => {
    console.log(req.body)
    res.json({
      botMessage: 'j hjbhbhbhjbhjbhjb',
      nextModuleNickname: 'PromptForCollectUserInput',
      responseExpected: true,
      images: [
        {
          src:
            'https://i1.wp.com/crackedkey.org/wp-content/uploads/2019/08/UBot-Studio-Cracked.jpg?resize=592%2C229&ssl=1'
        }
      ],
      quickReplies: [
        // A list of quick reply options selected by the visitor
        {
          value: 'YES',
          label: 'YES'
        },
        {
          value: 'NO',
          label: 'NO'
        }
      ]
    })
  })
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
          body: `<div class="composer-suggestions-container intercom-1ttta75 e1y2xk9v0"><div class="intercom-xbrvud e1y2xk9v2"><div height="0" class="intercom-18khmar e1y2xk9v3"><div class="intercom-36wep1 e1y2xk9v5"><div class="intercom-1baulvz e1y2xk9v6"><button value="" class=" intercom-15uc034 e1y2xk9v4" style="max-width: 304px; display: none;">I'm good, thanks</button></div></div><button value="[object Object]" class=" intercom-15uc034 e1y2xk9v4" style="transform: translate3d(-131px, 0px, 0px); max-width: 304px; opacity: 1; visibility: hidden;">Yes, let's chat</button><button value="[object Object]" class=" intercom-15uc034 e1y2xk9v4" style="transform: translate3d(0px, 0px, 0px); max-width: 304px; opacity: 1; visibility: hidden;">I'm good, thanks</button></div></div></div>`,
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
