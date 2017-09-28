var path=require('path');
var config = {};

config.blogName = 'myBlog';
config.url = 'http://localhost/';
// config.filepath='/public/images/';
// config.tmppath='/public/tmp/';
//config.fileserverid='http://139.196.186.249:8080';
config.fileserverid='http://120.25.103.145:8080';
config.rss = {
  title:        'My RSS Feed',
  description:  'LoremIpsum',
  link:         'http://mySite.fr',
  image:        'http://mySite.fr/logo.png',
  copyright:     'Copyright © 2013 John Doe. All rights reserved'

};
config.microVideoID='AKIDQDdofFPxpcsSFTffEE6pvsHOOEAcA4Oz';

config.microVideoKey='fS8z3EXcRiSkJ92GS6JCq0h8Vax3ZXyQ';
config.microAppid='10021344';

//7N 配置
config.Access_Key='Us60SoTyFdTib7nLaUidvV3Vgacc3RujU289hafU';
config.Secret_Key='xB8gNLob1YxLQ6zCb03TUVCSX_d8G7dVQOxqD2BJ';
config.BucketName='trutyfile';
config.DomainName='http://images.truty.cn/';
//友盟推送设置
// config.umPushAppid='56725998e0f55a2150001566';
// config.umPushKey='mblxzg7ctsfvynhwhb6i2hubugy9rjst';
// config.umproduction_mode='true';

//支付回调地址
config.payCallBackIp='http://api.truty.cn';

// //支付回调地址
// config.payCallBackIp='http://120.25.103.145:3002';

//支付宝app支付信息
config.alipay={
    partner:'2088221532404481',//合作身份者id，以2088开头的16位纯数字
    key:'zsnkvrt1epnss1cll6a6gcs5iejpwf77',  //安全检验码，以数字和字母组成的32位字符
    seller_email:'truty@truty.cn',//支付宝帐户 必填
    name:'厦门超体创客互联科技有限公司',//支付宝帐户名 必填
    host:'http://api.truty.cn/'//域名
};

