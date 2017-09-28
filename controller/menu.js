
exports.menu = (req,res) => {
    return res.json({code:200,msg:'',data:[{
        id: 1,
        name: '用户列表',
        icon: 'user',
        router: '/user',
      },
      {
        id: 2,
        icon: 'file',
        bpid: 1,
        name: '招标书',
        router: '/word',
      },
      {
        id: 3,
        icon: 'credit-card',
        bpid: 1,
        name: '设备各项参数',
        router: '/eTechnicalStd',
      },
    ]})
}