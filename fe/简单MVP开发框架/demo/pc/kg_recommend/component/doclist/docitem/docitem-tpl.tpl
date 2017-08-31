<div class="item clearfix">
    <div class="title-wrap">
        <b class="ic ic-{{=it.type}}"></b>
        <a class="title log-xsend" data-icon="{{=it.icon}}" data-logxsend="[1,101200, {'icon':'{{=it.icon}}'}]" href="{{=it.uri}}" title='{{=it.title}}' target="_blank">{{=it.title}}</a>
    </div>
    <span class="price">{{=it.pay}}</span>
    <span class="score" title='{{=it.score}}分'>{{=it.scoreStr || ''}}</span>
</div>
