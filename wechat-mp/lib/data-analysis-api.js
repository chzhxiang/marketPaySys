/**
 * Created by Youhn on 2015/8/22.
 * API:http://mp.weixin.qq.com/wiki/3/ecfed6e1a0a03b5f35e5efac98e864b7.html
 */
var util = require('./util');
var methods = [
    // �û��������ݽӿ�
    'getUserSummary', // ��ȡ�û���������
    'getUserCumulate', // ��ȡ�ۼ��û�����
    // ͼ�ķ������ݽӿ�
    'getArticleSummary', // ��ȡͼ��Ⱥ��ÿ������
    'getArticleTotal', // ��ȡͼ��Ⱥ��������
    'getUserRead', // ��ȡͼ��ͳ������
    'getUserReadHour', // ��ȡͼ��ͳ�Ʒ�ʱ����
    'getUserShare', // ��ȡͼ�ķ���ת������
    'getUserShareHour', // ��ȡͼ�ķ���ת����ʱ����
    // ��Ϣ�������ݽӿ�
    'getUpstreamMsg', //��ȡ��Ϣ���͸ſ�����
    'getUpstreamMsgHour', // ��ȡ��Ϣ���ͷ�ʱ����
    'getUpstreamMsgWeek', // ��ȡ��Ϣ����������
    'getUpstreamMsgMonth', // ��ȡ��Ϣ����������
    'getUpstreamMsgDist', // ��ȡ��Ϣ���ͷֲ�����
    'getUpstreamMsgDistWeek', // ��ȡ��Ϣ���ͷֲ�������
    'getUpstreamMsgDistMonth', // ��ȡ��Ϣ���ͷֲ�������
    // �ӿڷ������ݽӿ�
    'getInterfaceSummary', // ��ȡ�ӿڷ�������
    'getInterfaceSummaryHour' // ��ȡ�ӿڷ�����ʱ����
];
/**
 * // �û��������ݽӿ�
 * api.getUserSummary(startDate, endDate, callback); // ��ȡ�û���������
 * api.getUserCumulate(startDate, endDate, callback); // ��ȡ�ۼ��û�����
 * // ͼ�ķ������ݽӿ�
 * api.getArticleSummary(startDate, endDate, callback); // ��ȡͼ��Ⱥ��ÿ������
 * api.getArticleTotal(startDate, endDate, callback); // ��ȡͼ��Ⱥ��������
 * api.getUserRead(startDate, endDate, callback); // ��ȡͼ��ͳ������
 * api.getUserReadHour(startDate, endDate, callback); // ��ȡͼ��ͳ�Ʒ�ʱ����
 * api.getUserShare(startDate, endDate, callback); // ��ȡͼ�ķ���ת������
 * api.getUserShareHour(startDate, endDate, callback); // ��ȡͼ�ķ���ת����ʱ����
 * // ��Ϣ�������ݽӿ�
 * api.getUpstreamMsg(startDate, endDate, callback); // ��ȡ��Ϣ���͸ſ�����
 * api.getUpstreamMsgHour(startDate, endDate, callback); // ��ȡ��Ϣ���ͷ�ʱ����
 * api.getUpstreamMsgWeek(startDate, endDate, callback); // ��ȡ��Ϣ����������
 * api.getUpstreamMsgMonth(startDate, endDate, callback); // ��ȡ��Ϣ����������
 * api.getUpstreamMsgDist(startDate, endDate, callback); // ��ȡ��Ϣ���ͷֲ�����
 * api.getUpstreamMsgDistWeek(startDate, endDate, callback); // ��ȡ��Ϣ���ͷֲ�������
 * api.getUpstreamMsgDistMonth(startDate, endDate, callback); // ��ȡ��Ϣ���ͷֲ�������
 * // �ӿڷ������ݽӿ�
 * api.getInterfaceSummary(startDate, endDate, callback); // ��ȡ�ӿڷ�������
 * api.getInterfaceSummaryHour(startDate, endDate, callback); // ��ȡ�ӿڷ�����ʱ����
 */
methods.forEach(function (method) {
    exports[method] = function (begin, end, callback) {
        var that=this;
        this.preRequest(function (begin, end, callback) {
            var data = {
                begin_date: begin,
                end_date: end
            };
            var url = 'https://api.weixin.qq.com/datacube/' + method.toLowerCase() + '?access_token=' + this.token.accessToken;
            that.request(url, util.postJSON(data), util.wrapper(callback));
        }, arguments);
    };
});