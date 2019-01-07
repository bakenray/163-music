{
    let view={
        el:'.playBox',
        template:`
        <h1>{{name}}</h1>
        <h5>{{singer}}</h5>
        `,
        render(data){
            let {song,status} = data
            $(this.el).find('.playBox-bg').css('background-image',`url(${song.cover})`)
            $(this.el).find('.singger-img').attr('src',song.cover)

            $(this.el).find('.title').html(
                this.template
                .replace('{{name}}',song.name)
                .replace('{{singer}}',song.singer)
            )
            if($(this.el).find('audio').attr('src') !== song.url){
                $(this.el).find('audio').attr('src',song.url)
            }
            if(status ==='playing'){
                $(this.el).find('.singger-img').addClass('playing')
                $(this.el).find('.bg-img').addClass('playing')
            }
            else{
                $(this.el).find('.singger-img').removeClass('playing')
                $(this.el).find('.bg-img').removeClass('playing')
            }
        },
        playSong(){
            $(this.el).find('audio')[0].play()
            $(this.el).find('.play-rod').addClass('active')
            this.removePlayBtn()
            this.startCircle()
        },
        pauseSong(){
            $(this.el).find('audio')[0].pause()
            $(this.el).find('.play-rod').removeClass('active')
            this.addPlayBtn()
            this.stopCircle()
        },

        removePlayBtn(){
            $(this.el).find('.play-btn').removeClass('play-btn').addClass('pause-btn')
        },
        addPlayBtn(){
            $(this.el).find('.playimgControl').addClass('play-btn').removeClass('pause-btn')
        },
        startCircle(){
            $(this.el).find('.singger-img').addClass('circleAni')
            $(this.el).find('.bg-img').addClass('circleAni')
        },
        stopCircle(){
            $(this.el).find('.singger-img').removeClass('circleAni')
            $(this.el).find('.bg-img').removeClass('circleAni')
        }
    }
    let model= {
        data:{
            song:{
                id:'',
                name:'',
                singer:'',
                url:''
            },
            status:'paused'
        },
        getId(id){
            var query = new AV.Query('Song');
            return query.get(id).then((song) =>{
                Object.assign(this.data.song,{id:song.id, ...song.attributes})
                return song
            },  (error) =>{
                console.log(error)
            })
        }
    }
    let controller={
        init(view,model){
            this.view = view
            this.model = model
            let id = this.getSongId()
            this.model.getId(id).then(()=>{
                this.view.render(this.model.data)
            })
            this.bindEvents()
        },
        bindEvents(){
            $(this.view.el).on('click','.play-btn',()=>{
                this.model.data.status =  'playing'
                this.view.render(this.model.data)
                this.view.playSong()
            })
            $(this.view.el).on('click','.pause-btn',()=>{
                this.model.data.status =  'paused'
                this.view.render(this.model.data)
                this.view.pauseSong()
            })
        },
        getSongId(){
            let search = window.location.search
            if(search.indexOf('?') === 0){
                search = search.substring(1)
            }
            let array = search.split('&').filter((v=>v))
            let id = ''
            for(let i = 0;i<array.length;i++){
                let kv =array[i].split('=')
                let key = kv[0]
                let value = kv[1]
                if(key ==='id'){
                    id = value
                    break
                }
            }
            return id
        }
    }
controller.init(view,model)
}
