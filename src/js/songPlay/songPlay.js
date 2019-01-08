{
    let view={
        el:'.playBox',
        template:
        `
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
                var audio = $(this.el).find('audio').attr('src',song.url).get(0)
                audio.onended = ()=>{ window.eventHub.emit('songEnd') }
                audio.ontimeupdate = ()=>{
                    this.showLyrics(audio.currentTime)
                }
            }
            if(status ==='playing'){
                $(this.el).find('.singger-img').addClass('circleAni')
                $(this.el).find('.bg-img').addClass('circleAni')
                $(this.el).find('.play-rod').addClass('active')
            }
            else{
                $(this.el).find('.singger-img').removeClass('circleAni')
                $(this.el).find('.bg-img').removeClass('circleAni')
                $(this.el).find('.play-rod').removeClass('active')
            }
            let {lyrics} = song
 
            lyrics.split('\n').map((string)=>{
                let p = document.createElement('p')
                let regex = /\[([\d:.]+)\](.+)/
                let matches = string.match(regex)
                if(matches){
                    p.textContent = matches[2]
                    let time = matches[1]
                    let parts = time.split(':')
                    let minutes = parts[0]
                    let seconds = parts[1]
                    let newTime = parseInt(minutes,10)*60 + parseFloat(seconds,10)
                    p.setAttribute('data-time',newTime)
                }
                else{
                    p.textContent = string
                }
                $(this.el).find('.lyrics').append(p)
            })
        },
        showLyrics(time){
            let allP = $(this.el).find('.lyrics>p')
            let p
            for(let i = 0; i<allP.length;i++){
            
                if(i === allP.length-1){
                    p = allP[i]
                    break
                }
                else{
                    let currentTime =allP.eq(i).attr('data-time')
                    let nextTime = allP.eq(i+1).attr('data-time')
                    if(currentTime <= time && time <= nextTime){
                       p = allP[i]
                       break
                    }
                }
            }
            let pHeight =p.getBoundingClientRect().top
            let lyricsHeight = $(this.el).find('.songWords')[0].getBoundingClientRect().top 
            let height = pHeight -lyricsHeight
            console.log(height)
            $(this.el).find('.lyrics').css({
                transform: `translateY(${-height+55}px)`
            })
            $(p).addClass('active').siblings('.active').removeClass('active')
        },
        playSong(){
            $(this.el).find('audio')[0].play()
            this.removePlayBtn()
            // this.startCircle()
        },
        pauseSong(){
            $(this.el).find('audio')[0].pause()
            this.addPlayBtn()
            // this.stopCircle()
        },
        removePlayBtn(){
            $(this.el).find('.play-btn').removeClass('play-btn').addClass('pause-btn')
        },
        addPlayBtn(){
            $(this.el).find('.playimgControl').addClass('play-btn').removeClass('pause-btn')
        },
        // startCircle(){
        //     $(this.el).find('.singger-img').addClass('circleAni')
        //     $(this.el).find('.bg-img').addClass('circleAni')
        // },
        // stopCircle(){
        //     $(this.el).find('.singger-img').removeClass('circleAni')
        //     $(this.el).find('.bg-img').removeClass('circleAni')
        // },
        goback(){
            window.history.go(-1);
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
            $(this.view.el).on('click','.backBtn',()=>{
                this.view.goback()
            })
            window.eventHub.on('songEnd',()=>{
                this.model.data.status =  'paused'
                this.view.render(this.model.data)
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