//微信app支付信息
config.wxApppay = {
  appid: "wx320ce7e9ee6f915c",
  mch_id: "1327289001",
  partner_key: "TRUTYMAYER201506TRUTYMAYER201506",
  key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC2RwkJaeQdzKbd\nEJPl+roVQu2For3mSCJpbXCqxohVrS6N6oxbrJVwjj+wChkgfVzX9vP1avHLSQEu\n/awqpPHDzSr91ravdEJ2d9Dgsy/L8vsMVDq4zdq7Pa/V0Ke1+5Io+f6bKtgP1m2C\n6s+2RddL0Xwtm98FT9Rr5MwUUVDbs2qisEvEALkgd7UVyhEEyZ/g7tctfwsNWPTA\nDWpsM4TvYL95KvCNwUm+Uy69I5n1pbXIJNBSvL3tDHDtKweypMd7LPw3lHgzOqyd\nIy15YxAtkdgpbAnDp+dwMOObfgwhRdsaDLcc3goD2kL9rYF6k3S5QXRB79UenRJb\njvHr3StBAgMBAAECggEAEv2bp2ts5N3plKahghh5QrXSYVXvSwrA6xMH5gMBOUvt\nycNiFDsK5ssrP4AN1iC5h5anHC6kOnXEtcygH2FH/wplLEUui2Ele4pILOD+XdVW\n6pXr+E0aON/YbgJrNr6bH8HMEQaJtDy29Cjaszbbk36j3Wyb88W5b/RKfuNp9Tmz\nIUozcIXnE6XzDsd3Rn9WAeazsVhpAYcnwpLORZSqnCZOL3SzfxkMwiCtsRLyfqDd\nLgnAxKgyjzKLH0r2BfnCeNyP0oS+iuPf21egkl7GnZz1MMm6OnJhOdw8ztpq2Y2U\n8//cvgAyRe4c9wD4NLkAedI+ZklAdvY0ZcxlT6CQcQKBgQDcI+W0GqHwKXd2NwcX\nd+qMuxN/3TWGfZzR5UNnT2vwbgnYtyQN+72AuOojmWpQ5Rsj6+PD0A14LYKrhc3b\nsuodYYUD8knP4xy+4IqUjHFg55w7LLFR4DQM1w6bZdhYu0px72Hm3E4TGXs37cnC\nvQU4ixj9DmaHfYxFIBFaJKdHswKBgQDT+De+ZuIGPqYDASkHH76phalXT9VaMnJz\nxiWc0WJXvIsnVEpC2+4LfS7clTpGwYfgotr2rKPncHZWga5BtabZ/hkFpw0hM/tV\nGIwnLEGVA4nUQs5mv2/RJBoVZ1ENro09BBgdRG0pOddcdEwngawIyNNsiJUyoF2c\nV4FgI19HOwKBgBUNDbsyTMgFfxn72x7AZdp9TTkN8z9gJa3gqZhofN7p9uEVako4\nB4AWrrUmx4bi0byWoxonfBJA79ztF6lpq3+RwsGE2tAZXLdYC4h3AaSNoV/7Px2g\nPfn4Wro7e/vINS89//Oun3yuFB1eDMwlfSlSC9qvFNjiBZbaoS4okSKHAoGAaOp0\n/OMDgL/Ff7s1SXdm8ZVcygCTw38wsykiOMpSeMazwZWw5ALjggBGD5w1KgxkasVw\nx6OPxOAfUpYBYDi/Cyr/y5JxpzuJbQcnZ8Q5+b20nMEsVCLw/311A58NuU3qTocW\nQHY76anddL+DahJ+yiJMs22vG03Qx69wM9uOLz0CgYA1f94rdtlp+76D/XZLjtYG\n4gsAmj07bbuAOjhmVz/YSm27kZmu7k4Si6OO60u71iZfWx4jYW9FvhmisnwpMdVG\nS+na85PbeWngfItiDVEGKg9RGxOAcQDxNhyt8qSgk8nuU1bgCbpP+0pYjl6uPHvE\n77XVr8BCh74jFh7xzMz73A==\n-----END PRIVATE KEY-----\n",
  cert : "-----BEGIN CERTIFICATE-----\nMIIEbjCCA9egAwIBAgIDHMk5MA0GCSqGSIb3DQEBBQUAMIGKMQswCQYDVQQGEwJD\nTjESMBAGA1UECBMJR3Vhbmdkb25nMREwDwYDVQQHEwhTaGVuemhlbjEQMA4GA1UE\nChMHVGVuY2VudDEMMAoGA1UECxMDV1hHMRMwEQYDVQQDEwpNbXBheW1jaENBMR8w\nHQYJKoZIhvcNAQkBFhBtbXBheW1jaEB0ZW5jZW50MB4XDTE2MDMzMDA0NTAxMloX\nDTI2MDMyODA0NTAxMlowgZ4xCzAJBgNVBAYTAkNOMRIwEAYDVQQIEwlHdWFuZ2Rv\nbmcxETAPBgNVBAcTCFNoZW56aGVuMRAwDgYDVQQKEwdUZW5jZW50MQ4wDAYDVQQL\nEwVNTVBheTEzMDEGA1UEAxQq5Y6m6Zeo6LaF5L2T5Yib5a6i5LqS6IGU56eR5oqA\n5pyJ6ZmQ5YWs5Y+4MREwDwYDVQQEEwgxMTcxMDgyMTCCASIwDQYJKoZIhvcNAQEB\nBQADggEPADCCAQoCggEBALZHCQlp5B3Mpt0Qk+X6uhVC7YWiveZIImltcKrGiFWt\nLo3qjFuslXCOP7AKGSB9XNf28/Vq8ctJAS79rCqk8cPNKv3Wtq90QnZ30OCzL8vy\n+wxUOrjN2rs9r9XQp7X7kij5/psq2A/WbYLqz7ZF10vRfC2b3wVP1GvkzBRRUNuz\naqKwS8QAuSB3tRXKEQTJn+Du1y1/Cw1Y9MANamwzhO9gv3kq8I3BSb5TLr0jmfWl\ntcgk0FK8ve0McO0rB7Kkx3ss/DeUeDM6rJ0jLXljEC2R2ClsCcOn53Aw45t+DCFF\n2xoMtxzeCgPaQv2tgXqTdLlBdEHv1R6dEluO8evdK0ECAwEAAaOCAUYwggFCMAkG\nA1UdEwQCMAAwLAYJYIZIAYb4QgENBB8WHSJDRVMtQ0EgR2VuZXJhdGUgQ2VydGlm\naWNhdGUiMB0GA1UdDgQWBBQPsh8wUxrUthB5Mbh0q7TSF+kZWjCBvwYDVR0jBIG3\nMIG0gBQ+BSb2ImK0FVuIzWR+sNRip+WGdKGBkKSBjTCBijELMAkGA1UEBhMCQ04x\nEjAQBgNVBAgTCUd1YW5nZG9uZzERMA8GA1UEBxMIU2hlbnpoZW4xEDAOBgNVBAoT\nB1RlbmNlbnQxDDAKBgNVBAsTA1dYRzETMBEGA1UEAxMKTW1wYXltY2hDQTEfMB0G\nCSqGSIb3DQEJARYQbW1wYXltY2hAdGVuY2VudIIJALtUlyu8AOhXMA4GA1UdDwEB\n/wQEAwIGwDAWBgNVHSUBAf8EDDAKBggrBgEFBQcDAjANBgkqhkiG9w0BAQUFAAOB\ngQBc02vfOQyvWymKOS8nrBg+SwiowWFbrQuXWTCZRjqe8E3UTq2etg0D/pLIwE6n\nUVDD7cDmMA3laBjSjN0y30pXNWuhr06/LNiUn4rE0VadeNziYQc0cMxNsH/QPqIt\nTTOviDXbNghGTlSsboOoSlwEM3AFx40VBt1W5EoqVszPUg==\n-----END CERTIFICATE-----\n",
  //"wxSecurt" : "59f84a54db98cfa966f533c8baab9bfd",
  //ca:fs.readFileSync('./wechat-mp/rootca.pem'),
  //pfx: fs.readFileSync('./wechat-mp/apiclient_cert.p12')
};
//微信web支付信息
config.wxWebpay ={
  appid: "wx4014e5ef589698bd",
  mch_id: "1416840402",
  partner_key : "TRUTYmaker201506TRUTYmaker201506",
  key : "-----BEGIN PRIVATE KEY-----\r\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC4TTKfRUlfsmgW\r\nDx0JwwkzcvU6206cRkzxe26Su0Q+sNvj7UhicR6xNQaZIW8ZHxQivvLrk57irJSv\r\n9PnQTeYJ9RyoCd60nafEFRS/V9p8vA/XZhtisebyTGuWy1jOST1Rdpa/n+MMrSTq\r\nDdHLsW3UzjeQOol9yJsS/gXzUwNhgofRKm9pvOMjQP+JfpXz0KYxCZPvneUJJIou\r\nD4KDZG7NjmL1z+b22IJQUoUtBBbmF7d5AKdcfVrlFmRpAjoNPhT3JihFdIPozTz5\r\n+5y97HrQUy9Tb24PrcLVgp1cWN1SWwI25xU/1QWBq8ZqkxAVPqR7UMQLX9j3kwaV\r\nPWsBvV6NAgMBAAECggEAPt2+XcvRmn4NuTCQlCreMZmOAvSZ3P6x8lFLR2vvfH7x\r\nks72uPWjJYlT5docvnH2eV+vFyJ0uRdrZJXovOBFjrH4g21SdUOt3VnfiOFb2t5/\r\nfNcMkl7iy1W8AWT9tugOrYIJK/ZLCaDqDZiHLrcoIsXw+BavnaNXGmRh/T0c0x6S\r\nCABa1gS1X9ITMgiqPjqGIX/QZ6/NxGJuVw6D2v66Ludg9XA57hJ/6tawLVMyc5RC\r\n1PVv7cSv9HOpiC3EFf7efVdwNWplSDVlj/2RXyu8AdwjC0pyxbyj/HyQpe2NnLat\r\npCTGHb4+E7tLMei3VPv16a5Cp4hgvKY2TU+4nXbBYQKBgQDi2XljRUJmswVnaGG0\r\nnb1Mmvmn1UrzFvzfiUQoxCcyACkg424u/GHVDMHCvjZ2q53LKTyqLLwXq+aTcyDA\r\nBR5ZRUHEPlC4mx9lEvmzTMpIvpAwDAL0BqO+IMIrjU6EAMWqXViqM5zsrQBzMGu5\r\nUjspkbSarwfEzU6j5ZNH3mPLiQKBgQDP/AzbSSm/ezid3Yb25pjfB/i+0Ut/Eq/F\r\nj5CVA7lzYoAFoenlh4H6yYfQze1cW4RxQBuyqzUTV751EDo5LybFNW/u7+upd/NV\r\ni21+y9/pbNt7VDt/YY4aomZmNs/zfPtFA5ceTgb4xy+9k1zKx/gBv1z3ygnQy5As\r\nLqDCXsGl5QKBgQCBBEC2hdh7AkwLgOE40RGtdOKSYouK78MH+1Cpgs3r8Q1zKAYt\r\ncNrPSb8VXAsruPU4a46WFnUvXVP4/lxc+UxGZ049J1fPdmIHoSAkqoLNlpv4x4wS\r\nb4hHBOiJzoceKjZBa2+W9V3Feass2BgcQTlmrfiylONtOXsFWfdGw6OsSQKBgHVs\r\nn7Ga0Ag8wI1Yih+Rt9OMA6NwNQisezK2SHHpZWXAwfjsHkspw3fdGmIIMa/IN7Fc\r\n+YZZZSDjlDMxkz2/4krLTcQADvRiNa8hhhNldairfgtWVjUn1fwxnlCtN6EH+jFP\r\nwp0ofoUsqEaHEYeneN07tnhryDjrBR38wWSb7QcFAoGALdJGCH5F/8D3+SITIo6U\r\n5ciLM4G9Pcrrw0SNmeXoI1LNDm1V97sN3aBbfqi6C5yWwEyuJTdkN+ToP9IzdUgS\r\n2aueRIvW39CF/rkWh+aAXbUi8X/VsaTiiaFqPLu+q0yHIVnuGasFzeiqUbpjadt/\r\nLszcriFngxhgzdTYO17IYuM=\r\n-----END PRIVATE KEY-----",
  cert : "-----BEGIN CERTIFICATE-----\r\nMIIDIDCCAomgAwIBAgIENd70zzANBgkqhkiG9w0BAQUFADBOMQswCQYDVQQGEwJV\r\nUzEQMA4GA1UEChMHRXF1aWZheDEtMCsGA1UECxMkRXF1aWZheCBTZWN1cmUgQ2Vy\r\ndGlmaWNhdGUgQXV0aG9yaXR5MB4XDTk4MDgyMjE2NDE1MVoXDTE4MDgyMjE2NDE1\r\nMVowTjELMAkGA1UEBhMCVVMxEDAOBgNVBAoTB0VxdWlmYXgxLTArBgNVBAsTJEVx\r\ndWlmYXggU2VjdXJlIENlcnRpZmljYXRlIEF1dGhvcml0eTCBnzANBgkqhkiG9w0B\r\nAQEFAAOBjQAwgYkCgYEAwV2xWGcIYu6gmi0fCG2RFGiYCh7+2gRvE4RiIcPRfM6f\r\nBeC4AfBONOziipUEZKzxa1NfBbPLZ4C/QgKO/t0BCezhABRP/PvwDN1Dulsr4R+A\r\ncJkVV5MW8Q+XarfCaCMczE1ZMKxRHjuvK9buY0V7xdlfUNLjUA86iOe/FP3gx7kC\r\nAwEAAaOCAQkwggEFMHAGA1UdHwRpMGcwZaBjoGGkXzBdMQswCQYDVQQGEwJVUzEQ\r\nMA4GA1UEChMHRXF1aWZheDEtMCsGA1UECxMkRXF1aWZheCBTZWN1cmUgQ2VydGlm\r\naWNhdGUgQXV0aG9yaXR5MQ0wCwYDVQQDEwRDUkwxMBoGA1UdEAQTMBGBDzIwMTgw\r\nODIyMTY0MTUxWjALBgNVHQ8EBAMCAQYwHwYDVR0jBBgwFoAUSOZo+SvSspXXR9gj\r\nIBBPM5iQn9QwHQYDVR0OBBYEFEjmaPkr0rKV10fYIyAQTzOYkJ/UMAwGA1UdEwQF\r\nMAMBAf8wGgYJKoZIhvZ9B0EABA0wCxsFVjMuMGMDAgbAMA0GCSqGSIb3DQEBBQUA\r\nA4GBAFjOKer89961zgK5F7WF0bnj4JXMJTENAKaSbn+2kmOeUJXRmm/kEd5jhW6Y\r\n7qj/WsjTVbJmcVfewCHrPSqnI0kBBIZCe/zuf6IWUrVnZ9NA2zsmWLIodz2uFHdh\r\n1voqZiegDfqnc1zqcPGUIWVEX/r87yloqaKHee9570+sB3c4\r\n-----END CERTIFICATE-----",
  //"wxSecurt" : "91b80771360be2c27901e04febeb704e"
};

