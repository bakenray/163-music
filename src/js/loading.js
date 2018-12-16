{
    let view={
        el:'#siteLoading',
        showLoding(){
            $(this.el).addClass('active')
        },
        hideLoding(){
            $(this.el).removeClass('active')
        }
    }
    let model={}
    let controller={
        init(view){
            this.view = view
            this.bindEvents()
        },
        bindEvents(){
            window.eventHub.on('beforeUpload',()=>{
                this.view.showLoding()
            })
            window.eventHub.on('afterUpload',()=>{
                this.view.hideLoding()
            })
        }
    }
    controller.init(view)
}