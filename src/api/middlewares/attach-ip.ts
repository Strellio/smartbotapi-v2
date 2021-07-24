'use strict'

import geoip from 'geoip-lite'

const attachIpToReq = (req: any, res: any, next: any) => {
  let ip =
    req.headers['cf-connecting-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress
  if (ip.includes('::ffff:')) {
    ip = ip.split(':').reverse()[0]
  }
  if (!ip || ip === '127.0.0.1' || ip === '::1') {
    ip = '154.160.30.24'
  }
  const geoInfo = geoip.lookup(ip)
  const mergedUserAgent = { ip, ...geoInfo, ...req.useragent }
  req.useragent = mergedUserAgent
  next()
}

export default attachIpToReq