//微信小程序支付信息
config.wxAppletPay ={
  appid: "wxe8596cda75f9d411",
  mch_id: "1266074001",
  partner_key : "TRUTYmaker201506TRUTYmaker201506",
  key : "-----BEGIN PRIVATE KEY-----\r\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC4TTKfRUlfsmgW\r\nDx0JwwkzcvU6206cRkzxe26Su0Q+sNvj7UhicR6xNQaZIW8ZHxQivvLrk57irJSv\r\n9PnQTeYJ9RyoCd60nafEFRS/V9p8vA/XZhtisebyTGuWy1jOST1Rdpa/n+MMrSTq\r\nDdHLsW3UzjeQOol9yJsS/gXzUwNhgofRKm9pvOMjQP+JfpXz0KYxCZPvneUJJIou\r\nD4KDZG7NjmL1z+b22IJQUoUtBBbmF7d5AKdcfVrlFmRpAjoNPhT3JihFdIPozTz5\r\n+5y97HrQUy9Tb24PrcLVgp1cWN1SWwI25xU/1QWBq8ZqkxAVPqR7UMQLX9j3kwaV\r\nPWsBvV6NAgMBAAECggEAPt2+XcvRmn4NuTCQlCreMZmOAvSZ3P6x8lFLR2vvfH7x\r\nks72uPWjJYlT5docvnH2eV+vFyJ0uRdrZJXovOBFjrH4g21SdUOt3VnfiOFb2t5/\r\nfNcMkl7iy1W8AWT9tugOrYIJK/ZLCaDqDZiHLrcoIsXw+BavnaNXGmRh/T0c0x6S\r\nCABa1gS1X9ITMgiqPjqGIX/QZ6/NxGJuVw6D2v66Ludg9XA57hJ/6tawLVMyc5RC\r\n1PVv7cSv9HOpiC3EFf7efVdwNWplSDVlj/2RXyu8AdwjC0pyxbyj/HyQpe2NnLat\r\npCTGHb4+E7tLMei3VPv16a5Cp4hgvKY2TU+4nXbBYQKBgQDi2XljRUJmswVnaGG0\r\nnb1Mmvmn1UrzFvzfiUQoxCcyACkg424u/GHVDMHCvjZ2q53LKTyqLLwXq+aTcyDA\r\nBR5ZRUHEPlC4mx9lEvmzTMpIvpAwDAL0BqO+IMIrjU6EAMWqXViqM5zsrQBzMGu5\r\nUjspkbSarwfEzU6j5ZNH3mPLiQKBgQDP/AzbSSm/ezid3Yb25pjfB/i+0Ut/Eq/F\r\nj5CVA7lzYoAFoenlh4H6yYfQze1cW4RxQBuyqzUTV751EDo5LybFNW/u7+upd/NV\r\ni21+y9/pbNt7VDt/YY4aomZmNs/zfPtFA5ceTgb4xy+9k1zKx/gBv1z3ygnQy5As\r\nLqDCXsGl5QKBgQCBBEC2hdh7AkwLgOE40RGtdOKSYouK78MH+1Cpgs3r8Q1zKAYt\r\ncNrPSb8VXAsruPU4a46WFnUvXVP4/lxc+UxGZ049J1fPdmIHoSAkqoLNlpv4x4wS\r\nb4hHBOiJzoceKjZBa2+W9V3Feass2BgcQTlmrfiylONtOXsFWfdGw6OsSQKBgHVs\r\nn7Ga0Ag8wI1Yih+Rt9OMA6NwNQisezK2SHHpZWXAwfjsHkspw3fdGmIIMa/IN7Fc\r\n+YZZZSDjlDMxkz2/4krLTcQADvRiNa8hhhNldairfgtWVjUn1fwxnlCtN6EH+jFP\r\nwp0ofoUsqEaHEYeneN07tnhryDjrBR38wWSb7QcFAoGALdJGCH5F/8D3+SITIo6U\r\n5ciLM4G9Pcrrw0SNmeXoI1LNDm1V97sN3aBbfqi6C5yWwEyuJTdkN+ToP9IzdUgS\r\n2aueRIvW39CF/rkWh+aAXbUi8X/VsaTiiaFqPLu+q0yHIVnuGasFzeiqUbpjadt/\r\nLszcriFngxhgzdTYO17IYuM=\r\n-----END PRIVATE KEY-----",
  cert : "-----BEGIN CERTIFICATE-----\r\nMIIDIDCCAomgAwIBAgIENd70zzANBgkqhkiG9w0BAQUFADBOMQswCQYDVQQGEwJV\r\nUzEQMA4GA1UEChMHRXF1aWZheDEtMCsGA1UECxMkRXF1aWZheCBTZWN1cmUgQ2Vy\r\ndGlmaWNhdGUgQXV0aG9yaXR5MB4XDTk4MDgyMjE2NDE1MVoXDTE4MDgyMjE2NDE1\r\nMVowTjELMAkGA1UEBhMCVVMxEDAOBgNVBAoTB0VxdWlmYXgxLTArBgNVBAsTJEVx\r\ndWlmYXggU2VjdXJlIENlcnRpZmljYXRlIEF1dGhvcml0eTCBnzANBgkqhkiG9w0B\r\nAQEFAAOBjQAwgYkCgYEAwV2xWGcIYu6gmi0fCG2RFGiYCh7+2gRvE4RiIcPRfM6f\r\nBeC4AfBONOziipUEZKzxa1NfBbPLZ4C/QgKO/t0BCezhABRP/PvwDN1Dulsr4R+A\r\ncJkVV5MW8Q+XarfCaCMczE1ZMKxRHjuvK9buY0V7xdlfUNLjUA86iOe/FP3gx7kC\r\nAwEAAaOCAQkwggEFMHAGA1UdHwRpMGcwZaBjoGGkXzBdMQswCQYDVQQGEwJVUzEQ\r\nMA4GA1UEChMHRXF1aWZheDEtMCsGA1UECxMkRXF1aWZheCBTZWN1cmUgQ2VydGlm\r\naWNhdGUgQXV0aG9yaXR5MQ0wCwYDVQQDEwRDUkwxMBoGA1UdEAQTMBGBDzIwMTgw\r\nODIyMTY0MTUxWjALBgNVHQ8EBAMCAQYwHwYDVR0jBBgwFoAUSOZo+SvSspXXR9gj\r\nIBBPM5iQn9QwHQYDVR0OBBYEFEjmaPkr0rKV10fYIyAQTzOYkJ/UMAwGA1UdEwQF\r\nMAMBAf8wGgYJKoZIhvZ9B0EABA0wCxsFVjMuMGMDAgbAMA0GCSqGSIb3DQEBBQUA\r\nA4GBAFjOKer89961zgK5F7WF0bnj4JXMJTENAKaSbn+2kmOeUJXRmm/kEd5jhW6Y\r\n7qj/WsjTVbJmcVfewCHrPSqnI0kBBIZCe/zuf6IWUrVnZ9NA2zsmWLIodz2uFHdh\r\n1voqZiegDfqnc1zqcPGUIWVEX/r87yloqaKHee9570+sB3c4\r\n-----END CERTIFICATE-----",
  //"wxSecurt" : "91b80771360be2c27901e04febeb704e"
};


//redis配置信息
config.redisAuth='Trutymaker201506';
config.redisIp='120.25.103.145';
config.redisProt=6379;
//config.redisAuth='Trutymaker201506';
//config.redisIp='120.25.217.213';
//config.redisProt=6379;

module.exports = config;