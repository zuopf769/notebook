    // redirect to https,https小流量测试
    var smallFlowType = smallFlow(req, res, httpsSmallFlowConf);
    // console.log('smallFlowType', smallFlowType);

    if (smallFlowType && 'https' === smallFlowType) {
        res.redirect(301, 'https://' + req.hostname +  req.originalUrl);
    }
    else {
        var cookiename = 'https_inner_test';
        var cookies = req.cookies || {};

        if (cookies[cookiename] && cookies[cookiename] === '1') {
            res.redirect(301, 'https://' + req.hostname +  req.originalUrl);
        }
    }