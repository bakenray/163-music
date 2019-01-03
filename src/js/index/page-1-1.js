{
    let view = {
        el:'.song-list',
        init(){
            this.$el = $(this.el)
        }
    }
    let model = {
        data:{
            songLists:[]
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model

        }
    }
    controller.init(view,model)
}