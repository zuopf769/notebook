{{? it.score }}
    <span>
        {{ for(var i=0; i < it.onNum; i++) { }}
        <b class="ic ic-star-s-on"></b>
        {{ } }}
        {{? it.halfNum == 1 }}
        <b class="ic ic-star-s-half"></b>
        {{?}}
        {{ for(var j=0; j < it.offNum; j++) { }}
        <b class="ic ic-star-s-off"></b>
        {{?}}
    </span>
{{??}}
    暂无评价
{{?}}
