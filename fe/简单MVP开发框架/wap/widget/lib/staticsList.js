/**
 * @file staticsList.js
 * @desc 老的nsclick 统计条目
 */

module.exports = {
    // 'pv': true,
    click: {
        // 昼夜切换
        w2b: 100001,
        // 添加书签
        // param docid
        abm: 100002,
        // 返回首页
        vbh: 100003,
        // 返回上一页
        vbb: 100004,
        // 字体调节
        // zoom [optional] 0/1 1=>zoomin 0=>zoomout
        font: 100005,
        // 去往书签
        showbookmark: 100006,
        // 收藏
        // param docid
        abf: 100007,
        // 评分
        scr: 100008,
        // 分享
        shr: 100009,
        // 跳到推荐
        v2r: 100010,
        // 广告
        // param url 广告链接
        // param terminal ios|android
        // param position 位置
        // param page 页数
        adv: 100011,
        // 专题推广
        // param title
        // param url
        topic: 100012,
        imageShare: 100013,
        image: 100014,
        // 进度条
        // param targetPage 目标页
        progressbar: 100015,
        // 点击相关推荐文档
        viewRecDoc: 100016,
        // 向上翻大页
        viewUpPage: 100017,
        // 向下翻大页
        viewDownPage: 100018,
        // 下载客户端框中的下载客户端按钮点击量
        nativeDownload: 100019,
        // 更多按钮
        more: 100020,
        // ppt的进度调整
        select: 100021,
        // ppt前一页点击量
        pptprev: 100022,
        // ppt后一页点击量
        pptnext: 100023,
        // 双指缩放
        dbzoom: 100024,
        // pinch
        pptpinch: 100025,
        pptswipeprev: 100026,
        pptswipenext: 100027,
        // 调用客户端下载按钮的点击
        downloadDoc: 100028,
        // 韩寒的五篇文档的首页广告点击
        // 'docformHH_first_page_adv': 100029,
        // 图书目录
        bookCat: 10030,
        // 图书更多
        bookMore: 10031,
        // 图书字体
        bookFont: 10032,
        // 图书日夜切换
        bookDN: 10033,
        // 图书背景选择
        bookBg: 10034,
        // 图书相关推荐
        bookRelative: 10035,
        // 图书加书签
        bookAddmark: 10036,
        // 图书收藏
        bookFav: 10037,
        // 图书目录切页
        bookCatClick: 10038,
        // 图书分页切页
        bookPageClick: 10039,
        // docReader底部广告点击
        adBottomClick: 10040,


        // rtcs的相关统计
        // rtcs更多
        rtcsMore: 10041,
        // rtcs字号大小
        rtcsFont: 10042,
        // rtcs昼夜切换
        rtcsDN: 10043,
        // rtcs切回旧版
        rtcs2xreader: 10044,
        // rtcs相关文档
        rtcsRelative: 10045,
        // rtcs添加书签
        rtcsAddBook: 10046,
        // rtcs加入我的文库
        rtcsAddFav: 10047,
        // rtcs大图查看
        rtcsBigPicture: 10048,
        // rtcs大表格查看
        rtcsBigTable: 10049,
        // rtcs上一页
        rtcsPrev: 10050,
        // rtcs下一页
        rtcsNext: 10051,
        // bdjson 图书播放器na调起量
        openYDna: 10052,
        // bdjson 图书播放器na下载量
        downYDna: 10053,
        // xreader day or night
        dn: 10054
    },
    show: {
        // 广告
        // param url 广告链接
        // param terminal ios|android
        // param position 位置
        // param page 页数
        adv: 110001,
        // 专题推广
        // param title
        // param url
        topic: 110002,
        // 下载客户端框展现量
        showNativeDownload: 110003,
        // 来自韩寒新书的五个节选文档
        lastPageAd: 110004
    },
    perform: {
        // 加载时间
        // param duration millisecond
        loadtime: 120001
    },
    // 翻页
    // param doc_id
    // param doc_id_update
    // param pn
    // param page_count
    // param is_first
    // param is_visited
    // param page 值为'view'
    pv: 1,
    behavepv: 2
};
