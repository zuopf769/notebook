<div class="kgrecommend-wrap">
</div>
<{script}>
	require.async(['widget/ui/lib/jquery/jquery.js','widget/lib/tangram/base/base.js','widget/lib/fis/data/data.js','widget/kg_recommend/util/config.js'], function ($, T, Data, config) {

        // 在原来的view页面底部——你可能喜欢（stru_recom.tpl）模块没有数据就派发kgRecommendview
        T.lang.eventCenter.addEventListener('kgRecommendview', kgRecommendviewRender);

        function kgRecommendviewRender () {

            /*
            // 小流量
            var smallflow = 0;
            var baiduId = T.cookie.get('BAIDUID');
            var smallArray = [1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
            if (baiduId) {
                var index =  parseInt(baiduId.substr(0, 6), 16) % 10;
                smallflow = smallArray[index];
            }

            if (baiduId && (baiduId === '8A6137356C0DD7F85B862877FCC6FBCA:FG=1'
                || baiduId === '37E481AA5139B02C5EB9EA157E2FC782:FG=1'
                || baiduId === 'C11BCFCCC8E8E22492EA68DA7634DE2F:FG=1')) {
                smallflow = 1;
            }

            if (smallflow === 0) {
                return;
            }
            */

            // 全局变量
            Data.set( "docId", '<{$docInfo.docId|fcrypt}>');

            // 请求总接口，判断是否有知识图谱相关推荐模块
            var url = config.url[config.type['getrelinfo']];
            var options = {
                doc_id: '<{$docInfo.docId|fcrypt}>'
            };
            $.getJSON(url + '?callback=?', options).then(function(data) {
                if (data.code === 0) {
                    require.async(['wkview:widget/kg_recommend/kg_recommend.js'], function(kgRecommend) {
                        // 入口文件
                        new kgRecommend.main({
                            'el': '.kgrecommend-wrap',
                            'docId': '<{$docInfo.docId|fcrypt}>',
                            'data': data
                        });
                    });
                }
            });
        }
	});
<{/script}>
