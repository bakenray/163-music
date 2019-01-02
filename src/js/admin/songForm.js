{
    let view={
        el:'.page>main',
        elSon:'.page>main>.main-box',
        init(){
            this.$el =$(this.el)
        },
        template:`
        <div class="main-box">
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
                    <div class="row submitRow">
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

            if(data.id){
                $(this.elSon).prepend('<h1>编辑歌曲</h1>')
            }
            else{
                $(this.elSon).prepend('<h1>新建歌曲</h1>')
            }
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
        },
        update(data){
            var song = AV.Object.createWithoutData('Song',this.data.id)
            song.set('name',data.name)
            song.set('singer',data.singer)
            song.set('url',data.url)
            return song.save().then((response)=>{
                Object.assign(this.data,data)
                return response
            })
        }
    }
    let controller={
        init(view,model){
            this.view =view
            this.model =model
            this.view.init()
            this.bindEvents()
            this.view.render(this.model.data)

            window.eventHub.on('select',(data)=>{
                this.model.data =data 
                this.view.render(this.model.data)
            })
            window.eventHub.on('new',(data)=>{
                if(this.model.data.id){
                    this.model.data ={name:'',singer:'',url:'',id:''}
                }
                else{
                    Object.assign(this.model.data,data)
                }
                this.view.render(this.model.data)
            })
        },
        create(){
            let data ={}
            let needs = 'name singer url'.split(' ')
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
        },
        update(){
            let data ={}
            let needs = 'name singer url'.split(' ')
            needs.map((string)=>{
                data[string]=this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.update(data)
                .then(()=>{
                    window.eventHub.emit('update',JSON.parse(JSON.stringify(this.model.data)))
                })
        },
        bindEvents(){
            this.view.$el.on('submit','form',(e)=>{
                e.preventDefault()

                if(this.model.data.id){
                    this.update()
                }
                else{
                    this.create()
                }
            })
        }
    }
    controller.init(view,model)
}