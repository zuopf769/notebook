define([], function(){
    var isArray = Array.isArray;
    var key, c;
    return {
        forEach: function(obj, context){
            if(isArray(obj)){
                obj.forEach(context);
            }else{
                for(key in obj){
                    if(obj.hasOwnProperty(key)){
                        context(obj[key]);
                    }
                }
            }
        },
        count: function(obj){
            if(isArray(obj)){
                return obj.length;
            }else{
                c = 0;
                for(key in obj){
                    if(obj.hasOwnProperty(key)){
                        c++;
                    }
                }
                return c;
            }
        }
    }
});