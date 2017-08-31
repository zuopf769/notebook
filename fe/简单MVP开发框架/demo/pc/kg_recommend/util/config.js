/**
 * @file config.js
 * @author zuopengfei01
 */
var domain = '//xx.com';
var debug = false;
if (debug === true) {
    domain = 'xx.com:8099';
}
module.exports = {
    type: {
        getrelinfo: 'GETRELINFO_INTERFACE',
        getCardDocsByEntid: 'GETCARDDOCSBYENTID_INTERFACE',
        getDoclistByPn: 'GETDOCLISTBYPN_INTERFACE'
    },
    url: {
        GETRELINFO_INTERFACE: domain + '/knowledge/pc/getpcentityinfo',
        GETCARDDOCSBYENTID_INTERFACE: domain + '/knowledge/pc/getpcinfobyentid',
        GETDOCLISTBYPN_INTERFACE: domain + '/knowledge/pc/getspecificpageinfo'
    },
    rn: 20
};
