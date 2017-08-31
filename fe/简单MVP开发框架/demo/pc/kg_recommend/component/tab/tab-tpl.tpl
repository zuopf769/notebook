{{~ it.items :value:index}}
<li class="tab-item {{?index == 0}}active{{?}}">
    <span class="tab-item-title" data-id="{{=value.ent_uuid}}">{{=value.ent_name}}</span>
</li>
{{~}}
