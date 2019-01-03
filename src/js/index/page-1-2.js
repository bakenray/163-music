{
    let view = {
        el:'.new-songs',
        init(){
            this.$el = $(this.el)
        },
        render(data){
            let {newSongs} = data

            newSongs.map((song)=>{
                let $li = $(`
                <li>
                    <div class="newSong-list">
                        <h5>${song.name}</h5>
                        <p>${song.singer}</p>
                    </div>
                    <span class="icon-play"></span>
                </li>
                `)
                this.$el.find('ul.new-songs-list').append($li)
            })
        }
    }
    let model = {
        data:{
            newSongs:[]
        },
        find(){
            var query =  new AV.Query('Song')
            return query.find().then((songs)=>{

                this.data.newSongs = songs.map((song)=>{
                    return {id:song.id,...song.attributes}
                })
                return  songs
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            this.model.find().then(()=>{
               this.view.render(this.model.data)
            })
        }
    }
    controller.init(view,model)
}