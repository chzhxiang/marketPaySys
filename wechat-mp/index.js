/**
 * Created by Youhn on 2015/8/16.
 */
var WeChatAPI = require('./lib/common-api');
//�ͷ���Ϣ����
WeChatAPI.mixin(require('./lib/custom-api'));
//�ͷ�����
WeChatAPI.mixin(require('./lib/custom-service-api'));
//�������
WeChatAPI.mixin(require('./lib/groups-api'));
//�˵�����
WeChatAPI.mixin(require('./lib/menu-api'));
//�û�����
WeChatAPI.mixin(require('./lib/user-api'));
//����ͳ�Ʒ�������
WeChatAPI.mixin(require('./lib/data-analysis-api'));
//Ⱥ����Ϣ����
WeChatAPI.mixin(require('./lib/mass-message-api'));
//��ʱ�زĹ���
WeChatAPI.mixin(require('./lib/media-api'));
//�����زĹ���
WeChatAPI.mixin(require('./lib/material-api'));
//��ά�����
WeChatAPI.mixin(require('./lib/qrcode-api'));
//�����ӹ���
WeChatAPI.mixin(require('./lib/short-url-api'));
//ģ����Ϣ����
WeChatAPI.mixin(require('./lib/template-message-api'));
//΢��IP��ַ����
WeChatAPI.mixin(require('./lib/wxip-api'));

module.exports = WeChatAPI;