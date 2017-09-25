/*处理给DOM添加事件的兼容*/
function addEvent(element,type,handler) {
    if(element.addEventListener){
        element.addEventListener(type,handler,false);
    }else if(element.attachEvent){
        element.attachEvent('on'+type,handler);
    }else{
        element['on'+type]=handler;
    }
}
addEvent(window,'load',function () {
    var uploader=document.querySelectorAll('#uploader')[0];
    var button=document.querySelectorAll('#button')[0];
    var upbox=document.querySelectorAll('.upbox')[0];
    var files,filesLen,newFileURL,newFile;
    var filesArray=[],newURL,ThumbnailArray=[];
    var test=document.querySelectorAll('#test')[0];
    /*创建缩略图样式*/
    function createThumbnailFromUrl(context,fileURL) {
        /*创建元素*/
        var img=document.createElement('img'),
            imgBox=document.createElement('div'),
            progressFont=document.createElement('div'),
            imgContent=document.createElement('div');
        /*添加Class*/    
        imgBox.classList.add('img-box');
        progressFont.classList.add('progress-font');
        imgContent.classList.add('img-content');
        /*动态插入创建的元素*/ 
        context.appendChild(imgContent);
        imgContent.appendChild(progressFont);
        imgContent.appendChild(imgBox);
        imgBox.appendChild(img);
        
        /*创建canvas重绘缩略图*/
        var canvas=document.createElement('canvas');
        var context=canvas.getContext('2d'); 
        /*创建image对象*/
        var image=new Image();
        image.src=fileURL;
        image.onload=function (event) {
            /*这里设置了canvasWidth，控制canvas重绘后产生的缩略图大小*/
            var canvasWidth=360;
            canvas.width=canvasWidth;
            canvas.height=canvasWidth*(image.height/image.width);
            /*计算canvas绘图时候的位置，从而保证缩略图从中间开始显示，超出部分隐藏*/
            var num=(canvasWidth-(canvasWidth*(image.height/image.width)))/2;            
            context.drawImage(image,-num,0,canvas.width,canvas.height);
            img.src=canvas.toDataURL('image/png',1);
            /*寻找到对应的缩略图的进度div*/
            ThumbnailArray.push(img.parentNode.previousSibling);
        }  
    }
    /*input选框change事件，取得文件，创建缩略图*/
    addEvent(uploader,'change',function (event) {
        var e=event||window.event;
        var target=e.target;
        files=target.files;
        filesLen=files.length;
        var fileURL;
        for(let i=0;i<filesLen;i++){
            var reader=new FileReader();
            //文件读取结束后要做的事
            reader.onload=function (event) {
                //读取用户选择的文件
                fileURL=event.target.result;
                //根据读取的文件创建缩略图
                createThumbnailFromUrl(upbox,fileURL);                
                //上传前改变图片的格式
                //创建canvas重绘缩略图    
                var canvas=document.createElement('canvas');
                var context=canvas.getContext('2d'); 
                // 创建image对象
                var image=new Image();
                //这里把fileURL赋值给src，就可以拿到用户选择的图片，此时可以获取到图片的宽高
                image.src=fileURL;
                image.onload=function (event) {                    
                    canvas.width=image.width/2;
                    canvas.height=image.width/2*(image.height/image.width);
                    context.drawImage(image,0,0,canvas.width,canvas.height);
                    /*这里设置了向后台传图时候的格式已经质量*/
                    newURL=canvas.toDataURL('image/jpeg',0.5);
                    filesArray.push(newURL);
                }    
            }
            reader.readAsDataURL(files[i]);
        }
    });
    //button按钮点击上传
    addEvent(button,'click',function () {
        if(filesArray.length!=0){
            var data=new FormData();
            var i=0;
            while(i<filesLen){
                data.append('file'+i,filesArray[i]);
                i++;
            }
            var xhr = new XMLHttpRequest();
            //必须在open之前指定onreadystatechange才能保证跨浏览器兼容性！！！！
            xhr.onreadystatechange=function () {
                if(xhr.readyState==4){
                    if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
                        //console.log(xhr.responseText);
                    }else{
                        alert('请求失败'+xhr.status);
                    }                    
                }
            };
            xhr.upload.onprogress=function (event) {
                var e=event||window.event;
                var percentComplete = Math.ceil((e.loaded / e.total)*100);
                var progressFont=document.querySelectorAll('.progress-font');
                for(let i=0;i<filesArray.length;i++){
                    ThumbnailArray[i].innerHTML=percentComplete +'%';
                }
            }
            /*上传完成后滞空数组，保证下次上传不会重复上传*/
            xhr.upload.onload=function () {
                filesArray=[];
                ThumbnailArray=[];
                alert('上传完成，数组置空');                
            }
            xhr.open('post','uploader.php',true); 
            xhr.send(data);
        }        
    })
});