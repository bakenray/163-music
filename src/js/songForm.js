{
    let view={
        el:'.page>main',
        init(){
            this.$el =$(this.el)
        },
        template:`
        <div class="main-box">
            
            <h1>新建歌曲</h1>
            <form class="form">
                    <div class="row">
                        <label>歌曲名字：</label>
                        <input name="name" type="text" value="__name__" autocomplete="off">
                    </div>
                    <div class="row">
                        <label>歌手名字：</label>
                        <input name="singer" type="text" value="__singer__" autocomplete="off">
                    </div>  
                    <div class="row">
                        <label>外部连接：</label>
                        <input name="url" type="text" value="__url__" autocomplete="off">
                    </div>     
                    <div class="row">
                        <button type="submit">保存</button>
                    </div>         
            </form>
        </div>
        `,
        render(data={}){
            let placeholders =['name','url','singer','id']
            let html =this.template
            placeholders.map((string)=>{
                html =html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
        },
        reset(){
            this.render({})
        }
    }
    let model ={
        data:{
            name:'',
            singer:'',
            url:'',
            id:''
        },
        create(data){
            var Song = AV.Object.extend('Song'); // 声明类型
            var song = new Song();              // 新建对象

            song.set('name',data.name);
            song.set('singer',data.singer);
            song.set('url',data.url);
            return song.save().then((newSong)=> {
              let {id,attributes} = newSong
              Object.assign(this.data,{id,...attributes})
            },(error) =>{
              console.error(error);
            });
        }
    }
    let controller={
        init(view,model){
            this.view =view
            this.model =model
            this.view.init()
            this.bindEvents()
            this.view.render(this.model.data)
            window.eventHub.on('upload',(data)=>{
                this.model.data =data
                this.view.render(this.model.data)
            })
            window.eventHub.on('select',(data)=>{
                this.model.data =data 
                this.view.render(this.model.data)
            })
        },
        bindEvents(){
            this.view.$el.on('submit','form',(e)=>{
                e.preventDefault()
                let needs = 'name singer url'.split(' ')
                let data ={}
                needs.map((string)=>{
                    data[string]=this.view.$el.find(`[name="${string}"]`).val()
                })
                this.model.create(data)
                    .then(()=>{
                        this.view.reset()
                        let string =JSON.stringify(this.model.data)
                        let object =JSON.parse(string)
                        
                        if(object.name !==''||object.url !==''){
                            window.eventHub.emit('created',object)
                        }
                        
                    })
            })
        }
    }
    controller.init(view,model)
}