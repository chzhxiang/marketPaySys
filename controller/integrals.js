/**
 * 积分
 */
const pm = require('./../models/publicModel.js');
const integrals = new pm('integrals');

 /**
 * 分页获取积分列表
 * 
 * @params = {
 *     page_size:10,
 *     page:1;
 * }
 */

exports.getIntegralList = (req,res) => {
    const query = { userId: req.user.user._id };
    const sort = ['times', -1];
    const page_size = Number(params.page_size);
    const page = Number(params.page);

    integrals.pagesSel(query, page_size, page, sort, (data) => {
        try {
            return res.send(data);

        } catch (error) {
            console.log(error);
        }
    })
 }