{
    let view={
        el:'.page>main',
        template:`
        <div class="main-box">
            <h1>新建歌曲</h1>
            <form class="form">
                    <div class="row">
                        <label>歌曲名字：</label>
                        <input type="text">
                    </div>
                    <div class="row">
                            <label>歌手名字：</label>
                            <input type="text">
                    </div>  
                    <div class="row">
                            <label>外部连接：</label>
                            <input type="text">
                    </div>     
                    <div class="row">
                        <button type="submit">保存</button>
                    </div>         
            </form>
        </div>
        `,
        render(data){
            $(this.el).html(this.template)
        }
    }
    let model ={}
    let controller={
        init(view,model){
            this.view =view
            this.model =model
            this.view.render(this.model.data)
        }
    }
    controller.init(view,model)
}